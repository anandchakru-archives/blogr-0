import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './components/editor/editor.component';
import { SecureRoutingModule } from './secure-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    SecureRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SecureModule { }
