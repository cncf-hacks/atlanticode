import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/lib/components/shared-module';

@Component({
  standalone:true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, RouterModule,SharedModule],
})
export class RegisterComponent {
  loginWithGoogle() {
    window.location.href = `http://localhost:8080/google_login`;
  }

  loginWithGithub() {
    window.location.href = `http://localhost:8080/github_login`;
  }
}
