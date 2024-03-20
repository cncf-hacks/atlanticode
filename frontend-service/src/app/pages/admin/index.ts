import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: ':organizationName',
    loadComponent: () =>
      import('./homepage/homepage.component').then((m) => m.HomepageComponent),
  },
  {
    path: 'config/:organizationName/:llmId',
    loadComponent: () =>
      import('./config-form/config-form.component').then((m) => m.ConfigFormComponent),
  },
  {
    path: 'provider/:organizationName/:llmId',
    loadComponent: () =>
      import('./loading-llm/loading-llm.component').then((m) => m.LoadingLLMComponent),
  },
];
