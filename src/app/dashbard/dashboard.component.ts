import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends AppComponentBase implements OnInit {

  menus = [
    {
      title: 'OutgoingTransfers',
      link: '/app/transfer/create-outgoing-transfer',
      type: 'primary',
      icon: 'nb-arrow-thin-up'
    },
    {
      title: 'IncomeTransfers',
      link: '/app/transfer/create-income-transfer',
      type: 'info',
      icon: 'nb-arrow-thin-down'
    },
    {
      title: 'NoneReceivedTransfer',
      link: '/app/transfer/direct-transfer',
      type: 'warning',
      icon: 'nb-checkmark-circle'
    },
    {
      title: 'ExchangeCurrency',
      link: '/app/exchange-currency/create',
      type: 'primary',
      icon: 'nb-loop-circled'
    },
    {
      title: 'Treasury',
      link: '/app/treasury/treasury-action',
      type: 'info',
      icon: 'nb-layout-default'
    },
  ];
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

}
