import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'documentos'
  },
  {
    path: 'documentos',
    loadChildren: () =>
      import('./features/documentos/documentos.routes')
        .then(m => m.DOCUMENTOS_ROUTES)
  }
];
