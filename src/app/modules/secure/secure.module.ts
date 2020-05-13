import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './components/editor/editor.component';
import { SecureRoutingModule } from './secure-routing.module';



@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,
  ]
})
export class SecureModule { }
