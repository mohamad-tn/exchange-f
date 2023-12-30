import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: "ngx-status-card",
  styleUrls: ["./status-card.component.scss"],
  template: `
    <nb-card (click)="goTo(destination)">
      <div class="icon-container">
        <div class="icon status-primary">
          <ng-content></ng-content>
        </div>
      </div>

      <div class="details">
        <div class="title h5">{{ title }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {
  @Input() title: string;
  @Input() destination: string;

  constructor(private router: Router) {}

  goTo(destination) {
    if (destination != undefined) {
      switch (destination) {        
        case "OutgoingTransfers":
          this.router.navigateByUrl("/app/transfer/create-outgoing-transfer");
          break;
        case "IncomeTransfers":
          this.router.navigateByUrl("/app/transfer/create-income-transfer");
          break;
        case "NoneReceivedTransfer":
          this.router.navigateByUrl("/app/transfer/direct-transfer");
          break;
        case "SendTransfers":
          this.router.navigateByUrl("/app/transfer/sending-outgoing");
          break;
        case "ExchangeCurrency":
          this.router.navigateByUrl("/app/exchange-currency/create");
          break;
        case "Treasury":
          this.router.navigateByUrl("/app/treasury/treasury-action");
          break;
        case "Setting":
          this.router.navigateByUrl("/app/setting");
          break;
        default:
          break;
      }
    }
    
  }
}
