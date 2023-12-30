import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-button',
  templateUrl: './main-button.component.html',
  styleUrls: ['./main-button.component.scss']
})
export class MainButtonComponent implements OnInit {

  @Input()title: string;
  @Input()link: string;
  @Input()type: string;
  constructor() { }

  ngOnInit(): void {
  }

}
