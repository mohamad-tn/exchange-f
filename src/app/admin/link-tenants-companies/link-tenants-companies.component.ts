import { LinkTenantCompanyServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, Injector, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { AppComponentBase } from "@shared/app-component-base";
import { PagedRequestDto } from "@shared/paged-listing-component-base";
import {
  CompanyDto,
  CompanyServiceProxy,
  LinkTenantCompanyDto,
  TenantDto,
  TenantServiceProxy,
} from "@shared/service-proxies/service-proxies";

class PagedTenantsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  selector: "app-link-tenants-companies",
  templateUrl: "./link-tenants-companies.component.html",
  styleUrls: ["./link-tenants-companies.component.scss"],
})
export class LinkTenantsCompaniesComponent
  extends AppComponentBase
  implements OnInit
{
  tenants: TenantDto[] = [];
  companies: CompanyDto[] = [];
  id: number;
  tenantId: number;
  companyId: number;
  saving = false;
  keyword = "";
  isActive: boolean | null;
  tenantSelected: boolean = false;
  request: PagedTenantsRequestDto = new PagedTenantsRequestDto();
  public fields: Object = { text: "name", value: "id" };

  constructor(
    injector: Injector,
    private _tenantAppService: TenantServiceProxy,
    private _companyAppService: CompanyServiceProxy,
    private _linkTenantCompanyAppService: LinkTenantCompanyServiceProxy,
    public dialogRef: NbDialogRef<LinkTenantsCompaniesComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialTenants();
  }

  initialLinkedInfo(){
    this._linkTenantCompanyAppService.getByFirstTenantId(this.id)
    .subscribe((result)=>{
      if(result.companyId){
        this.tenantId = result.secondTenantId;
        this.initialCompanies(result.secondTenantId);
        this.companyId = result.companyId;
      }
    })
  }

  initialTenants() {
    this._tenantAppService
      .getAll(
        this.request.keyword,
        true,
        this.request.skipCount,
        this.request.maxResultCount
      )
      .subscribe((result) => {
        this.tenants = result.items.filter((x) => x.id != 1 && x.id != this.id);
        this.initialLinkedInfo();
      });
  }

  onSelectTenant(event) {
    this.initialCompanies(event.value);    
  }

  initialCompanies(tenantId){
    this._companyAppService
      .getAllCompaniesOfTenant(tenantId)
      .subscribe((result) => {
        this.companies = result;
        // this.companies = result.filter((x)=>x.tenantCompanyId == null);
        this.tenantSelected = true;
      });
  }

  save() {
    const linkDto = new LinkTenantCompanyDto();
    linkDto.init({
      firstTenantId: this.id,
      secondTenantId: this.tenantId,
      companyId: this.companyId,
    });
    this._companyAppService.linkCompanyWithTenant(linkDto).subscribe(() => {
      this.notify.info(this.l("LinkedSuccessfully"));
      this.dialogRef.close();
    });
  }
}
