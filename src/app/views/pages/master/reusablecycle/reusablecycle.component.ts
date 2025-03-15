import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-reusablecycle',
  templateUrl: './reusablecycle.component.html',
  styleUrls: ['./reusablecycle.component.scss']
})
export class ReusablecycleComponent implements OnInit {
  constructor() {}

  public template: TemplateRef<any>;
  public context: any = {};

  ngOnInit() {}

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams) {
    this.setTemplateAndParams(params);
  }

  // gets called whenever the cell refreshes
  refresh(params: ICellRendererParams) {
    this.setTemplateAndParams(params);
  }

  setTemplateAndParams(params:any) {
    this.template = params['ngTemplate'];
    this.context = {
      rowInfo: {
        rowData: params.data,
        rowId: params.node.id,
        columnName: params.colDef.headerName,
      },
    };
    console.log(this.context);
  }

}
