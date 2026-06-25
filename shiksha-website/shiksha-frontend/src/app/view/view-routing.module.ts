import { inject, NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { ViewComponent } from "./view.component";

const DefaultLandingGuard = () => {
    const router = inject(Router);
    const roles = JSON.parse(localStorage.getItem('userData') || '{}')?.role || [];
    if (roles.includes('standard') || roles.includes('power')) {
        return router.parseUrl('/home');
    }
    return router.parseUrl('/dashboard');
};

const routes:Routes=[

    {
        path:'',
        component:ViewComponent,
        children:[
            {
                path:'',
                pathMatch:'full',
                canActivate:[DefaultLandingGuard],
                component:ViewComponent
            },
            // Flat URLs are intentional; keep user/admin top-level child paths unique.
            {
                path:'',
                loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
            },
            {
                path:'',
                loadChildren:()=> import('./admin/admin.module').then((m)=>m.AdminModule)
            }

        ]
    }
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class ViewRoutingModule{}
