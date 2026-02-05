import { Routes } from '@angular/router';

import { DocumentListComponent } from './pages/document-list/document-list.component';
import { DocumentFormComponent } from './pages/document-form/document-form.component';

export const DOCUMENTOS_ROUTES: Routes = [
  { path: '', component: DocumentListComponent },
  { path: 'nuevo', component: DocumentFormComponent },
  { path: ':id', component: DocumentFormComponent }
];