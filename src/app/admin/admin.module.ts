import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { TenantsComponent } from './tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDialogModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbSelectModule,
  NbTabsetModule,
  NbToggleModule,
  NbTooltipModule,
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import {
  FilterService,
  ForeignKeyService,
  GridModule,
  GroupService,
  PageService,
  SortService,
  ToolbarService,
} from "@syncfusion/ej2-angular-grids";
import { ToolbarModule } from "@syncfusion/ej2-angular-navigations";


const NB_MODULES = [
  NbActionsModule,
  NbIconModule,
  NbEvaIconsModule,
  NbDialogModule.forChild(),
  NbCardModule,
  NbButtonModule,
  NbInputModule,
  NbCheckboxModule,
  NbTabsetModule,
  NbListModule,
  NbSelectModule,
  NbTooltipModule,
  NbToggleModule,
];
const SYNCFUSION_MODULES = [GridModule, ToolbarModule];

const SYNCFUSION_SERVICES = [
  PageService,
  SortService,
  FilterService,
  GroupService,
  ToolbarService,
  ForeignKeyService,
];


@NgModule({
  declarations: [
    AdminComponent,
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AdminRoutingModule,
    NgxPaginationModule,
    ...SYNCFUSION_MODULES,
    ...NB_MODULES,
  ],
  providers: [...SYNCFUSION_SERVICES],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminModule {}
