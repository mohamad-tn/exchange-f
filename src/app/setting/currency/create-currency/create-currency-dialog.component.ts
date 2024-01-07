import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AppComponentBase } from '@shared/app-component-base';
import {
  CreateCurrencyDto,
  CurrencyServiceProxy
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { CurrencyName, CurrencyNameService } from '@core/utils/currency-name.service';

@Component({
  templateUrl: 'create-currency-dialog.component.html',
  styleUrls:['create-currency-dialog.component.scss'],
  providers:[CurrencyServiceProxy]
})
export class CreateCurrencyDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  currency: CreateCurrencyDto = new CreateCurrencyDto();
  currenciesNames: CurrencyName[] = [];
  @Output() onSave = new EventEmitter<any>();
  public fields: Object = { text: 'name', value: 'name' };

  constructor(
    injector: Injector,
    private _currencyNameService: CurrencyNameService,
    public _currencyService: CurrencyServiceProxy,
    public dialogRef: NbDialogRef<CreateCurrencyDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.currenciesNames = this._currencyNameService.getAll();
  }

  save(): void {
    this.saving = true;

    this._currencyService
      .create(this.currency)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(() => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.dialogRef.close();
        this.onSave.emit();
      });
  }
}
