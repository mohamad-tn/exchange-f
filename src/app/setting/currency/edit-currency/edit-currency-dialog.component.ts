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
  CurrencyServiceProxy, UpdateCurrencyDto,
} from '@shared/service-proxies/service-proxies';
import { NbDialogRef } from '@nebular/theme';
import { CurrencyName, CurrencyNameService } from '@core/utils/currency-name.service';

@Component({
  templateUrl: 'edit-currency-dialog.component.html',
  styleUrls:['edit-currency-dialog.component.scss']
})
export class EditCurrencyDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  currency: UpdateCurrencyDto = new UpdateCurrencyDto();
  id: number;

  currenciesNames: CurrencyName[] = [];
  @Output() onSave = new EventEmitter<any>();
  public fields: Object = { text: 'name', value: 'name' };

  constructor(
    injector: Injector,
    private _currencyNameService: CurrencyNameService,
    public _currencyService: CurrencyServiceProxy,
    public dialogRef: NbDialogRef<EditCurrencyDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.currenciesNames = this._currencyNameService.getAll();
    this._currencyService.getForEdit(this.id).subscribe((result: UpdateCurrencyDto) => {
      this.currency = result;
    });
  }

  save(): void {
    this.saving = true;

    this._currencyService
      .update(this.currency)
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
