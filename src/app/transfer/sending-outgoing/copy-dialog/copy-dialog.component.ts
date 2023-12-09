import { Component, Injector, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { AppComponentBase } from '@shared/app-component-base';
import { Clipboard } from '@syncfusion/ej2-angular-grids';

@Component({
  selector: "app-copy-dialog",
  templateUrl: "./copy-dialog.component.html",
  styleUrls: ["./copy-dialog.component.scss"],
})
export class CopyDialogComponent extends AppComponentBase implements OnInit {
  data: any[] = [];
  dataCopy: string = "";
  
  constructor(
    injector: Injector,
    public dialogRef: NbDialogRef<CopyDialogComponent>
  ) {
    super(injector);
  }

  ngOnInit(): void {

    for (let i = 0; i < this.data.length; i++) {
      this.dataCopy =
        this.dataCopy +
        "/// الحوالة" +
        (i + 1) +
        "\n" +
        this.data[i].date +
        "\n" +
        this.data[i].currency?.name +
        "\n" +
        this.data[i].toCompany.name +
        "\n" +
        this.data[i].amount +
        "\n";
    }
  }
}
