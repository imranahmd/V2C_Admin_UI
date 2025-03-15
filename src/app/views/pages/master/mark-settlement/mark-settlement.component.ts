import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/_services/alert.service';
import { MasterService } from '../master.service';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

@Component({
  selector: 'app-mark-settlement',
  templateUrl: './mark-settlement.component.html',
  styleUrls: ['./mark-settlement.component.scss']
})
export class MarkSettlementComponent implements OnInit {

  markSettlementForm: FormGroup // Corrected instantiation
  loading: boolean = false
  gridApi: any;
  currentPage: number = 1;

  response:any;
  dynamicdate:any;
  collectionSize: number = 0;
  public rowData!: any[];

  pageSize: number = defaultPageSize || 10;
  pageSizeArr: any = defaultPageSizeArr;
  public columnDefs: ColDef[] = []
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };

  tableInfo: any;
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  filterObj: any;
  currentDate: any

  constructor(fb: FormBuilder, private datePipe: DatePipe, private alertService: AlertService, private masterservice: MasterService,) {
    this.markSettlementForm = fb.group({
      searchToDate: [],
      searchFromDate: []
    });
  }

  ngOnInit(): void {

    this.columnDefs = [
      { field: 'MerchantId', tooltipField: 'MerchantId', headerName: 'Merchant ID', filter: true },
      { field: 'MerchantName', tooltipField: 'MerchantName', headerName: 'Merchant Name', filter: true },
      { field: 'ServiceProviderId', tooltipField: 'ServiceProviderId', headerName: 'ServiceProvider ID', filter: true },
      { field: 'SettlementCycle', tooltipField: 'SettlementCycle', headerName: 'Settlement Cycle', filter: true },
      { field: 'SettDate', tooltipField: 'SettDate', headerName: 'Settlement Date', filter: true },
      { field: 'TotalSettlementClaimAmount', tooltipField: 'TotalSettlementClaimAmount', headerName: 'Total Settlement Claim Amount', filter: true },
      { field: 'NetSettlementAmount', tooltipField: 'NetSettlementAmount', headerName: 'Net Settlement Amount', filter: true },
      { field: 'Status', tooltipField: 'Status', headerName: 'Status', filter: true },
      { field: 'respcode', tooltipField: 'respcode', headerName: 'Resp Code', filter: true },
      { field: 'SettClaimId', tooltipField: 'SettClaimId', headerName: 'Sett Claim Id', filter: true },


      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.tableInfo = data.data
              this.Mark(this.tableInfo)

            },
            buttonIconClass: 'icon-edit-2',
          },
        ]
      },

    ];

    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];
  }

  updateSelectedTimeslots(event: any) {
    if (event.target.checked) {
      if (this.tableSelectedColumn.indexOf(this.columnDefs[parseInt(event.target.value)]) < 0) {
        // this.tableSelectedColumn.push(this.columnDefs[parseInt(event.target.value)]);
        this.tableSelectedColumn.splice(parseInt(event.target.value), 0, this.columnDefs[parseInt(event.target.value)]);
      }
    } else {
      if (this.tableSelectedColumn.indexOf(this.columnDefs[parseInt(event.target.value)]) > -1) {
        this.tableSelectedColumn.splice(this.tableSelectedColumn.indexOf(this.columnDefs[parseInt(event.target.value)]), 1);
      }
    }
    this.gridApi.setColumnDefs(this.tableSelectedColumn)
    this.gridApi.setDefaultColDef(this.defaultColDef);


  }

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params: any) {
    debugger
    this.response = []
    this.rowData = []
    this.dynamicdate=[]
    this.currentDate = new Date();
    let dates = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.dynamicdate=dates
    this.gridApi = params.api;
    let data = {
      "Type": "58",
      "Value": localStorage.getItem('user') + '#' + dates + '#' + dates
    }
    this.masterservice.getMarkSttlementList(data).subscribe((res: any) => {
      this.response = res

      this.rowData = this.response
      this.collectionSize = this.response?.totalCount || this.response?.length;



    })

  }

  onFilterChange(param: FilterChangedEvent | any) {
    debugger

    const filterObj = this.gridApi.getFilterModel();
    this.collectionSize = this.gridApi.getDisplayedRowCount();
    const reqFilterArr: any[] = [];
    Object.keys(filterObj).forEach((field) => {
      reqFilterArr.push({
        filterName: field,
        ...filterObj[field]
      })
    })

  }

  onFilterModified(param: FilterModifiedEvent | any) {
    // console.log("onFilterModified----->",param);
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {
    console.log("onFilterOpened----->", param);
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
    debugger
    console.log(param)
    this.gridApi.paginationGoToPage(param - 1)
  }

  onPageSizeChanges($event: Event) {
    $event.preventDefault();
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.refreshCells()
  }

  restForm() {
    this.markSettlementForm.reset()
  }

  markPayout(data: any) {
    debugger
    this.dynamicdate = data

    let markdata = {
      "Type": "58",
      "Value": localStorage.getItem('user') + '#' + data.searchFromDate + '#' + data.searchToDate
    }
    this.masterservice.getMarkSttlementList(markdata).subscribe((res: any) => {
      this.response = []
      this.response = res;
      this.rowData = this.response
      this.collectionSize = this.response?.totalCount || this.response?.length;
    })

  }

  Mark(payout: any) {
    debugger
    let data = {
      "MerchantId": payout.MerchantId,
      "CycleId":payout.SettlementCycle,
      "ReqDate":payout.SettDate,
      "ProccessId":payout.ServiceProviderId
    }
    this.masterservice.MarkRaised(data).subscribe((res) => {

      Swal.fire({
        title: res.Status,
        text: res.RespMessage,
        icon: 'info'
      }).then(() => {
        this.refreshGrid(this.dynamicdate);
      });


    })
  }
  
  refreshGrid(date: any) {
    debugger

    let searchFromDate = date.searchFromDate ? date.searchFromDate : date;
    let searchToDate = date.searchToDate ? date.searchToDate : date;

    let payoutdata1 = {
      "Type": "58",
      "Value": localStorage.getItem('user') + '#' + searchFromDate
        + '#' + searchToDate

    }
    this.masterservice.getMarkSttlementList(payoutdata1).subscribe((res: any) => {
      this.response = []
      this.rowData = []
      this.response = res;
      this.rowData = this.response
      this.collectionSize = this.response?.totalCount || this.response?.length;
    })

}

}