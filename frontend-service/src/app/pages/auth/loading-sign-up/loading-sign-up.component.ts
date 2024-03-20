import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TuiProgressModule } from '@taiga-ui/kit';
import { TUI_IS_E2E } from '@taiga-ui/cdk';
import { of, timer } from 'rxjs';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { SharedModule } from "../../../lib/components/shared-module";

@Component({
  standalone: true,
  selector: 'app-loading-sign-up',
  templateUrl: './loading-sign-up.component.html',
  styleUrls: ['./loading-sign-up.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, SharedModule, TuiProgressModule]
})
export class LoadingSignUpComponent {
  organizationName: string | null = null;
  readonly max = 100;
  readonly value$ = this.isE2E
    ? of(30)
    : timer(300, 200).pipe(
      map(i => i + 30),
      startWith(30),
      takeWhile(value => value <= this.max),
    );



  constructor(@Inject(TUI_IS_E2E) private readonly isE2E: boolean, private route: ActivatedRoute,private router: Router) { }
  loggedIn: boolean = false;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.organizationName = params.get('organizationName');
    });

    // Use RxJS delay to wait for 4 seconds
    timer(4000) // Wait for 4000ms
      .subscribe(() => {
        // After the delay, navigate to another page
        this.router.navigate(['/' + this.organizationName]); // Replace with your actual route
      });
  }
}
