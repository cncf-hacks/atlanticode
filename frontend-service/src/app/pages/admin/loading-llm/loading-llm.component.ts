import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TuiProgressModule } from '@taiga-ui/kit';
import { TUI_IS_E2E } from '@taiga-ui/cdk';
import { of, timer } from 'rxjs';
import { map, startWith, takeWhile } from 'rxjs/operators';
import { SharedModule } from "../../../lib/components/shared-module";
import { ExecutorService } from 'src/app/services/executor.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  standalone: true,
  selector: 'app-loading-llm',
  templateUrl: './loading-llm.component.html',
  styleUrls: ['./loading-llm.component.css'],
  imports: [CommonModule, RouterModule, SharedModule, TuiProgressModule]
})
export class LoadingLLMComponent {
  organizationName: string | null = null;
  llmId: string | null = ''
  readonly max = 100;
  readonly value$ = this.isE2E
    ? of(30)
    : timer(300, 200).pipe(
      map(i => i + 30),
      startWith(30),
      takeWhile(value => value <= this.max),
    );



  constructor(@Inject(TUI_IS_E2E) private readonly isE2E: boolean, private route: ActivatedRoute, private router: Router, private executorService: ExecutorService) { }
  loggedIn: boolean = false;
  link: string = ''
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.organizationName = params.get('organizationName');
      this.llmId = 'tinyllama';
    });
      this.executorService.createExecutor({exp_date: new Date().toISOString(), model: this.llmId || 'tinyllama'}).subscribe((res) => {
        this.link = `http://localhost:4200/user/${res.id}/${this.llmId}`
      })
  }
}
