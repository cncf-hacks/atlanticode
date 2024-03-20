import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSignUpComponent } from './loading-sign-up.component';

describe('LoadingSignUpComponent', () => {
  let component: LoadingSignUpComponent;
  let fixture: ComponentFixture<LoadingSignUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingSignUpComponent]
    });
    fixture = TestBed.createComponent(LoadingSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
