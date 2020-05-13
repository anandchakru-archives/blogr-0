import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Http404Component } from './components/http404/http404.component';
import { AuthGuard } from './guards/auth.guard';
import { SigninComponent } from './components/signin/signin.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home/:uid', component: HomeComponent },
  { path: 'signin', component: SigninComponent },
  {
    path: 'secure', loadChildren: () => import('./modules/secure/secure.module').then(m => m.SecureModule)
    , data: { preload: false }, canActivate: [AuthGuard]
  },
  { path: '**', component: Http404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
