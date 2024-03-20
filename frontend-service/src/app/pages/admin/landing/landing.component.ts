import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/lib/components/shared-module';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiScrollbarModule } from '@taiga-ui/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule, TuiButtonModule, TuiScrollbarModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  constructor(private router: Router) { }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
