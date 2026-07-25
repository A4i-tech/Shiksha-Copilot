import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddEditUserComponent } from "./add-edit-user/add-edit-user.component";
import { UserStaffListComponent } from "src/app/shared/components/user-staff-list/user-staff-list.component";
import { PermissionGuard } from "src/app/core/guards/permission.guard";

const routes:Routes =[
    {
        path:'',
        redirectTo:'list',
        pathMatch:'full'
    },
    {
        path:'list',
        component:UserStaffListComponent,
        data:{
            idleTracking:'custom',
        }
    },
    {
        path:'add',
        component:AddEditUserComponent,
        data:{ permissions: ['teacher.create'], idleTracking:'custom' },
        canActivate: [PermissionGuard],
    },
    {
        path:':id',
        component:AddEditUserComponent,
        data:{ permissions: ['teacher.edit'], idleTracking:'custom' },
        canActivate: [PermissionGuard],
    }
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class UserManagementRoutingModule{}
