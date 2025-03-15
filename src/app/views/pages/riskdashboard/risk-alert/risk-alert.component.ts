import {Component, OnInit} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent, PaginationChangedEvent} from "ag-grid-community";
import {ApiHttpService} from "../../../../_services/api-http.service";
import {environment} from "../../../../../environments/environment";
import {RiskdashboardFilter, RiskdashboardService} from '../riskdashboard.service';
import { AlertService } from 'src/app/_services/alert.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'


const {API_URL,defaultPageSizeArr, defaultPageSize} = environment;

// const API_URL = 'http://localhost:8000'
export interface IRiskData {

}

@Component({
  selector: 'app-risk-alert',
  templateUrl: './risk-alert.component.html',
  styleUrls: ['./risk-alert.component.scss']
})
export class RiskAlertComponent implements OnInit {
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 170,
    filter: false,
    resizable: true
  };
  public quickFilterShow: boolean = false;
  public searchMID: string;
  public searchFromDate: string;
  public searchToDate: string;
  public searchRiskCode: string;
  public searchRiskStage: string;
  public searchRiskFlag: string
  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    {field: 'rid',headerName: 'RID'},
     {field: 'TransactionTime',headerName: 'Transaction Time'},
      {field: 'RiskStage',headerName: 'Risk Stage'},

      {field: 'MID',headerName: 'MID'},
      {field: 'merchant_name',headerName: 'Merchant Name'},
      {field: 'RiskCode',headerName: 'Risk Code'},
      {field: 'RiskMessage',headerName: 'Risk Message'},


      {field: 'EstimatedValue',headerName: 'Estimated Value'},
      {field: 'ObservedValue',headerName: 'Observed Value'},
     {field: 'RiskPercentage',headerName: 'Risk Percentage'},
       {field: 'RiskFlag',headerName: 'Risk Flag'},

    ];
  public rowDatang: any = [];
  currentPage: number = 1;
  pageSize: number = defaultPageSize;
  public rowData: IRiskData[] = [];
  collectionSize: number = 0;
  tableSelectedColumn: ColDef[] = [...this.columnDefs];
  Resdata: any;
  Riskdatadata: any;
  RiskFlagdatadata: any;
  private gridApi!: GridApi;
  private filterObj: any = {};
  Resultdata: any;
  public pageSizeArr: any = defaultPageSizeArr;
  totalRecords: number;
  loading: boolean = false;
  constructor(private Services: RiskdashboardService, private alertService: AlertService,private apiHttpService: ApiHttpService) {
    this.loading = false
  }

  quickFilterShowAction($event: Event) {
    this.quickFilterShow = !this.quickFilterShow
    if (!this.quickFilterShow) {
      this.searchToDate = '';
      this.searchFromDate = '';
      this.searchMID = '';
      this.searchRiskCode = '';
      this.searchRiskStage = '';
      this.searchRiskFlag = '';

      this.refreshGrid();
    }

  }

  ngOnInit(): void {

    this.RiskCodes();
    this.RiskStages()
    this.RiskFlag()
    this.MerchnatList()

  }

  onExportCSV() {debugger
    console.log("asdasdas");
    // @ts-ignore
    var random3 = Math.floor(Math.random() * 10000000000 + 1);
    var today = new Date();
    var referenceId = today.getFullYear().toString() + "-" +("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2) + "_" + (("0" + today.getHours())).slice(-2)+"-" +(("0" + today.getMinutes())).slice(-2) +"-" +(("0" + today.getSeconds())).slice(-2)
    var fileName = 'Risk_Alert'+"_"+referenceId
    var params = {
      skipHeader: false,
      skipFooters: true,
      allColumns: true,
      onlySelected: false,
      suppressQuotes: true,
      fileName: fileName+'.csv',
      columnSeparator: ','
    };
    // this.gridApi.exportDataAsCsv(params)
    // filter.columns = {};
    // this.tableSelectedColumn.forEach((col) => {
    //   if (col?.field) filter['columns'][col?.field] = col?.headerName
    // })
    this.Services.getRisk(this.totalRecords + 3, 0)

      .subscribe((data) => {
        console.log(data)
        const expData: any[] = [];
        (data?.data || data?.Details
          || data || []).forEach((curr: any) => {
          const tempRec: any = {}
          // this.tableSelectedColumn.forEach((col) => {
          //   if (col?.field) tempRec[col?.field] = curr[col?.field]
          // })
          this.tableSelectedColumn.forEach((col) => {
            if(!(col?.field=="actions"))
  
            {
            if (col?.field) tempRec[col?.field] = curr[col?.field]
  
          }})
          expData.push(tempRec);
        })

        // this.JSONToCSVConvertor(data?.data || data?.merchants || data || [],fileName, "Report");
        this.exportAsExcelFile(expData, fileName);
      })	

      
    
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], {
      // @ts-ignore
      header: [...this.tableSelectedColumn.map((col)=> col.headerName)]
    });
    // const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [[...this.tableSelectedColumn.map((col)=> col.headerName)]]);
    XLSX.utils.sheet_add_json(worksheet, json, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'buffer'});
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }




  onGridReady(params: GridReadyEvent<IRiskData>) {
    this.gridApi = params.api;
    this.gridApi.getFilterInstance('age', (filterParam) => {
      console.log('asdasdad', filterParam);
    })
    this.gridApi.showLoadingOverlay();
    // this.gridApi.setQuickFilter(this.globalSearch);

    return this.Services.getRisk(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => {console.log("****onGridReady", data)
      ,
       this.rowData = data?.Details || data||[],
       this.collectionSize = data?.TotalRecords || data?.length
       this.totalRecords= data.TotalRecords
      if(this.rowData.length <=0){
        this.alertService.errorAlert({text: "No data found!" })
        return }
      });
  }

  onSearchBtnClick($event: Event) {
    const filter: RiskdashboardFilter = {}
    if (this.searchMID) filter.Mid = this.searchMID;
    if (this.searchFromDate) filter.From = this.searchFromDate;
    if (this.searchToDate) filter.ToDate = this.searchToDate;
    if (this.searchRiskCode) filter.RiskCode = this.searchRiskCode;
    if (this.searchRiskStage) filter.RiskStage = this.searchRiskStage;
    if (this.searchRiskFlag) filter.RiskFlag = this.searchRiskFlag;

this.loading = true
        document?.getElementById('loading')?.classList.add("spinner-border")
        document?.getElementById('loading')?.classList.add("spinner-border-sm")
    return this.Services.getRisk(this.pageSize, (this.currentPage - 1), filter)

      .subscribe((data) => {console.log("****onSearchBtnClick", data),
      this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
       this.rowData = data?.Details?data?.Details: [],
      //  this.rowData = data?.Details?data?.Details: this.alertService.simpleAlert(data?.message||'No Data found'),
      //  data?.message?this.alertService.simpleAlert(data?.message||'No Data found'):console.log(data.message),
       this.collectionSize = data?.totalCount || data?.TotalRecords || data?.length || 0
       if(this.rowData.length <=0){
        this.alertService.errorAlert({text: "No data found!" })
        return }
      });
  }

  // onPageSizeChanges($event: Event) {
  //   console.log($event.preventDefault());
  //   this.gridApi.paginationSetPageSize(this.pageSize)
  //   this.gridApi.applyTransaction({remove: this.rowData})
  //   this.gridApi.showLoadingOverlay();
  //   this.Services.getRisk(this.pageSize, (this.currentPage - 1))
  //     .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.data || data.merchants || data, this.collectionSize = data.totalCount || data.totalRecords, this.gridApi.applyTransaction({add: this.rowData})));

  // }

  onPaginationChange(param: PaginationChangedEvent | any) {
    const filter: RiskdashboardFilter = {}
    if (this.searchMID) filter.Mid = this.searchMID;
    if (this.searchFromDate) filter.From = this.searchFromDate;
    if (this.searchToDate) filter.ToDate = this.searchToDate;
    if (this.searchRiskCode) filter.RiskCode = this.searchRiskCode;
    if (this.searchRiskStage) filter.RiskStage = this.searchRiskStage;
    if (this.searchRiskFlag) filter.RiskFlag = this.searchRiskFlag;
    // this.gridApi.paginationSetPageSize()
    console.log("onPaginationChange----->",this.pageSize);
    this.gridApi.applyTransaction({remove: this.rowData})
    this.gridApi.showLoadingOverlay();
    this.Services.getRisk(this.pageSize, (param - 1),filter)
      .subscribe((data) =>(this.rowData = data?.Details||data,
         this.collectionSize = data?.totalCount|| data.TotalRecords || data.length,
          this.gridApi.applyTransaction({ add: this.rowData })));
  }

  // onPaginationChange(param: PaginationChangedEvent | any) {
  //   this.gridApi.paginationGoToPage(param - 1)
  // }
  onPageSizeChanges($event: Event) {

    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({remove: this.rowData})
    this.gridApi.showLoadingOverlay();
    this.Services.getRisk(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.Details || data.merchants || data, this.collectionSize = data.totalCount || data.TotalRecords, this.gridApi.applyTransaction({add: this.rowData})));

  }

  RiskCodes() {
    let riskcodelist = {
      "Type": "9",
      "Value": ""
    }

    this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, riskcodelist
      )
      .subscribe((res) =>
        (console.log("****onGridReady" + res), this.Resdata = res));
  }

  RiskStages() {
    let RiskStageslist = {
      "Type": "10",
      "Value": ""
    }

    this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, RiskStageslist
      )
      .subscribe((res) =>
        (console.log("****onGridReady" + res), this.Riskdatadata = res));
  }

  RiskFlag() {
    let RiskFlaglist = {
      "Type": "11",
      "Value": ""
    }

    this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, RiskFlaglist
      )
      .subscribe((res) =>
        (console.log("****onGridReady" + res), this.RiskFlagdatadata = res));
  }

  //get merchant By Name
  MerchnatList() {
    let reqData = {
      "name": ""
    }
    console.log("request body", reqData)
    this.Services.getMerchantBYName(reqData).subscribe((res:any) => {
        this.Resultdata = res
        console.log("merchant mid",res)
      });
  }
  fun(id:any){
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id:any){
    document?.getElementById(id)?.classList.remove("hey")
  }
  refreshGrid() {debugger

    return this.Services.getRisk(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => {console.log("****onGridReady", data)
      ,
       this.rowData = data?.Details || data||[],
       this.collectionSize = data?.TotalRecords || data?.length
       this.totalRecords= data.TotalRecords
      // if(this.rowData.length <=0){
      //   this.alertService.errorAlert({text: "No data found!" })
      //   return }
      });
    // this.gridApi.applyTransaction({remove: this.rowData});
    // return this.resellerService.getAllReseller(this.pageSize, (this.currentPage - 1))
    //   .subscribe((data) => (this.rowData = data.data || data.resellers || data, this.collectionSize = data.totalCount || data.totalrecords || data.totalRecords || data.length));
  }

}




