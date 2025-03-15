import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColDef, GridApi, GridReadyEvent, PaginationChangedEvent } from "ag-grid-community";
import { InvoiceFilter, InvoiceReportServiceService } from '../../merchant-master/invoice-report-service.service';
import { AlertService } from 'src/app/_services/alert.service';
import { environment } from 'src/environments/environment';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.scss']
})
export class InvoiceReportComponent implements OnInit {
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 170,
    filter: false,
    resizable: true
  };
  MasterReportform: FormGroup
  quickFilterShow: boolean;
  showhide:any;
  public searchFromDate: string;
  public searchToDate: string;
  public SearchAmount: string = ""
  public invoiceStatus: string = ""
  public columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'payment_Link_Id', headerName: 'Payment Link ID' },
    { field: 'invoice_Number', headerName: 'Invoice Number' },
    { field: 'amount', headerName: 'Amount' },
    { field: 'validity', headerName: 'Validity' },
    { field: 'customer_Name', headerName: 'Customer Name' },
    { field: 'link', headerName: 'Link' },
    { field: 'status', headerName: 'Status' },
    {
      field: 'action', headerName: 'Action', resizable: true, cellRenderer: BtnCellRenderer, cellRendererParams: [
        {
          clicked: async (field: any, param: any) => {

            console.log(param)
            this.showhide=param.data.status
            // await this.modalDeleteComponent.open();
            this.alertService.cancelBox(this.cancelInvoice(param.data.id), {}, {
              html: "Record has been cencelled.!"
            }, () => {
              this.refreshGrid();
            })
          },
          buttonIconClass: 'icon-x-circle',
         buttonVisible: "('${status}'=='Created')",

        },


      ]
    },


  ];


  currentPage: number = 1;
  private gridApi!: GridApi;
  private filterObj: any = {};
  pageSize: number = defaultPageSize;
  public rowData!: any[];
  collectionSize: number = 0;
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  currentDate:any = new Date()
  public pageSizeArr: any = defaultPageSizeArr;
  response: any;

  constructor(private datepipe: DatePipe, private invoiceservice: InvoiceReportServiceService, private alertService: AlertService) { }
  quickFilterShowAction($event: Event) {
    this.quickFilterShow = !this.quickFilterShow
    if (!this.quickFilterShow) {
      this.searchToDate = '';
      this.searchFromDate = '';
      this.SearchAmount = '';
      this.invoiceStatus = '';


      // this.refreshGrid();
    }

  }

  ngOnInit(): void {
  }

  onExportCSV() {
    console.log("asdasdas");
    // @ts-ignore
    var random3 = Math.floor(Math.random() * 10000000000 + 1);
    var today = new Date();
    var referenceId = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2) + "_" + (("0" + today.getHours())).slice(-2) + "-" + (("0" + today.getMinutes())).slice(-2) + "-" + (("0" + today.getSeconds())).slice(-2)
    var fileName = 'Risk_Alert' + "_" + referenceId
    var params = {
      skipHeader: false,
      skipFooters: true,
      allColumns: true,
      onlySelected: false,
      suppressQuotes: true,
      fileName: fileName + '.csv',
      columnSeparator: ','
    };
    this.gridApi.exportDataAsCsv(params)
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.getFilterInstance('age', (filterParam) => {
      console.log('asdasdad', filterParam);
    })
    this.gridApi.showLoadingOverlay();
    // this.gridApi.setQuickFilter(this.globalSearch);

    return this.invoiceservice.getInvoiceReport(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => (console.log("****onGridReady", data),
        this.rowData = data?.invoices || data,
        this.collectionSize = data?.totalRecords || data?.length));
  }

  onSearchBtnClick($event: Event) {
    if (new Date(this.searchFromDate) > new Date(this.searchToDate)) {
      this.alertService.errorAlert({
        text: "From Date can not be greater than To Date"
      })
      this.rowData = []
      return 
    }
    const filter: InvoiceFilter = {}

    if (this.searchFromDate) filter.iFDate = this.searchFromDate;
    if (this.searchToDate) filter.iToDate = this.searchToDate;
    if (this.SearchAmount) filter.iAmount = this.SearchAmount;
    if (this.invoiceStatus) filter.iStatus = this.invoiceStatus;


    return this.invoiceservice.getInvoiceReport(this.pageSize, (this.currentPage - 1), filter)
      .subscribe((data) => (console.log("****onSearchBtnClick", data),
        this.rowData = data?.invoices ? data?.invoices : [],
        //  this.rowData = data?.Details?data?.Details: this.alertService.simpleAlert(data?.message||'No Data found'),
        data?.message ? this.alertService.simpleAlert(data?.message || 'No Data found') : console.log(data.message),
        this.collectionSize = data?.totalRecords || data?.TotalRecords || data?.length || 0));
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

    const filter: InvoiceFilter = {}


    if (this.searchFromDate) filter.iFDate = this.searchFromDate;
    if (this.searchToDate) filter.iToDate = this.searchToDate;
    if (this.SearchAmount) filter.iAmount = this.SearchAmount;
    if (this.invoiceStatus) filter.iStatus = this.invoiceStatus;

    // this.gridApi.paginationSetPageSize()
    console.log("onPaginationChange----->", this.pageSize);
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    this.invoiceservice.getInvoiceReport(this.pageSize, (param - 1), filter)
      .subscribe((data) => (this.rowData = data?.invoices || data,
        this.collectionSize = data?.totalCount || data.totalRecords || data.length,
        this.gridApi.applyTransaction({ add: this.rowData })));
  }

  // onPaginationChange(param: PaginationChangedEvent | any) {
  //   this.gridApi.paginationGoToPage(param - 1)
  // }
  onPageSizeChanges($event: Event) {

    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    this.invoiceservice.getInvoiceReport(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.invoices || data.merchants || data,
        this.collectionSize = data.totalCount || data.totalRecords,
        this.gridApi.applyTransaction({ add: this.rowData })));

  }

  cancelInvoice(Id: any) {

    let canceldata = {
      "id": Id.toString()
    }
   return this.invoiceservice.changeInvoiceStatus(canceldata)
  }

  refreshGrid() {

    return this.invoiceservice.getInvoiceReport(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => (console.log("****onGridReady", data),
        this.rowData = data?.invoices || data,
        this.collectionSize = data?.totalRecords || data?.length));
  }

}
