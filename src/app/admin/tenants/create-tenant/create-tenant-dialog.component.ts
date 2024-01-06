import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AppComponentBase } from "@shared/app-component-base";
import {
  CreateTenantDto,
  TenantServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { NbDialogRef } from "@nebular/theme";

@Component({
  templateUrl: "create-tenant-dialog.component.html",
  styleUrls: ["./create-tenant-dialog.component.scss"],
  providers: [TenantServiceProxy],
})
export class CreateTenantDialogComponent
  extends AppComponentBase
  implements OnInit
{
  saving = false;
  tenant: CreateTenantDto = new CreateTenantDto();
  connectionString: string;
  database: string;
  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _tenantService: TenantServiceProxy,
    public dialogRef: NbDialogRef<CreateTenantDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.tenant.isActive = true;
    
  }

  save(): void {
    this.tenant.connectionString = this.database;
    this.tenant.name = this.tenant.tenancyName;
    this.tenant.adminEmailAddress = this.tenant.tenancyName + "@admin.com"
    this.saving = true;

    this._tenantService.create(this.tenant).subscribe(
      () => {
        this.notify.info(this.l("SavedSuccessfully"));
        this.dialogRef.close();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
  onActiveChecked(checked: boolean) {
    this.tenant.isActive = checked;
  }
}
