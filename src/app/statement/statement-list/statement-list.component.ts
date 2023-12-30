import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: "app-statement-list",
  templateUrl: "./statement-list.component.html",
  styleUrls: ["./statement-list.component.scss"],
})
export class StatementListComponent extends AppComponentBase implements OnInit {
  constructor(
    injector: Injector,
    private router: Router,
    public dialogRef: NbDialogRef<StatementListComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {}

  goTo(destination: string) {
    switch (destination) {
      case "ClientBalanceStatement":
        this.router.navigateByUrl(
          "/app/statement/total-client-balance-statement"
        );
        this.dialogRef.close();
        break;
      case "CompanyBalanceStatement":
        this.router.navigateByUrl(
          "/app/statement/total-company-balance-statement"
        );
        this.dialogRef.close();
        break;
      case "TreasuryBalanceStatement":
        this.router.navigateByUrl("/app/statement/treasury-balance-statement");
        this.dialogRef.close();
        break;
      case "TotalBalanceStatement":
        this.router.navigateByUrl("/app/statement/total-balance-statement");
        this.dialogRef.close();
        break;
      case "OutgoingTransferStatement":
        this.router.navigateByUrl("/app/statement/outgoing-transfer-statement");
        this.dialogRef.close();
        break;
      case "SpendsStatment":
        this.router.navigateByUrl("/app/statement/spends-statement");
        this.dialogRef.close();
        break;
      case "ReceiptsStatment":
        this.router.navigateByUrl("/app/statement/receipts-statement");
        this.dialogRef.close();
        break;
      case "DefaultersOfPayment":
        this.router.navigateByUrl(
          "/app/statement/defaulters-of-payment-statement"
        );
        this.dialogRef.close();
        break;
      case "InactiveClientStatment":
        this.router.navigateByUrl("/app/statement/inactive-client-statement");
        this.dialogRef.close();
        break;
      case "ExchangeCurrencyStatement":
        this.router.navigateByUrl("/app/statement/exchange-currency-statement");
        this.dialogRef.close();
        break;
      case "Customers":
        this.router.navigateByUrl("/app/statement/customer-statement");
        this.dialogRef.close();
        break;
      case "Management":
        this.router.navigateByUrl("/app/statement/management-statement");
        this.dialogRef.close();
        break;
      case "Summary":
        this.router.navigateByUrl("/app/statement/summary-statement");
        this.dialogRef.close();
        break;
      default:
        break;
    }
  }
}
