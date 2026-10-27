import { Routes } from "@angular/router";
import { CategoryTheoremsComponent } from "./category-theorems/category-theorems";
import { TheoremFormComponent } from "./theorem-form/theorem-form";
import { adminGuard } from "../common/admin.guard";
import { AdminGuard } from "../common/admin.guard.class";

export const mathRoutes: Routes = [
    {
        path: '',
        redirectTo: 'category/1',
        pathMatch: 'full'
    },
    {
        path: 'theorem/new',
        component: TheoremFormComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'theorem/:id',
        component: TheoremFormComponent,
        canActivate: [adminGuard]
    },
    {
        path: 'category/:id',
        component: CategoryTheoremsComponent
    }
]
