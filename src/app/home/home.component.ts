import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { NbComponentShape, NbComponentSize, NbComponentStatus, NbDialogService, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StatementComponent } from '@app/statement/statement.component';
import { StatementListComponent } from '@app/statement/statement-list/statement-list.component';

@Component({
  templateUrl: "./home.component.html",
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends AppComponentBase {
  public readonly materialTheme$: Observable<boolean>;

  public readonly statuses: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  public readonly shapes: NbComponentShape[] = [
    "rectangle",
    "semi-round",
    "round",
  ];
  public readonly sizes: NbComponentSize[] = [
    "tiny",
    "small",
    "medium",
    "large",
    "giant",
  ];
  date = new Date();

  constructor(
    injector: Injector,
    private _modalService: NbDialogService,
    private readonly themeService: NbThemeService
  ) {
    super(injector);
    this.materialTheme$ = this.themeService.onThemeChange().pipe(
      map((theme) => {
        const themeName: string = theme?.name || "";
        return themeName.startsWith("material");
      })
    );
  }

  openPopup(){
    this._modalService.open(
      StatementListComponent
    ).onClose.subscribe((e:any) => {
    });
  }
}

