import { Component, Injector, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { AppComponentBase } from "@shared/app-component-base";
import { ExchangePriceDto, ExchangePriceServiceProxy, OutgoingTransferDto } from "@shared/service-proxies/service-proxies";

@Component({
  selector: "app-copy-dialog",
  templateUrl: "./copy-dialog.component.html",
  styleUrls: ["./copy-dialog.component.scss"],
})
export class CopyDialogComponent extends AppComponentBase implements OnInit {
  data: any[] = [];
  dataCopy: string = "";
  total: number = 0;
  exchangePrices: ExchangePriceDto[] = [];

  constructor(
    injector: Injector,
    private _exchangePrice: ExchangePriceServiceProxy,
    public dialogRef: NbDialogRef<CopyDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.initialExchangePrices();
  }

  initialExchangePrices() {
    this._exchangePrice.getAll().subscribe((result) => {
      this.exchangePrices = result;
      this.initialCopyList();
    });
  }

  initialCopyList() {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].currency?.isMainCurrency) {
        this.total += this.data[i].amount;
      } else {
        const exchangePrice = this.exchangePrices.find(
          (x) => x.currencyId == this.data[i].currency?.id
        );
        this.total += this.data[i].amount / exchangePrice.mainPrice;
      }

      this.dataCopy =
        this.dataCopy +
        "\n" +
        "/// الحوالة" +
        (i + 1) +
        "\n" +
        "العملة : " +
        this.data[i].currency?.name +
        "\n" +
        "المبلغ : " +
        this.data[i].amount +
        "\n" +
        "العمولة : " +
        this.data[i].commission +
        "\n" +
        "المستفيد : " +
        this.data[i].beneficiary.name +
        "\n" +
        "المرسل : " +
        this.data[i].sender.name +
        "\n";

      if (i == this.data.length - 1) {
        this.dataCopy =
          this.dataCopy +
          "\n" +
          "--------------------" +
          "\n" +
          "المبلغ الكلي : " +
          this.roundTotalNumber(this.total) +
          "  " +
          this.exchangePrices.find((x) => x.currency.isMainCurrency).currency
            ?.name;
      }
    }
  }

  roundTotalNumber(number) {
    const num = Math.round(number);
    return this.numberWithCommas(num);
  }
}
