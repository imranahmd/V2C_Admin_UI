import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DataTable } from 'simple-datatables';
import { ReconManagementService } from '../recon-management.service';
import {
  ColDef,
  Column, ColumnApi,
  FilterChangedEvent,
  FilterModifiedEvent,
  FilterOpenedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererParams,
  PaginationChangedEvent,
  RowClickedEvent
} from "ag-grid-community";
import { environment } from 'src/environments/environment';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
@Component({
  selector: 'app-reconview',
  templateUrl: './reconview.component.html',
  styleUrls: ['./reconview.component.scss']
})
export class ReconviewComponent implements OnInit {
  private gridColumnApi!: ColumnApi;

  // columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [];
  private gridApi!: GridApi;
  private filterObj: any = {};
  public rowData!: any[];
  tablecolumn: any;
  currentPage: number = 1;
  globalSearch: string = '';
  collectionSize: number = 0;
  public quickFilterShow: boolean = false;
  public pageSize: number = defaultPageSize;
  public pageSizeArr: any = defaultPageSizeArr;
  public searchMerName: string;
  public searchMID: string;
  public resellerPartnerId: string;
  public Status: string;
  public searchFromDate: string;
  public searchToDate: string;
  public selectedMerchant: string;
  merchantStatus: any;
  // public detailCellRenderer = new DetailCellRenderer;
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    resizable: true,
    sortable: true,
    // suppressSizeToFit: true,
    // suppressAutoSize: true,
    filter: false,
    autoHeight: true
  };

  dataTable: DataTable;
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  public columnDefs: ColDef[] = [
    { field: 'Id', tooltipField: 'ID', headerName: 'ID', resizable: true},
    { field: 'TXN_ID', tooltipField: 'Transaction ID', headerName: 'Transaction ID', resizable: true},
    { field: 'amount', tooltipField: 'Amount', headerName: 'Amount', resizable: true},
    { field: 'date_time', tooltipField: 'Date Time', headerName: 'Date Time', resizable: true},
    { field: 'txn_status', tooltipField: 'Transaction Status', headerName: 'Transaction Status', resizable: true},
    { field: 'FileId', tooltipField: 'File ID', headerName: 'File ID', resizable: true},
    { field: 'IsException', tooltipField: 'Is Exception', headerName: 'Is Exception', resizable: true},
    { field: 'Counter', tooltipField: 'Counter', headerName: 'Counter', resizable: true},
    { field: 'Exception', tooltipField: 'Exception', headerName: 'Exception', resizable: true}
  ]

  constructor(private reconService: ReconManagementService) { }
  onPaginationChange(param: PaginationChangedEvent | any) {
    debugger

    this.gridApi.paginationGoToPage(param - 1)
  }

  onPageSizeChanges($event: Event) {
    // const allColumnIds: string[] = [];
    // this.gridColumnApi.getColumns()!.forEach((column:any) => {
    //   allColumnIds.push(column.getId());
    // });
    // this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    console.log($event.preventDefault());
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    this.gridApi.applyTransaction({ add: this.rowData })
    // this.Services.GetRiskActionLogs(this.pageSize, (this.currentPage - 1))
    //   .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.data || data.merchants || data,
    //    this.collectionSize = data.totalCount || data.totalRecords,

    //     ));

  }
  onGridReady(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.getFilterInstance('age', (filterParam) => {
    })
    this.gridApi.showLoadingOverlay();
    this.gridApi.setQuickFilter(this.globalSearch);
    const allColumnIds: (string | Column)[] = [];
    params?.columnApi?.getColumns()?.forEach((column) => {
      allColumnIds.push(column.getId());
    });
    params?.columnApi?.autoSizeColumns(allColumnIds, false);
    this.rowData = []
    // return this.merchantService.getAllMerchant(this.pageSize, (this.currentPage - 1))
    //   .subscribe((data) => {
    //     this.rowData = data.data || data.merchants || data;
    //     this.collectionSize = data.totalCount || data.totalrecords || data.totalRecords || data.length
    //     this.totalRecords =  data.totalRecords
    //   });
  }
  ngOnInit(): void {

    this.onMerchantMId.subscribe((res) => {
      debugger

      let data = {
        "FileId": localStorage.getItem('fileID')
      }
      // var random3 = Math.floor(Math.random() * 10000000000 + 1);
      // var today = new Date();
      // var referenceId = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2)
      // var fileName = 'Rewardoo_' + referenceId + random3 + '.xlsx'
      this.reconService.getreport(data).subscribe((res: any) => {
        this.rowData = res||[];
        this.collectionSize =res.length||0
        // this.totalRecords =  data.totalRecords
        // if (this.rowData) {
        //   Object.values(this.rowData).forEach((element: any, i: number) => {
        //     console.log(element)
        //     this.dataTable = new DataTable("#dataTableExample")
        //     // this.dataTable.rows().add([i+1+'',element]);
        //     this.dataTable.rows().add(Object.values(element));
        //   })
        // }
        // this.BlockedmerchantSelectEvent.emit(response);
        // this.exportAsExcelFile(res, fileName);
      })

    })


  }
}



