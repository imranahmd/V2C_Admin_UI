import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicreportService } from '../dynamicreport.service';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/_services/alert.service';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { csvToJson } from 'src/app/util/csvjson';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'
@Component({
  selector: 'app-charge-back-report',
  templateUrl: './charge-back-report.component.html',
  styleUrls: ['./charge-back-report.component.scss']
})
export class ChargeBackReportComponent implements OnInit {
  ChargebackReportForm:FormGroup
  Resdata: any;
  chargebacklistData: any;
  showMessage: any;
  isForm1Submitted:boolean=false
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
  currDate:any=new Date();
  loading: boolean=false;

  constructor(private danymicservice:DynamicreportService,private fb:FormBuilder,private alertService: AlertService) {
    this.ChargebackReportForm=fb.group({
      merchantId:[,[]],
      FromDate:[,[Validators.required]],
      ToDate:[,[Validators.required]],
      TransactionID:[,[]]

    })
   }

  ngOnInit(): void {
    this.columnDefs = [

      { field: 'ChargeBackId', tooltipField: 'ChargeBackId', headerName: 'Chargeback Id', filter: true },
      { field: 'TxnId', tooltipField: 'TxnId', headerName: 'Transaction Id', filter: true },
      { field: 'MerchantId', tooltipField: 'MerchantId', headerName: 'Merchant Id', filter: true },
      { field: 'merchant_name', tooltipField: 'merchant_name', headerName: 'Merchant Name', filter: true },
      { field: 'TxnAmt', tooltipField: 'TxnAmt', headerName: 'Transaction  Amount', filter: true },
      { field: 'Remarks', tooltipField: 'Remarks', headerName: 'Remarks', filter: true },
      { field: 'Bank_CutOff_Date', tooltipField: 'Bank_CutOff_Date', headerName: 'Bank CutOff Date', filter: true },
      { field: 'Merch_CutOff_Date', tooltipField: 'Merch_CutOff_Date', headerName: 'Merchant CutOff Date', filter: true },
      { field: 'StatusD', tooltipField: 'StatusD', headerName: 'StatusD', filter: true },
      { field: 'Status_Description', tooltipField: 'Status_Description', headerName: 'Status Description', filter: true },
      { field: 'Admin_Comments', tooltipField: 'Admin_Comments', headerName: 'Admin Comments', filter: true },
      { field: 'InsertedBy', tooltipField: 'InsertedBy', headerName: 'Inserted By', filter: true },
      { field: 'CRN_NO', tooltipField: 'CRN_NO', headerName: 'CRN_NO', filter: true },
      { field: 'File_Name', tooltipField: 'File_Name', headerName: 'File Name', filter: true },
      { field: 'InsertedOn', tooltipField: 'InsertedOn', headerName: 'InsertedOn', filter: true },
      { field: 'Modified_By', tooltipField: 'Modified_By', headerName: 'Modified By', filter: true },
      { field: 'Modified_On', tooltipField: 'Modified_On', headerName: 'Modified On', filter: true },

      { field: 'Is_Deleted', tooltipField: 'Is_Deleted', headerName: 'Is Deleted', filter: true },
      { field: 'UpfrontNonUpfront', tooltipField: 'UpfrontNonUpfront', headerName: 'UpfrontNonUpfront', filter: true },

      { field: 'Merchant_remark', tooltipField: 'Merchant_remark', headerName: 'Merchant Remark', filter: true },





      // {
      //   field: 'action', headerName: 'Action', resizable: true,width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
      //     {
      //       clicked: async (field: any, data: any, param: any, formvalue: any) => {
      //         debugger

      //       },
      //       buttonIconClass: 'icon-edit-2',


      //     },




      //   ]
      // },



    ];

    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.MerchnatList()

  }


  onExportCSV() {debugger
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
    this.exportAsExcelFile(expData,fileName)
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




  MerchnatList() {
    const merchantdata = {
      "name": ""
    };

    this.danymicservice.getMerchantList(merchantdata).subscribe((res: any) => (
      this.Resdata = res));
  }

  onSubmit(formvalue:any)
  {
    let data={
      "mid":formvalue.merchantId||'',
      "txnId":formvalue.TransactionID||'',
      "fdate": formvalue.FromDate||'',
      "todate":formvalue.ToDate||'',
      
    }

    if(this.ChargebackReportForm.valid)
    {

      if ((2000 > new Date(this.ChargebackReportForm.controls["FromDate"].value).getFullYear() || new Date(this.ChargebackReportForm.controls["FromDate"].value) > this.currDate) || (2000 > new Date(this.ChargebackReportForm.controls["ToDate"].value).getFullYear() || new Date(this.ChargebackReportForm.controls["ToDate"].value) > this.currDate)) {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })



       // this.refundStatusdata = false
        return
      }
      if (this.ChargebackReportForm.controls['FromDate'].value > this.ChargebackReportForm.controls['ToDate'].value) {
        this.alertService.errorAlert({
          text: "From Date can not be greater than To Date!"
        })
        this.rowData = []
        return
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.danymicservice.getChargebackReportData(data).subscribe((res:any)=>{
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")

        if(res.Error)
        {
          this.alertService.errorAlert({
            text:res?.Error[0]
          })
          this.showMessage=false
          return
        }
        this.chargebacklistData = res
          this.showMessage = res
          this.rowData = this.chargebacklistData || data;
          this.collectionSize = this.chargebacklistData.totalCount || this.chargebacklistData.length;
      })
  
    }
    this.isForm1Submitted=true
  

    
  }

  resetform()
  {
    this.showMessage=false
    this.ChargebackReportForm.reset()
    this.isForm1Submitted=false
  
  }

   
  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  NoDoubleSpace(event:any){debugger
    var val = event.target.value
    var len = event.target.value.length
    
    const charCode = (event.which) ? event.which : event.keyCode;
    if((val.charCodeAt(len-1)===charCode) &&(len >0)&&(charCode==32)){
     return false
    }
    return true;
    // this.elementRef.nativeElement.querySelector('my-element')
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


}
