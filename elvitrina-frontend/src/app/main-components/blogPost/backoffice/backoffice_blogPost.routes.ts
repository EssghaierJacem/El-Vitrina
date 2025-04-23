import { Routes } from "@angular/router";

import { BlogPostCreateComponent } from "./blog-post-create/blog-post-create.component";
import { BlogPostEditComponent } from "./blog-post-edit/blog-post-edit.component";
import { BlogPostDetailsComponent } from "./blog-post-details/blog-post-details.component";
import { BlogPostListComponent } from "./blog-post-list/blog-post-list.component";
import { CommentCreateComponent } from "../../comment/backoffice/comment-create/comment-create.component";
import { CommentListComponent } from "../../comment/backoffice/comment-list/comment-list.component";
import { CommentEditComponent } from "../../comment/backoffice/comment-edit/comment-edit.component";
import { HistoryDashboardComponent } from "../../actionHistory/Backoffice/history-dashboard/history-dashboard.component";
import { StatsDashboardComponent } from "../../stats/stats-dashboard/stats-dashboard.component";

export const BlogPostRoutes: Routes = [
  { path: '', component: BlogPostListComponent},
  { path: 'create', component: BlogPostCreateComponent},
  { path: 'history', component: HistoryDashboardComponent }, 
  { path: 'stats', component: StatsDashboardComponent }, 

  { path: ':id', component: BlogPostDetailsComponent},
  { path: ':id/edit', component: BlogPostEditComponent },
  { path: ':id/add-comment', component: CommentCreateComponent }, 
  {path: ':id/comments', component: CommentListComponent} ,
  { path: ':id/comments/:commentId/edit', component: CommentEditComponent },


];

