import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { Item, TextWithClasses, ImageWithClasses } from 'src/app/util/blogr.model';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'rathnas-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  pid = 'new';
  post: Item;
  fg: FormGroup;
  saving = false;
  constructor(public route: ActivatedRoute, public app: AppService, public fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.route.snapshot.params.pid) {
      this.pid = this.route.snapshot.params.pid;
    }
    if (this.pid === 'new') {
      this.post = {
        title: { text: '', classes: ['h1'] },
        subTitle: { text: '', classes: ['h5'] },
        image: { src: '', classes: [], height: '', width: '' },
        body: { text: '', classes: [''] },
        footer: { text: '', classes: ['h6'] }
      };
      this.setupForm();
    } else {
      this.app.readPost(this.pid, (post: Item) => {
        this.post = post;
        this.setupForm();
      });
    }
  }
  setupForm() {
    this.fg = this.fb.group({
      _id: this.pid,
      body: this.textWithClassesForm(this.post.body),
      footer: this.textWithClassesForm(this.post.footer),
      image: this.imgWithClassesForm(this.post.image),
      subTitle: this.textWithClassesForm(this.post.subTitle),
      title: this.textWithClassesForm(this.post.title)
    });
  }
  textWithClassesForm(ip: TextWithClasses) {
    return ip && this.fb.group({
      text: ip.text, classes:
        ip.classes && ip.classes.length && this.fb.array(ip.classes.map(elem => this.fb.group({ elem })))
    });
  }
  imgWithClassesForm(ip: ImageWithClasses) {
    return ip && this.fb.group({
      src: ip.src, classes:
        ip.classes && ip.classes.length && this.fb.array(ip.classes.map(elem => this.fb.group({ elem }))),
      height: ip.height,
      width: ip.width
    });
  }
  textWithClasses(ip: AbstractControl): TextWithClasses {
    return {
      text: ip.get('text') ? ip.get('text').value : '',
      classes: ip.get('classes') ? (ip.get('classes') as FormArray).controls.map(e => e.get('elem').value) : []
    };
  }
  imgWithClasses(ip: AbstractControl): ImageWithClasses {
    const classesFc = ip.get('classes') ? (ip.get('classes') as FormArray).controls : undefined;
    return {
      src: ip.get('src') ? ip.get('src').value : '',
      classes: classesFc ? classesFc.map(e => e.get('elem').value) : [],
      height: ip.get('height') ? ip.get('height').value : '',
      width: ip.get('width') ? ip.get('width').value : ''
    };
  }
  addClass(section: string) {
    (this.fg.get(section).get('classes') as FormArray).controls.push(this.fb.group({ elem: '' }));
  }
  deleteClass(section: string, clss: string, ci: number) {
    (this.fg.get(section).get('classes') as FormArray).removeAt(ci);
  }
  discardDetails() {
    this.fg.reset();
    this.setupForm();
  }
  saveDetails() {
    this.saving = true;

    const post: Item = {
      title: this.textWithClasses(this.fg.get('title')),
      subTitle: this.textWithClasses(this.fg.get('subTitle')),
      image: this.imgWithClasses(this.fg.get('image')),
      body: this.textWithClasses(this.fg.get('body')),
      footer: this.textWithClasses(this.fg.get('footer'))
    };
    this.app.savePost(this.pid, post, (pid) => {
      this.saving = false;
      this.pid = pid;
    });
  }
}
