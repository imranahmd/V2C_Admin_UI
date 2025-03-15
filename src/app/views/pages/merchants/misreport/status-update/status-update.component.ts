import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicreportService } from '../dynamicreport.service';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/_services/alert.service';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { csvToJson } from 'src/app/util/csvjson';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'
@Component({
  selector: 'app-status-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.component.scss']
})
export class StatusUpdateComponent implements OnInit {
  @Output() AddmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;
  modalConfigBlocked: ModalConfig;
  StatusReportForm: FormGroup
  Resdata: any;
  chargebacklistData: any;
  showMessage: any;
  isForm1Submitted: boolean = false
  public rowData!: any[];
  collectionSize: number = 0;
  currentPage: number = 1;
  pageSizeArr: any = defaultPageSizeArr;
  pageSize: number = defaultPageSize || 10;
  public columnDefs: ColDef[] = []
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  private filterObj: any = {}; gridApi: any;
  currDate: any = new Date();
  loading: boolean = false;
  tableInfo: any;
  formvalue: any;

  constructor(private danymicservice: DynamicreportService, private fb: FormBuilder, private alertService: AlertService) {
    this.StatusReportForm = fb.group({
      merchantId: [, []],
      FromDate: [, [Validators.required]],
      ToDate: [, [Validators.required]],
      TransactionID: [, []],
      MerchantTransactionID: [,],
      VPA: [,],
    })
  }

