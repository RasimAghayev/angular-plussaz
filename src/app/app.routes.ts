import { Routes } from '@angular/router';

import { SignInComponent } from './auth/sign-in/sign-in.component';
import { authGuard } from './core/auth.guard';
import { AddPostComponent } from './posts/add/add.component';
import { EditPostComponent } from './posts/edit/edit.component';
import { ListPostsComponent } from './posts/list/list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts-list' },
  { path: 'posts-list', component: ListPostsComponent },
  { path: 'posts-add', component: AddPostComponent, canActivate: [authGuard] },
  { path: 'posts-edit/:id', component: EditPostComponent, canActivate: [authGuard] },
  // The path keeps the name of the old page, so the bookmarks of the
  // demonstration keep working.
  { path: 'login', component: SignInComponent },
  { path: '**', redirectTo: 'posts-list' },
];
