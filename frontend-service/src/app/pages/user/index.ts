import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: ':sessionId/:llmId',
    loadComponent: () =>
      import('./chat/chat.component').then((m) => m.ChatComponent),
  },
];