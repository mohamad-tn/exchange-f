import { Component, Injector, ChangeDetectionStrategy } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { NbComponentShape, NbComponentSize, NbComponentStatus, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  templateUrl: './home.component.html',
  animations: [appModuleAnimation()],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends AppComponentBase {
  public readonly materialTheme$: Observable<boolean>;

  public readonly statuses: NbComponentStatus[] = [ 'primary', 'success', 'info', 'warning', 'danger' ];
  public readonly shapes: NbComponentShape[] = [ 'rectangle', 'semi-round', 'round' ];
  public readonly sizes: NbComponentSize[] = [ 'tiny', 'small', 'medium', 'large', 'giant' ];
  date = new Date();

  constructor(injector: Injector,
    private router: Router,
    private readonly themeService: NbThemeService) {
    super(injector);
    this.materialTheme$ = this.themeService.onThemeChange()
      .pipe(map(theme => {
        const themeName: string = theme?.name || '';
        return themeName.startsWith('material');
      }));
  }

  GoTo() {
    this.router.navigateByUrl('/app/transfer/edit-outgoing-transfer', { state: { id: 4 , name: 'edit-outgoing-transfer' } });
  }
}

