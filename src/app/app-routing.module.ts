import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { PostPosts } from './posts/post.component';
import { ListPosts } from './posts/list/list.component';
import { EditPosts } from './posts/edit/edit.component';
import { AddPosts } from './posts/add/add.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'posts-list' },
  { path: 'posts-add', component: AddPosts },
  { path: 'posts-list', component: ListPosts },
  { path: 'posts-edit/:id', component: EditPosts },
  { path: 'login', component: LoginComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
