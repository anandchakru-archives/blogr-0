import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Action, DocumentSnapshot, DocumentChangeAction, AngularFirestore } from '@angular/fire/firestore';
import { BlogData, User, Item, BlogrConstants } from '../util/blogr.model';
import { takeUntil, map } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  provider = new firebase.auth.GoogleAuthProvider();
  blogData: BlogData;
  loaded = false;
  uns = new Subject();
  user: firebase.User;
  appUser: User;
  userSub: Subject<firebase.User> = new ReplaySubject(1);
  appUserSub: Subject<User> = new ReplaySubject(1);
  constructor(public router: Router, private fs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.provider.addScope('profile');
    this.provider.addScope('email');
    this.afAuth.authState.subscribe((user: firebase.User) => {
      this.user = user;
      this.userSub.next(user);
      if (user) { // Authenticated already
        this.loaded = true;
        this.redirect();
        this.readUser();
      } else { // Not Authenticated, logoff
        this.loaded = true;
        this.uns.next();
        this.uns.complete();
      }
    }, (error) => {
      this.loaded = true;
      this.userSub.next(undefined);
    });
  }
  public readPosts(uid: string, cb: () => void) {
    this.blogData = {
      title: '',
      styles: {
        css: '',
        markup: ''
      },
      scripts: {
        animation: ''
      },
      posts: {
        page: {
          pageNumber: 0,
          countPerPage: 10
        },
        items: []
      }
    };
    this.fs.collection<Item>(`users/${uid}/posts`).snapshotChanges().subscribe((dcas: DocumentChangeAction<Item>[]) => {
      this.blogData.posts.items = [];
      dcas.forEach((dca: DocumentChangeAction<Item>) => {
        this.blogData.posts.items.push({
          ...dca.payload.doc.data(),
          _id: dca.payload.doc.id
        });
      });
      if (cb) {
        cb();
      }
    }, (error) => {
      console.log(`Unable to fetch data for ${uid}`);
      if (cb) {
        cb();
      }
    });
  }
  public setRedirect(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const qIndx = state.url.indexOf('?');
    const qp = { queryParams: {} };
    qp.queryParams = next.queryParams;
    localStorage.setItem(BlogrConstants.REDIRECT_AFTER_AUTH_URL, qIndx > 0 ? state.url.substring(0, qIndx) : state.url);
    localStorage.setItem(BlogrConstants.REDIRECT_AFTER_AUTH_QP, JSON.stringify(qp));
  }
  private redirect() {
    const url = localStorage.getItem(BlogrConstants.REDIRECT_AFTER_AUTH_URL);
    const qps = localStorage.getItem(BlogrConstants.REDIRECT_AFTER_AUTH_QP);
    if (url) {
      localStorage.removeItem(BlogrConstants.REDIRECT_AFTER_AUTH_URL);
      localStorage.removeItem(BlogrConstants.REDIRECT_AFTER_AUTH_QP);
      if (qps) {
        const qp: NavigationExtras = JSON.parse(qps);
        this.router.navigate([url], qp);
      } else {
        this.router.navigate([url]);
      }
    }
  }
  public readUser(uid?: string) {
    this.fs.doc<User>('users/' + (uid ? uid : this.user.uid)).snapshotChanges()
      .pipe(takeUntil(this.uns)).subscribe((docSnap: Action<DocumentSnapshot<User>>) => {
        this.appUser = docSnap.payload.data();
        if (this.appUser) {
          this.appUserSub.next(this.appUser);
        } else {
          this.appUser = { role: 'user', email: this.user.email, name: this.user.displayName, photo: this.user.photoURL };
          this.saveUser(() => {
            this.appUserSub.next(this.appUser);
          });
        }
      }, (error) => {
        console.log(`Unable to fetch data for ${uid ? uid : this.user.uid}`);
      });
  }
  public saveUser(cb: () => void) {
    this.fs.collection('users').doc(this.user.uid).set(this.appUser, { merge: true }).then(() => {
      console.log(`User udpated: ${this.user.email}`);
      if (cb) {
        cb();
      }
    }, (error) => {
      console.log(`Error udpating ${error}`);
    });
  }
  google() {
    this.afAuth.signInWithPopup(this.provider).catch((e) => {
      // This browser is not supported or 3rd party cookies and data may be disabled.
      if (e.code === 'auth/web-storage-unsupported' && e.message && e.message.indexOf('cookies') > 0) {
        // this.growl.next(new Growl('Login error', e.message, 'danger'));
      }
    });
  }
  logout() {
    this.afAuth.signOut();
    this.router.navigate(['/', 'home', BlogrConstants.DEFAULT_USER]);
  }
}
