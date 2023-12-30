import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@shared/shared.module';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { ThemeModule } from '@theme/theme.module';
// tslint:disable-next-line:max-line-length
import { NbActionsModule, NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbDialogModule, NbIconModule, NbInputModule, NbSelectModule, NbTabsetModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MainButtonComponent } from './main-button/main-button.component';
import { RouterModule } from '@angular/router';

const NB_MODULES = [
  NbActionsModule,
  NbIconModule,
  NbEvaIconsModule,
  NbDialogModule.forChild(),
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbSelectModule,
  NbAlertModule,
  NbCheckboxModule,
  NbTabsetModule,
  // NgxEchartsModule
];

@NgModule({
  declarations: [DashboardComponent, MainButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DashboardRoutingModule,
    SharedModule,
    ServiceProxyModule,
    ThemeModule,
    RouterModule,
    ...NB_MODULES
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
