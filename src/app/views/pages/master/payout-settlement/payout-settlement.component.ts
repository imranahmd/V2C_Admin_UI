import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';

import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/_services/alert.service';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { MasterService } from '../master.service';
import { DatePipe } from '@angular/common';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payout-settlement',
  templateUrl: './payout-settlement.component.html',
  styleUrls: ['./payout-settlement.component.scss']
})
export class PayoutSettlementComponent implements OnInit {
  payoutsettlementForm: FormGroup
  loading: boolean = false
  gridApi: any;
  collectionSize: number = 0;
  currentPage: number = 1;
  //pageSize: number = 10;
  pageSize: number = defaultPageSize || 10;

  pageSizeArr: any = defaultPageSizeArr;
  public rowData!: any[];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  public columnDefs: ColDef[] = []
  tableInfo: any;
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  filterObj: any;
  response: any;
  currentDate: any
  dymicdate: any

  constructor(private masterservice: MasterService, private alertService: AlertService, fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.payoutsettlementForm = fb.group({
      searchToDate: [],
      searchFromDate: []
    })

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


      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.tableInfo = data.data
              this.Raised(this.tableInfo)
              // this.Setvalue(this.tableInfo)
              // this.BlockedmerchantSelectEvent.emit(this.tableInfo);
              // return await this.modalblockedComponent.open();

            },
            buttonIconClass: 'icon-edit-2',
          },


          // {

          //   clicked: async (field: any, param: any) => {

          //     this.alertService.confirmBox(this.delete(param.data), {}, {
          //       html: "Record has been deleted.!"
          //     }, () => {
          //       this.onGridReady(param)
          //     })

          //   },
          //   buttonIconClass: 'icon-trash'
          // },
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
    this.dymicdate=[]
    this.currentDate = new Date();
    let dates = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.dymicdate=dates
    this.gridApi = params.api;
    let data = {
      "Type": "57",
      "Value": localStorage.getItem('user') + '#' + dates + '#' + dates
    }
    this.masterservice.getPayoutSttlementList(data).subscribe((res: any) => {
      this.response = res

      this.rowData = this.response
      this.collectionSize = this.response?.totalCount || this.response?.length;



    })

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


  restForm() {
    this.payoutsettlementForm.reset()

  }

  addPayout(data: any) {
    debugger
    this.dymicdate = data

    let payoutdata = {
      "Type": "57",
      "Value": localStorage.getItem('user') + '#' + data.searchFromDate + '#' + data.searchToDate
    }
    this.loading = true
    document?.getElementById('loading')?.classList.add("spinner-border")
    document?.getElementById('loading')?.classList.add("spinner-border-sm")
    this.masterservice.getPayoutSttlementList(payoutdata).subscribe((res: any) => {
      this.loading = false
      document?.getElementById('loading')?.classList.remove("spinner-border")
      document?.getElementById('loading')?.classList.remove("spinner-border-sm")
      this.response = []
      this.response = res;
      this.rowData = this.response
      this.collectionSize = this.response?.totalCount || this.response?.length;
    })

  }

  Raised(payout: any) {
    debugger
    let data = {
      "MerchantId": payout.MerchantId,
      "NetSettlementAmt": payout.NetSettlementAmount,
      "SettClaimId": payout.SettlementCycle
    }
    this.masterservice.PayoutRaised(data).subscribe((res) => {

      Swal.fire({
        title: res?.Status,
        text: res?.RespMessage,
        icon: 'info'
      }).then(() => {
        this.refreshGrid(this.dymicdate);
      });


    })
  }


  refreshGrid(date: any) {
    debugger

    let searchFromDate = date.searchFromDate ? date.searchFromDate : date;
    let searchToDate = date.searchToDate ? date.searchToDate : date;

    let payoutdata1 = {
      "Type": "57",
      "Value": localStorage.getItem('user') + '#' + searchFromDate
        + '#' + searchToDate

    }
    this.masterservice.getPayoutSttlementList(payoutdata1).subscribe((res: any) => {
      this.response = []
      this.rowData = []
      this.response = res;
      this.rowData = this.response
      this.collectionSize = this.response?.totalCount || this.response?.length;
    })

  }

}
