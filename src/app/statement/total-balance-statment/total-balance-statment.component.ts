import { ConditionalExpr } from '@angular/compiler';
import { Component, ElementRef, Inject, Injector, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { API_BASE_URL, ClientCashFlowServiceProxy, ClientCashFlowTotalDto, CompanyCashFlowServiceProxy, CompanyCashFlowTotalDto} from '@shared/service-proxies/service-proxies';
// import { API_BASE_URL, ClientCashFlowServiceProxy, ClientCashFlowTotalDto, CompanyCashFlowServiceProxy, CompanyCashFlowTotalDto, PdfClientAndCompanyServiceProxy, TotalBalancePdf } from '@shared/service-proxies/service-proxies';
import { GridComponent, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SearchClientBalanceStatmentDialogComponent } from '../client-balance-statement/search-client-balance-statment-dialog.component';
import { SearchCompanyBalanceStatmentDialogComponent } from '../company-balance-statement/search-company-balance-statment-dialog.component';
import { SearchTotalBalanceStatmentDialogComponent } from './search-total-balance-statment-dialog.component';
import { TotalBalanceStatment } from './total-balance-statment';
import html2canvas from 'html2canvas';

@Component({
  selector: "app-total-balance-statment",
  templateUrl: "./total-balance-statment.component.html",
  styleUrls: ["./total-balance-statment.component.scss"],
})
export class TotalBalanceStatmentComponent
  extends AppComponentBase
  implements OnInit
{
  // Grid
  @ViewChild("cashFlowGrid") public grid: GridComponent;
  baseUrl: string = '';
  // pdfItems: TotalBalancePdf[] = [];
  dataSource: TotalBalanceStatment[] = [];
  clientCashFlows: ClientCashFlowTotalDto[] = [];
  companyCashFlows: CompanyCashFlowTotalDto[] = [];
  public pageSettings: PageSettingsModel;
  public pageSizes: number[] = [10, 20, 100];
  showColumnBalance0: boolean = false;
  showColumnBalance1: boolean = false;
  showColumnBalance2: boolean = false;
  showColumnBalance3: boolean = false;
  showColumnBalance4: boolean = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private _route: ActivatedRoute,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,
    private _companyCashFlowService: CompanyCashFlowServiceProxy,
    // private _pdfBalanceService: PdfClientAndCompanyServiceProxy,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(injector);
    this.baseUrl = baseUrl;
  }

  ngOnInit(): void {
    this.pageSettings = {
      pageSize: 10,
      pageCount: 10,
      pageSizes: this.pageSizes,
    };
    setTimeout(() => this.showSearchDialog(), 500);
    //this.initialCashFlow('');
  }

  initialCashFlow(toDate) {
    this.totalBalanceForHim0 = 0;
    this.totalBalanceOnHim0 = 0;
    this.totalBalanceForHim1 = 0;
    this.totalBalanceOnHim1 = 0;
    this.totalBalanceForHim2 = 0;
    this.totalBalanceOnHim2 = 0;
    this.totalBalanceForHim3 = 0;
    this.totalBalanceOnHim3 = 0;
    this.totalBalanceForHim4 = 0;
    this.totalBalanceOnHim4 = 0;

    this.dataSource = [];

    this._clientCashFlowService
      .getClientsBalances(toDate)
      .subscribe((result) => {
        this.clientCashFlows = result;
        this.initialClientDataSource(result);

        this._companyCashFlowService
          .getCompanysBalances(toDate)
          .subscribe((result) => {
            this.companyCashFlows = result;
            this.initialCompanyDataSource(result);
            this.calculateTotal();
          });
      });
  }

  toDate: Date = new Date();
  showSearchDialog() {
    this._modalService
      .open(SearchTotalBalanceStatmentDialogComponent)
      .onClose.subscribe((e: any) => {
        if (e != undefined && e?.toDate) {
          this.toDate = new Date(e?.toDate);
          this.initialCashFlow(e.toDate);
        }
      });
  }

  initialClientDataSource(items: ClientCashFlowTotalDto[]) {
    //this.dataSource = [];
    items.forEach((item) => {
      let data = new TotalBalanceStatment();
      data.id = item.clientId;
      data.type = "client";
      data.isActiveToday = item.isActiveToday;
      data.isMatching = item.isMatching;
      data.name = item.clientName;
      //pdf
      // let pdfItem = new TotalBalancePdf();
      // pdfItem.id = data.id;
      // pdfItem.name = data.name;

      var currencyCount = item.currencyBalances.length;
      if (currencyCount > 0) {
        data.balance0 = item.currencyBalances[0].currentBalance;
        // pdfItem.balance0 = item.currencyBalances[0].currentBalance;
        // pdfItem.currency0 = item.currencyBalances[0].currencyName;
        this.showColumnBalance0 = true;
      }

      if (currencyCount > 1) {
        data.balance1 = item.currencyBalances[1].currentBalance;
        // pdfItem.balance1 = item.currencyBalances[1].currentBalance;
        // pdfItem.currency1 = item.currencyBalances[1].currencyName;
        this.showColumnBalance1 = true;
      }

      if (currencyCount > 2) {
        data.balance2 = item.currencyBalances[2].currentBalance;
        // pdfItem.balance2 = item.currencyBalances[2].currentBalance;
        // pdfItem.currency2 = item.currencyBalances[2].currencyName;
        this.showColumnBalance2 = true;
      }

      if (currencyCount > 3) {
        data.balance3 = item.currencyBalances[3].currentBalance;
        // pdfItem.balance3 = item.currencyBalances[3].currentBalance;
        // pdfItem.currency3 = item.currencyBalances[3].currencyName;
        this.showColumnBalance3 = true;
      }

      if (currencyCount > 4) {
        data.balance4 = item.currencyBalances[4].currentBalance;
        // pdfItem.balance4 = item.currencyBalances[4].currentBalance;
        // pdfItem.currency4 = item.currencyBalances[4].currencyName;
        this.showColumnBalance4 = true;
      }

      this.dataSource.push(data);
      // this.pdfItems.push(pdfItem);
    });

    //this.calculateTotal();
  }

  initialCompanyDataSource(items: CompanyCashFlowTotalDto[]) {
    //this.dataSource = [];
    items.forEach((item) => {
      let data = new TotalBalanceStatment();
      data.id = item.companyId;
      data.type = "company";
      data.isActiveToday = item.isActiveToday;
      data.isMatching = item.isMatching;
      data.name = item.companyName;
      //pdf
      // let pdfItem = new TotalBalancePdf();
      // pdfItem.id = data.id;
      // pdfItem.name = data.name;

      var currencyCount = item.currencyBalances.length;
      if (currencyCount > 0) {
        data.balance0 = item.currencyBalances[0].currentBalance;
        // pdfItem.balance0 = item.currencyBalances[0].currentBalance;
        // pdfItem.currency0 = item.currencyBalances[0].currencyName;
        this.showColumnBalance0 = true;
      }

      if (currencyCount > 1) {
        data.balance1 = item.currencyBalances[1].currentBalance;
        // pdfItem.balance1 = item.currencyBalances[1].currentBalance;
        // pdfItem.currency1 = item.currencyBalances[1].currencyName;
        this.showColumnBalance1 = true;
      }

      if (currencyCount > 2) {
        data.balance2 = item.currencyBalances[2].currentBalance;
        // pdfItem.balance2 = item.currencyBalances[2].currentBalance;
        // pdfItem.currency2 = item.currencyBalances[2].currencyName;
        this.showColumnBalance2 = true;
      }

      if (currencyCount > 3) {
        data.balance3 = item.currencyBalances[3].currentBalance;
        // pdfItem.balance3 = item.currencyBalances[3].currentBalance;
        // pdfItem.currency3 = item.currencyBalances[3].currencyName;
        this.showColumnBalance3 = true;
      }

      if (currencyCount > 4) {
        data.balance4 = item.currencyBalances[4].currentBalance;
        // pdfItem.balance4 = item.currencyBalances[4].currentBalance;
        // pdfItem.currency4 = item.currencyBalances[4].currencyName;
        this.showColumnBalance4 = true;
      }

      this.dataSource.push(data);
      // this.pdfItems.push(pdfItem);
    });

    //this.calculateTotal();
  }

  getColumnName(index) {
    if (
      this.clientCashFlows != undefined &&
      this.clientCashFlows[0].currencyBalances?.length > 0
    ) {
      return this.clientCashFlows[0].currencyBalances[index]?.currencyName;
    }
    return "";
  }

  showSearchDetailDialog(data) {
    if (data.type === "client") {
      this._modalService
        .open(SearchClientBalanceStatmentDialogComponent, {
          context: {
            selectedClientId: data.id,
          },
        })
        .onClose.subscribe((e: any) => {
          if (e != undefined && e?.input) {
            this.navigateToClientBalanceDetailPage(e?.input);
          }
        });
    } else {
      this._modalService
        .open(SearchCompanyBalanceStatmentDialogComponent, {
          context: {
            selectedCompanyId: data.id,
          },
        })
        .onClose.subscribe((e: any) => {
          if (e != undefined && e?.input) {
            this.navigateToCompanyBalanceDetailPage(e?.input);
          }
        });
    }
  }

  navigateToClientBalanceDetailPage(data) {
    this._router.navigate([
      "/app/statement/client-balance-statement",
      {
        clientId: data.clientId,
        currencyId: data.currencyId,
        fromDate: data.fromDate,
        toDate: data.toDate,
      },
    ]);
  }

  navigateToCompanyBalanceDetailPage(data) {
    this._router.navigate([
      "/app/statement/company-balance-statement",
      {
        companyId: data.companyId,
        currencyId: data.currencyId,
        fromDate: data.fromDate,
        toDate: data.toDate,
      },
    ]);
  }

  //-----------
  totalBalanceForHim0 = 0;
  totalBalanceOnHim0 = 0;
  totalBalanceForHim1 = 0;
  totalBalanceOnHim1 = 0;
  totalBalanceForHim2 = 0;
  totalBalanceOnHim2 = 0;
  totalBalanceForHim3 = 0;
  totalBalanceOnHim3 = 0;
  totalBalanceForHim4 = 0;
  totalBalanceOnHim4 = 0;

  calculateTotal() {
    this.dataSource.forEach((item) => {
      if (item.balance0 < 0) {
        this.totalBalanceForHim0 += item.balance0;
      } else {
        this.totalBalanceOnHim0 += item.balance0;
      }

      if (item.balance1 < 0) {
        this.totalBalanceForHim1 += item.balance1;
      } else {
        this.totalBalanceOnHim1 += item.balance1;
      }

      if (item.balance2 < 0) {
        this.totalBalanceForHim2 += item.balance2;
      } else {
        this.totalBalanceOnHim2 += item.balance2;
      }

      if (item.balance3 < 0) {
        this.totalBalanceForHim3 += item.balance3;
      } else {
        this.totalBalanceOnHim3 += item.balance3;
      }

      if (item.balance4 < 0) {
        this.totalBalanceForHim4 += item.balance4;
      } else {
        this.totalBalanceOnHim4 += item.balance4;
      }
    });
  }

  name = "Client-&-Company-Balance-Statement";

  @ViewChild("screen") screen: ElementRef;
  @ViewChild("canvas") canvas: ElementRef;
  @ViewChild("downloadLink") downloadLink: ElementRef;

  downloadImage() {
    document.getElementById("print-section").style.display = "contents";
    document.getElementById("t4").style.width = "595px";
    document.getElementById("t4").style.height = "842px";
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL("image/png");
      this.downloadLink.nativeElement.download =
        "Client-&-Company-Balance-Statement-To_Date : " +
        this.toDate.toLocaleDateString() +
        ".png";
      this.downloadLink.nativeElement.click();
    });
    document.getElementById("print-section").style.display = "none";
    document.getElementById("t4").style.width = "0px";
    document.getElementById("t4").style.height = "0px";
  }

  downloadPdf(){
    // this._pdfBalanceService.getTotalBalance(this.toDate.toISOString(), this.pdfItems)
    // .subscribe(result=>{
    //   const url = `${this.baseUrl}/${result.path}`;
    //   window.open(url, "_blank");
    // })
  }
}
