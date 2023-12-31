import { supportsPassiveEventListeners } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, TreasuryDto, CurrencyDto, CurrencyServiceProxy} from '@shared/service-proxies/service-proxies';
// import { API_BASE_URL, TreasuryDto, CurrencyDto, CurrencyServiceProxy, PdfTreasuryBalanceServiceProxy } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, Query, Predicate  } from '@syncfusion/ej2-data';
import { L10n, setCulture, loadCldr } from '@syncfusion/ej2-base';
import { LocalizationHelper } from '@shared/localization/localization-helper';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { TreasuryBalanceFilterInput } from './treasury-balance-filter-input'
import html2canvas from 'html2canvas';


@Component({
  selector: "app-treasury-balance-statement",
  templateUrl: "./treasury-balance-statement.component.html",
  styleUrls: ["./treasury-balance-statement.component.scss"],
})
export class TreasuryBalanceStatementComponent
  extends AppComponentBase
  implements OnInit
{
  // Grid
  @ViewChild("cashFlowGrid") public grid: GridComponent;
  public dataSource: DataManager;
  private baseUrl: string;
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [100, 200, 1000];
  filterParams: Predicate;
  input: TreasuryBalanceFilterInput = new TreasuryBalanceFilterInput();
  treasurys: TreasuryDto[] = [];
  currencies: CurrencyDto[] = [];
  fromDate: Date = new Date();
  toDate: Date = new Date();
  filtering: boolean = false;
  public fields: Object = { text: "name", value: "id" };
  currencyName: string;
  data: object[] = [];

  constructor(
    injector: Injector,
    private _currencyAppService: CurrencyServiceProxy,
    // private _pdfTreasuryBalanceService: PdfTreasuryBalanceServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.input.fromDate = new Date().toISOString();
    this.input.toDate = new Date().toISOString();
    this.initialCurrencies();

    this.pageSettings = {
      pageSize: 100,
      pageCount: 100,
      pageSizes: this.pageSizes,
    };
    this.dataSource = new DataManager({
      url: this.baseUrl + "/api/services/app/TreasuryCashFlow/GetForGrid",
      adaptor: new UrlAdaptor(),
    });
  }

  onActionComplete(args) {
    this.data = [];
    args.rows.forEach((row) => {
      this.data.push(row.data);
    });
  }

  initialCurrencies() {
    this._currencyAppService.getAll().subscribe((result) => {
      this.currencies = result;
    });
  }

  filter(): void {
    this.currencyName = this.currencies.find(
      (x) => x.id == this.input.currencyId
    )?.name;
    this.fromDate = new Date(this.input.fromDate);
    this.toDate = new Date(this.input.toDate);

    this.filterParams = undefined;
    if (this.input.currencyId != undefined) {
      this.addToFilterParams("currencyId", "equal", this.input.currencyId);
    }
    if (this.input.fromDate != undefined) {
      this.addToFilterParams("fromDate", "equal", this.input.fromDate);
    }
    if (this.input.toDate != undefined) {
      this.addToFilterParams("toDate", "equal", this.input.toDate);
    }
    if (this.filtering) {
      this.grid.query = new Query().where(this.filterParams);
      //this.dataSource.executeQuery(new Query().where(this.filterParams));
      this.grid.refresh();
    }
  }

  addToFilterParams(key: string, op: string, value: any) {
    this.filtering = true;
    if (this.filterParams == undefined) {
      this.filterParams = new Predicate(key, op, value, true);
    } else {
      this.filterParams = this.filterParams.and(key, op, value, true);
    }
  }

  getRealDate(date): Date {
    return new Date(date);
  }

  name = "Treasury-Balance-Statement";

  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;

  downloadImage() {
    document.getElementById("print-section").style.display = "contents";
    document.getElementById("t3").style.width = "595px";
    document.getElementById("t3").style.height = "842px";
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download =
        "Treasury-Balance-Statement-To_Date : " +
        this.toDate.toLocaleDateString() +
        ".png";
      this.downloadLink.nativeElement.click();
    });
    document.getElementById("print-section").style.display = "none";
    document.getElementById("t3").style.width = "0px";
    document.getElementById("t3").style.height = "0px";
  }

  downloadPdf(){
    // this.fromDate = new Date(this.input.fromDate);
    // this.toDate = new Date(this.input.toDate);
    // this._pdfTreasuryBalanceService.getTreasuryCashFlow(this.input.currencyId,this.fromDate.toISOString(),this.toDate.toISOString())
    // .subscribe(result=>{

    // });
  }
}
