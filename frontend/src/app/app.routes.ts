import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoopComponent } from './loop/loop.component';
import { MathHome } from './math/home/math-home';
import { mathRoutes } from './math/math.routes';
import { Playground } from './playground/playground';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'for-loop',
        component: LoopComponent
    },
    {
        path: 'playground',
        component: Playground
    },
    {
        path: 'math',
        component: MathHome,
        children: mathRoutes
    },
    {
        path: '**',
        component: HomeComponent
    }
];
