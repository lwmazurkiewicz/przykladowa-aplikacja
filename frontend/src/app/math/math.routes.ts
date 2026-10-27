import { Routes } from "@angular/router";
import { CategoryTheoremsComponent } from "./category-theorems/category-theorems";
import { TheoremFormComponent } from "./theorem-form/theorem-form";

export const mathRoutes: Routes = [
    {
        path: '',
        redirectTo: 'category/1',
        pathMatch: 'full'
    },
    {
        path: 'theorem/new',
        component: TheoremFormComponent
    },
    {
        path: 'theorem/:id',
        component: TheoremFormComponent
    },
    {
        path: 'category/:id',
        component: CategoryTheoremsComponent
    }
]
