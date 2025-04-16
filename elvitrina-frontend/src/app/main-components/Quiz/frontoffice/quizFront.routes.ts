import { Component } from "@angular/core";
import { Routes } from "@angular/router";
import { QuizStratComponent } from "./quiz-strat/quiz-strat.component";
import { QuizListComponent } from "./quiz-list/quiz-list.component";

export const QuizFrontRoutes: Routes = [
{path :'quizlist', component :QuizListComponent},
{path : 'passquiz', component :QuizStratComponent}
]
