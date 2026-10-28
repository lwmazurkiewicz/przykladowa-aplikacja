import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoopComponent } from './loop/loop.component';
import { MathHome } from './math/home/math-home';
import { mathRoutes } from './math/math.routes';
import { Playground } from './playground/playground';
import { PipeComponent } from './pipe-component/pipe-component';
import { ScssDemoComponent } from './scss-demo/scss-demo.component';
import { ReactiveFormDemoComponent } from './reactive-form-demo/reactive-form-demo';

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
        path: 'pipe',
        component: PipeComponent
    },
    {
        path: 'scss',
        component: ScssDemoComponent
    },
    {
        path: 'reactive-form',
        component: ReactiveFormDemoComponent
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
