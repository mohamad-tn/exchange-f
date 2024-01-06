import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { TenantsComponent } from './tenants/tenants.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { LinkTenantsCompaniesComponent } from './link-tenants-companies/link-tenants-companies.component';

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      {
        path: "tenant",
        component: TenantsComponent,
        canActivate: [AppRouteGuard],
      },
      {
        path: "link-tenant-company",
        component: LinkTenantsCompaniesComponent,
        canActivate: [AppRouteGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
