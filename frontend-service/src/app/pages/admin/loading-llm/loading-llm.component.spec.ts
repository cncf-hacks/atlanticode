import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingLLMComponent } from './loading-llm.component';

describe('LoadingLLMComponent', () => {
  let component: LoadingLLMComponent;
  let fixture: ComponentFixture<LoadingLLMComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingLLMComponent]
    });
    fixture = TestBed.createComponent(LoadingLLMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
