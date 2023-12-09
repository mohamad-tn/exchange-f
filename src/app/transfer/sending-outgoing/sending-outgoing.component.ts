import {
  DataManager,
  Predicate,
  UrlAdaptor,
  Query,
} from "@syncfusion/ej2-data";
import { Component, Inject, Injector, OnInit, Optional, ViewChild } from "@angular/core";
import {
  GridComponent,
  PageSettingsModel,
} from "@syncfusion/ej2-angular-grids";
import { AppComponentBase } from "@shared/app-component-base";
import {
  API_BASE_URL,
  CurrencyServiceProxy,
  OutgoingTransferServiceProxy,
} from "@shared/service-proxies/service-proxies";
import { finalize } from "rxjs/operators";
import { NbDialogService } from "@nebular/theme";
import { CopyDialogComponent } from "./copy-dialog/copy-dialog.component";

@Component({
  selector: "app-sending-outgoing",
  templateUrl: "./sending-outgoing.component.html",
  styleUrls: ["./sending-outgoing.component.scss"],
})
export class SendingOutgoingComponent
  extends AppComponentBase
  implements OnInit
{
  @ViewChild("sendingGrid") gridInstance: GridComponent;

  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [10, 20, 100];
  companyId: number = 0;
  currencies: object[] = [];
  companyTransfersCount: object[] = [];
  filterParams: Predicate;
  public param: Query;
  public fields: Object = { text: "name", value: "id" };
  fromDate: Date = new Date();
  toDate: Date = new Date();

  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    private _modalService: NbDialogService,
    private _outgoingTransferAppService: OutgoingTransferServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.currencies = [{ name: "الكل", id: 10 }];

    this.fromDate = new Date("1-1-2000");
    this.toDate = new Date();

    this.initialCompanies();
    this.initialCurrencies();

    this.pageSettings = {
      pageSize: 100,
      pageCount: 100,
      pageSizes: this.pageSizes,
    };
  }

  initialCompanies() {
    this._outgoingTransferAppService.getNotCopiedCount().subscribe((result) => {
      this.companyTransfersCount = result;
    });
  }

  initialCurrencies() {
    this._currencyAppService.getAll().subscribe((result) => {
      result.forEach((currency) => {
        this.currencies.push({ name: currency.name, id: currency.id });
      });
    });
  }

  companySelected: boolean = false;
  search(event) {
    this.allSelectedData = [];
    this.selectedIds = [];
    this.companyId = event.value;
    this.companySelected = true;
    this.currencyId = 10;

    this.param = new Query()
      .addParams("fromDate", this.fromDate.toISOString())
      .addParams("toDate", this.toDate.toISOString())
      .addParams("companyId", event.value.toString());

    this.dataSource = new DataManager({
      url:
        this.baseUrl + "/api/services/app/OutgoingTransfer/GetForSendingGrid",
      adaptor: new UrlAdaptor(),
    });
  }

  currencyId: number;
  getTransfers(event) {
    this.allSelectedData = [];
    this.selectedIds = [];
    
    this.param = new Query()
      .addParams("fromDate", this.fromDate.toISOString())
      .addParams("toDate", this.toDate.toISOString())
      .addParams("companyId", this.companyId.toString())
      .addParams("currencyId", event.value.toString());

    this.dataSource = new DataManager({
      url:
        this.baseUrl + "/api/services/app/OutgoingTransfer/GetForSendingGrid",
      adaptor: new UrlAdaptor(),
    });
  }

  selectedId: number;
  selectedData: any;
  selectedIds: number[] = [];
  allSelectedData: any[] = [];

  clickRow1(event) {
    this.selectedId = event.rowData.id;
    this.selectedData = event.rowData;
  }

  onActivatedValueChanged(event) {
    if (event) {
      this.selectedIds.push(this.selectedId);
      this.allSelectedData.push(this.selectedData);
    }
    if (!event) {
      this.selectedIds = this.selectedIds.filter((id) => id != this.selectedId);
      this.allSelectedData = this.allSelectedData.filter(
        (item) => item.id != this.selectedId
      );
    }
  }

  copy() {
    if (this.selectedIds.length != 0) {
      // this._outgoingTransferAppService
      //   .setAsCopied(this.selectedIds)
      //   .pipe(
      //     finalize(() => {
      //       this.initialCompanies();
      //       this.gridInstance.refresh();
      //     })
      //   )
      //   .subscribe();

      this._modalService
        .open(CopyDialogComponent, {
          context: {
            data: this.allSelectedData,
          },
        })
        .onClose.subscribe();
    } 
  }
}
