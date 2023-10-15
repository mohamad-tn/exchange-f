import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { ClientCashFlowServiceProxy, CompanyCashFlowServiceProxy, ExchangePriceServiceProxy, IncomeTransferDetailServiceProxy, SummaryCashFlowDto, TreasuryCashFlowServiceProxy } from '@shared/service-proxies/service-proxies';
import { SearchSummaryStatementComponent } from '../search-summary-statement/search-summary-statement.component';

@Component({
  selector: "app-summary-statement",
  templateUrl: "./summary-statement.component.html",
  styleUrls: ["./summary-statement.component.scss"],
})
export class SummaryStatementComponent
  extends AppComponentBase
  implements OnInit
{
  totalResult: number[] = [];
  clientResult: SummaryCashFlowDto[] = [];
  companyResult: SummaryCashFlowDto[] = [];
  treasuryResult: SummaryCashFlowDto[] = [];
  noneReseivedResult: SummaryCashFlowDto[] = [];
  cellWidth: string = "20%";
  cellWidth1: string = "10%";
  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private _clientCashFlowService: ClientCashFlowServiceProxy,
    private _companyCashFlowService: CompanyCashFlowServiceProxy,
    private _exchangePrice: ExchangePriceServiceProxy,
    private _treasuryCashFlowService: TreasuryCashFlowServiceProxy,
    private _incomeTransferDetailService: IncomeTransferDetailServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialClientSummary(undefined);
    this.initialCompanySummary(undefined);
    this.initialTreasurySummary(undefined);
    this.initialnoneReceivedSummary(undefined);
  }

  initialClientSummary(date) {
    this._clientCashFlowService.summary(date).subscribe((result) => {
      this.clientResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
      console.log(this.clientResult);
      this.cellWidth =
        result.length > 0 ? 100 / result.length + "%" : this.cellWidth;
    });
  }

  initialCompanySummary(date) {
    this._companyCashFlowService.summary(undefined).subscribe((result) => {
      this.companyResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
    });
  }

  initialTreasurySummary(date) {
    this._treasuryCashFlowService.summary(undefined).subscribe((result) => {
      this.treasuryResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
    });
  }

  initialnoneReceivedSummary(date) {
    this._incomeTransferDetailService.summary(undefined).subscribe((result) => {
      this.noneReseivedResult = result.sort((a, b) =>
        a.currency?.name.localeCompare(b.currency?.name)
      );
    });
  }

  calculatTotal(currencyId) {
    var clientCashFlow = this.clientResult.find(
      (x) => x.currency?.id == currencyId
    );
    var companyCashFlow = this.companyResult.find(
      (x) => x.currency?.id == currencyId
    );
    var treasuryCashFlow = this.treasuryResult.find(
      (x) => x.currency?.id == currencyId
    );
    var noneReceived = this.noneReseivedResult.find(
      (x) => x.currency?.id == currencyId
    );
    let totalBalance =
      clientCashFlow?.totalBalance +
      companyCashFlow?.totalBalance +
      treasuryCashFlow?.totalBalance +
      noneReceived?.totalBalance;
    return this.getBalanceWithComma(totalBalance);
  }

  calculatTotal1(currencyId) {
    var clientCashFlow = this.clientResult.find(
      (x) => x.currency?.id == currencyId
    );
    var companyCashFlow = this.companyResult.find(
      (x) => x.currency?.id == currencyId
    );
    var treasuryCashFlow = this.treasuryResult.find(
      (x) => x.currency?.id == currencyId
    );
    var noneReceived = this.noneReseivedResult.find(
      (x) => x.currency?.id == currencyId
    );
    let totalBalance =
      clientCashFlow?.totalBalance +
      companyCashFlow?.totalBalance +
      treasuryCashFlow?.totalBalance +
      noneReceived?.totalBalance;
    return totalBalance;
  }

  showSearchDialog() {
    this._modalService
      .open(SearchSummaryStatementComponent)
      .onClose.subscribe((e: any) => {
        if (e != undefined && e?.toDate) {
          this.initialClientSummary(e?.toDate);
          this.initialCompanySummary(e?.toDate);
          this.initialTreasurySummary(e?.toDate);
          this.initialnoneReceivedSummary(e?.toDate);
        }
      });
  }

  getBalanceWithComma(value) {
    if (value != undefined) {
      var realNumber = Math.abs(value);
      if (value < 0) {
        return this.numberWithCommas(realNumber) + "/بذمتنا";
      } else if (value > 0) {
        return this.numberWithCommas(realNumber) + "/بذمته";
      }
    }
    return "0";
  }

  allAmount: number = 0;
  price:number= 0;
  all: number = 0;

  // calculateAll(currencyId) {
  //   this.clientResult.forEach((e: SummaryCashFlowDto) => {
  //     if (e.currency?.id != currencyId) {
  //       let num = this.calculatTotal1(e.currency?.id);
  //       console.log(num);
  //       this._exchangePrice.getById(e.currency?.id).subscribe((result) => {
  //         this.price = result.mainPrice;
  //         console.log(this.price);
  //       });
  //       this.all = this.price * num;
  //       console.log(this.all);
  //     }
  //   });
  //     let b= this.calculatTotal1(currencyId);
  //     console.log(b);
  //     this.allAmount = this.allAmount + (b + this.all);
  //     console.log(this.allAmount);
  //     return this.calculatTotal(this.allAmount);
  // }
}