  ngOnInit(): void {
    this.columnDefs = [

      { field: 'AuthID', tooltipField: 'Auth ID', headerName: 'Auth ID', filter: true },
      { field: 'Merchant_TxnID', tooltipField: 'Merchant Transaction ID', headerName: 'Merchant Transaction ID', filter: true },
      { field: 'PG_TxnID', tooltipField: 'PG Transaction ID', headerName: 'PG Transaction ID', filter: true },
      { field: 'Txn_Status', tooltipField: 'Transaction Status', headerName: 'Transaction Status', filter: true },
      { field: 'VPA', tooltipField: 'VPA', headerName: 'VPA', filter: true },
      { field: 'process_id', tooltipField: 'Process ID', headerName: 'Process ID', filter: true },
      // { field: 'TxnID', tooltipField: 'TxnID', headerName: 'Transaction ID', filter: true },
      { field: 'Txn_Amt', tooltipField: 'Transaction Amount', headerName: 'Transaction Amount', filter: true },
      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.tableInfo = data.data
              this.BlockedmerchantSelectEvent.emit(this.tableInfo);
              return await this.modalblockedComponent.open();
            },
            buttonIconClass: 'icon-edit-2',
          },
        ]
      },


    ];

    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.MerchnatList()
    this.modalConfigBlocked = {
      modalTitle: "Status Update",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
  }


  onExportCSV() {
    debugger
    // @ts-ignore
    var random3 = Math.floor(Math.random() * 10000000000 + 1);
    var today = new Date();
    var referenceId = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2) + "_" + (("0" + today.getHours())).slice(-2) + "-" + (("0" + today.getMinutes())).slice(-2) + "-" + (("0" + today.getSeconds())).slice(-2)
    var fileName = 'Rewardoo_' + referenceId
    var params = {
      skipHeader: false,
      skipFooters: true,
      allColumns: true,
      onlySelected: false,
      suppressQuotes: true,
      fileName: fileName + '.csv',
      columnSeparator: ','
    };

    const csvString = this.gridApi.getDataAsCsv();
    console.log("=======>", csvString);
    const convJson = csvToJson(csvString);
    console.log("=======>", convJson);
    const expData: any[] = [];
    (convJson || []).forEach((curr: any) => {
      const tempRec: any = {}
      this.tableSelectedColumn.forEach((col) => {
        // @ts-ignore
        if (col?.field != "actions") {
          if (col?.field) {
            // @ts-ignore
            // tempRec[col?.field.trim()] = (curr[`"${col?.field.trim()}"`] || curr[`"${col?.headerName?.trim()}"`])
            tempRec[col?.field.trim()] = (curr[col?.field.trim()] || curr[col?.headerName?.trim()])
          }

        }
      })
      expData.push(tempRec);
    })
    this.exportAsExcelFile(this.rowData, fileName)
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }
  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
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

  onGridReady(params: any) {
    this.gridApi = params.api;
    //  var data = {
    //       "PGTxnId":"1002212311440058420",
    //       "MTxnId":"030520221651558440990",
    //       "AuthId":"M00005353",
    //       "FromDate":"2023-10-13",
    //       "ToDate":"2023-10-13" 
    // ,
    //       "VPA": this.formvalue.VPA || ''    
    //       }

    //     this.danymicservice.getStatusReportData(data).subscribe((res:any)=>{debugger
    //       this.rowData = 
    //       [
    //           {
    //               "AuthID": "M00005353",
    //               "PG_TxnID": 1002212311440058420,
    //               "Merchant_TxnID": "030520221651558440990",
    //               "Txn_Status": "To",
    //               "Txn_Amt": 10.00,
    //               "VPA": "NA",
    //               "process_id": "8"
    //           },
    //           {
    //               "AuthID": "M00005353",
    //               "PG_TxnID": 1002212311470138422,
    //               "Merchant_TxnID": "030520221651558622593",
    //               "Txn_Status": "Pending",
    //               "Txn_Amt": 10.00,
    //               "VPA": "NA",
    //               "process_id": "6"
    //           }
    //       ]

    //       this.collectionSize = 2
    //     })
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
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
    debugger
    // console.log("onFilterModified----->",param);
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {
    debugger
    console.log("onFilterOpened----->", param);
  }
  getLength(param: any) {
    return param?.length || 0
  }
  refreshGrid() {
    var data = {
      "PGTxnId": this.formvalue.TransactionID || '',
      "MTxnId": this.formvalue.MerchantTransactionID || '',
      "AuthId": this.formvalue.merchantId || '',
      "FromDate": this.formvalue.FromDate || '',
      "ToDate": this.formvalue.ToDate || '',
      "VPA": this.formvalue.VPA || ''
    }
    this.danymicservice.getStatusReportData(data).subscribe((res: any) => {
      debugger
      if (res.Status == 'fail') {
        // this.alertService.errorAlert({
        //   text: res.Reason
        // })
        this.rowData = []
        this.collectionSize = 0
      }
      this.rowData = res
      this.collectionSize = res.length
    })
  }
  closeModalBlocked($event: any) {
    debugger
    if (!$event.showModal) {
      this.modalblockedComponent.close();
      this.refreshGrid();
    }
  }

  MerchnatList() {
    const merchantdata = {
      "name": ""
    };

    this.danymicservice.getMerchantList(merchantdata).subscribe((res: any) => (
      this.Resdata = res));
  }

  onSubmit(formvalue: any) {
    this.formvalue = formvalue
    let data = {
      "PGTxnId": formvalue.TransactionID || '',
      "MTxnId": formvalue.MerchantTransactionID || '',
      "AuthId": formvalue.merchantId || '',
      "FromDate": formvalue.FromDate || '',
      "ToDate": formvalue.ToDate || '',
      "VPA": formvalue.VPA || ''
    }

    if (this.StatusReportForm.valid) {

      if ((2000 > new Date(this.StatusReportForm.controls["FromDate"].value).getFullYear() || new Date(this.StatusReportForm.controls["FromDate"].value) > this.currDate) || (2000 > new Date(this.StatusReportForm.controls["ToDate"].value).getFullYear() || new Date(this.StatusReportForm.controls["ToDate"].value) > this.currDate)) {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })



        // this.refundStatusdata = false
        return
      }
      if (this.StatusReportForm.controls['FromDate'].value > this.StatusReportForm.controls['ToDate'].value) {
        this.alertService.errorAlert({
          text: "From Date can not be greater than To Date!"
        })
        this.rowData = []
        return
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.danymicservice.getStatusReportData(data).subscribe((res: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")

        if (res.Status=='fail') {
          this.alertService.errorAlert({
            text: res?.Reason
          })
          this.showMessage = false
          return
        }
        this.chargebacklistData = res
        this.showMessage = true
        this.rowData = this.chargebacklistData || data;
        this.collectionSize = this.chargebacklistData.totalCount || this.chargebacklistData.length;
      })

    }
    this.isForm1Submitted = true



  }

  resetform() {
    this.showMessage = false
    this.StatusReportForm.reset()
    this.isForm1Submitted = false

  }


  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  NoDoubleSpace(event: any) {
    debugger
    var val = event.target.value
    var len = event.target.value.length

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((val.charCodeAt(len - 1) === charCode) && (len > 0) && (charCode == 32)) {
      return false
    }
    return true;
    // this.elementRef.nativeElement.querySelector('my-element')
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

}
