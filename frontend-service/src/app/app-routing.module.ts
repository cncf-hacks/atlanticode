import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: async () => (await import('./pages/auth')).routes,
    // Assuming the module's name is AuthModule inside the auth directory
  },
  {
    path: '',
    loadChildren: async () => (await import('./pages/admin')).routes,
    // Assuming the module's name is HomeModule inside the home directory
  },
  {
    path: 'user',
    loadChildren: async () => (await import('./pages/user')).routes,
    // Assuming the module's name is HomeModule inside the home directory
  },
  {
    path: '**',
    loadComponent: async () => (await import('./pages/screens/not-found/not-found.component')).NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
