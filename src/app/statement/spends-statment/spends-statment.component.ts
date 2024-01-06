import { AfterViewInit, Component, Inject, Injector, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { TreasuryActionStatementOutputDto, TreasuryActionServiceProxy, PdfTreasuryActionServiceProxy, API_BASE_URL } from '@shared/service-proxies/service-proxies';
import { SearchSpendsStatmentComponent } from './search-spends-statment.component';

@Component({
  selector: 'app-spends-statment',
  templateUrl: './spends-statment.component.html',
  styleUrls: ['./spends-statment.component.scss']
})
export class SpendsStatmentComponent extends AppComponentBase implements OnInit {

  input: any;
  treasuryActions: TreasuryActionStatementOutputDto[] = [];
  sumAmount:number = 0;
  private baseUrl: string;
  
  constructor(
    injector: Injector,
    private _router: Router,
    private _treasuryActionAppService: TreasuryActionServiceProxy,
    private _pdfTreasuryActionService: PdfTreasuryActionServiceProxy,
    private _modalService: NbDialogService,
    @Optional() @Inject(API_BASE_URL) baseUrl?: string
    ) {
      super(injector);
      this.baseUrl = baseUrl;
    }

  ngOnInit(): void {
    setTimeout(()=>this.showSearchDialog(),500);
  }
  

  initialTreasuryActions(data){
    this._treasuryActionAppService.getFroStatment(
      1,
      data.fromDate,
      data.toDate,
      data.mainAccount,
      data.mainAccountCompanyId,
      data.mainAccountClientId,
      undefined,
      data.incomeId,
      undefined).subscribe(result =>{
        this.treasuryActions = result;

        this.sumAmount = 0;
        this.treasuryActions.forEach((element) => {
          this.sumAmount = this.sumAmount + element.amount;
        });
      })
      
  }

  showSearchDialog() {
    this._modalService.open(
      SearchSpendsStatmentComponent
    ).onClose.subscribe((e:any) => {
      this.input = e;
      this.initialTreasuryActions(e);
    });
  }

  showTreasuryAction(item){
    this._router.navigate(
      ['/app/treasury/edit-treasury-action',
        {
          "id" : item.id,
        }
      ]);
  }

  downloadPdf(){
    this._pdfTreasuryActionService.getTreasuryAction(
      1,
      this.input.fromDate,
      this.input.toDate,
      this.input.mainAccount,
      this.input.mainAccountCompanyId,
      this.input.mainAccountClientId,
      undefined,
      this.input.incomeId,
      undefined
    )
    .subscribe(result=>{
      const url = `${this.baseUrl}/${result.path}`;
      window.open(url, "_blank");
    });
  }

}
