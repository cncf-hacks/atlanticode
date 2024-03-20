import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'register',
        loadComponent: async () => (await import('./register/register.component')).RegisterComponent,
    },
    {
        path: 'loading/:organizationName',
        loadComponent: () =>
          import('./loading-sign-up/loading-sign-up.component').then((m) => m.LoadingSignUpComponent),
      },
];