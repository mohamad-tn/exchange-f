import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppRouteGuard } from "@shared/auth/auth-route-guard";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";

import { NotFoundComponent } from "./miscellaneous/not-found/not-found.component";
import { TenantsComponent } from "./admin/tenants/tenants.component";

const routes: Routes = [
  {
    path: "",
    component: AppComponent,
    children: [
      {
        path: "home",
        component: HomeComponent,
        pathMatch: "full",
        canActivate: [AppRouteGuard],
      },
      // {
      //   path: "tenant",
      //   component: TenantsComponent,
      //   pathMatch: "full",
      //   canActivate: [AppRouteGuard],
      // },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "setting",
        loadChildren: () =>
          import("./setting/setting.module").then((m) => m.SettingModule),
      },
      {
        path: "transfer",
        loadChildren: () =>
          import("./transfer/transfer.module").then((m) => m.TransferModule),
      },
      {
        path: "exchange-currency",
        loadChildren: () =>
          import("./exchange-currency/exchange-currency.module").then(
            (m) => m.ExchangeCurrencyModule
          ),
      },
      {
        path: "treasury",
        loadChildren: () =>
          import("./treasury/treasury.module").then((m) => m.TreasuryModule),
      },
      {
        path: "statement",
        loadChildren: () =>
          import("./statement/statement.module").then((m) => m.StatementModule),
      },
      {
        path: "security",
        loadChildren: () =>
          import("./security/security.module").then((m) => m.SecurityModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashbard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
