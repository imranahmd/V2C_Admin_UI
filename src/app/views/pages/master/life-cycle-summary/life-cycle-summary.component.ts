import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ColDef, GridApi, PaginationChangedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-life-cycle-summary',
  templateUrl: './life-cycle-summary.component.html',
  styleUrls: ['./life-cycle-summary.component.scss']
})
export class LifeCycleSummaryComponent implements OnInit {

  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  TransactionData: any;
  private gridApi!: GridApi;
  private filterObj: any = {};
  private merchantValue: null;
  private merchantresponse: any;
  private queryParams: any = {};
  public columnDefs: ColDef[] = []
  public tableSelectedColumn: ColDef[] = [...this.columnDefs];

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  public rowData!: any[];
  tablecolumn: any;
  currentPage: number = 1;
  pageSize: number = 10;
  globalSearch: string = '';
  collectionSize: number = 0;
  SingleRow: any;

  constructor() { }

  ngOnInit(): void {
    this.columnDefs = [
      { field: 'Status', tooltipField: 'Status', headerName: 'Status' },
      { field: 'Message', tooltipField: 'Message', headerName: 'Message' },
      { field: 'TransacId', tooltipField: 'Transaction ID', headerName: 'Transaction ID' },
      { field: 'StatusCode', tooltipField: 'Status Code', headerName: 'Status Code' },
      // { field: 'Addedby', tooltipField: 'Added By', headerName: 'Added By' },

    ];




    this.onMerchantMId.subscribe((res) => (
      this.TransactionData = res,
      this.rowData=this.TransactionData
    ))
  }
  onGridReady(params: any) {
    debugger
    this.gridApi = params.api;

    this.rowData = []
    

  }
  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
    this.gridApi.paginationGoToPage(param - 1)
  }


  onPageSizeChanges($event: Event) {
    $event.preventDefault();
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    this.gridApi.applyTransaction({ add: this.rowData })

  }


}
