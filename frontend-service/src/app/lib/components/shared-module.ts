import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import {TuiButtonModule} from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {TuiAvatarModule} from '@taiga-ui/experimental';

@NgModule({
    declarations: [NavbarComponent],
    exports: [NavbarComponent],
    imports: [CommonModule, ReactiveFormsModule, FormsModule,TuiButtonModule,TuiAvatarModule]  
  })
  export class SharedModule { }