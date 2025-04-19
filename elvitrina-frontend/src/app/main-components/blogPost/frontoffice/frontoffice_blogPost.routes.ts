import { Routes } from "@angular/router";


import { BlogPostListComponent } from "./blog-post-list/blog-post-list.component";
import { BlogPostCreateComponent } from "./blog-post-create/blog-post-create.component";
import { BlogPostEditComponent } from "./blog-post-edit/blog-post-edit.component";

export const BlogPostRoutes: Routes = [
  { path: '', component: BlogPostListComponent},
  { path: 'create', component: BlogPostCreateComponent },
  { path: 'edit/:id', component: BlogPostEditComponent },



];