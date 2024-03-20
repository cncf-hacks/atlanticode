import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/lib/components/shared-module';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  standalone: true,
  selector: 'app-config-form',
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, TuiInputModule, TuiButtonModule],
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.css']
})
export class ConfigFormComponent {

  searchInputValue: string = '';
  targetValue: string = '';
  selectedType: string = '';
  organizationName: string | null = '';
  llmId: string | null = ''
specifySpeciality(queryEvent: Event): void {
  const query = (queryEvent.target as HTMLInputElement).value;
  this.searchInputValue = query
  console.log(query)
}
specifyTarget(queryEvent: Event): void {
  const query = (queryEvent.target as HTMLInputElement).value;
  this.targetValue = query
}

  constructor(private router: Router, private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    this.route.paramMap.subscribe(params => {
      this.organizationName = params.get('organizationName');
      this.llmId = params.get('llmId');
    });
  }

  navigateToLinkGenerator() {
    this.router.navigate(['provider/' + this.organizationName + '/' + this.llmId]);
  }

  readonly testForm = new FormGroup({
    testValue: new FormControl(),
  });

  onTypeChange(selectedValue: string) {
    this.selectedType = selectedValue;
  }
  
}
