# Blogr

```sh
ng new blogr --style scss --prefix rathnas --routing=true
npm i @fortawesome/fontawesome-free firebase @angular/fire angularfire2 ngx-markdown bootstrap popper.js jquery

ng g component components/home
ng g component components/post
ng g component components/signin
ng g component components/http404
ng g service services/app

ng g module modules/secure --routing
ng g component modules/secure/components/editor

ng g guard guards/auth

npm install -g firebase-tools

```
