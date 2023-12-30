import { Component, Injector, ViewChild } from "@angular/core";
import { finalize } from "rxjs/operators";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from "@shared/paged-listing-component-base";
import {
  TenantServiceProxy,
  TenantDto,
  TenantDtoPagedResultDto,
} from "@shared/service-proxies/service-proxies";
import { CreateTenantDialogComponent } from "./create-tenant/create-tenant-dialog.component";
import { EditTenantDialogComponent } from "./edit-tenant/edit-tenant-dialog.component";
import { NbDialogService } from "@nebular/theme";
import { FilterSettingsModel, GridComponent, GroupSettingsModel, PageSettingsModel } from "@syncfusion/ej2-angular-grids";

class PagedTenantsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: "app-tenant",
  templateUrl: "./tenants.component.html",
  styleUrls: ["./tenants.component.scss"],
  animations: [appModuleAnimation()],
})
export class TenantsComponent extends PagedListingComponentBase<TenantDto> {
  tenants: TenantDto[] = [];
  keyword = "";
  isActive: boolean | null;
  advancedFiltersVisible = false;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [6, 20, 100];
  public groupOptions: GroupSettingsModel;
  public filterOption: FilterSettingsModel = { type: "Menu" };
  @ViewChild("tenantGrid") public grid: GridComponent;

  constructor(
    injector: Injector,
    private _tenantService: TenantServiceProxy,
    private _modalService: NbDialogService
  ) {
    super(injector);
  }

  list(
    request: PagedTenantsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;
    request.isActive = this.isActive;

    this._tenantService
      .getAll(
        request.keyword,
        request.isActive,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: TenantDtoPagedResultDto) => {
        this.tenants = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(tenant: TenantDto): void {
    abp.message.confirm(
      this.l("TenantDeleteWarningMessage", tenant.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._tenantService
            .delete(tenant.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l("SuccessfullyDeleted"));
                this.refresh();
              })
            )
            .subscribe(() => {});
        }
      }
    );
  }

  showCreateDialog() {
    this._modalService
      .open(CreateTenantDialogComponent)
      .onClose.subscribe((e: any) => {
        this.refresh();
      });
  }
  showEditDialog(id) {
    this._modalService
      .open(EditTenantDialogComponent, {
        context: {
          id: id,
        },
      })
      .onClose.subscribe((e: any) => {
        this.refresh();
      });
  }

  // clearFilters(): void {
  //   this.keyword = "";
  //   this.isActive = undefined;
  //   this.getDataPage(1);
  // }

  clearFilters() {
    this.grid.clearFiltering();
  }
  clearSorts() {
    this.grid.clearSorting();
  }
}
