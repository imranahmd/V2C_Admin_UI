import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, map, Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { ModalConfig } from "../../../../common/modal/modal.config";
import { ModalComponent } from "../../../../common/modal/modal.component";
import { MerchantFilter, MerchantService } from "./merchant.service";
import { BtnCellRenderer } from "../../../../common/button-cell-renderer.component";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { SidebarComponent } from "../../../layout/sidebar/sidebar.component";
import { SideNavService } from "../../../layout/sidebar/side-name.service";
import { StorageService } from "../../../../_services/storage.service";
import { Location } from "@angular/common";
import { AlertService } from "../../../../_services/alert.service";
import { MenusService } from "../../../../_services/menu.service";
import { NgSelectComponent } from "@ng-select/ng-select";
import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from "@angular/forms";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { MasterService } from '../../master/master.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'
const MERCHANT_STATUS = [
  {
    "FieldValue": "approved",
    "FieldText": "Approved"
  },
  {
    "FieldValue": "rejected",
    "FieldText": "Rejected"
  },
  {
    "FieldValue": "suspended",
    "FieldText": "Suspended"
  },
  {
    "FieldValue": "hold",
    "FieldText": "Hold"
  },
  {
    "FieldValue": "active",
    "FieldText": "Active"
  }
];

const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

// const API_URL = 'http://localhost:8000'
export interface IMerchantData {
  "name": string,
  "merchantId": string,
  "businessName": string,
  "contactperson": string,
  "id": number,
  "contactno": string,
  "emailid": string,
  "state": string,
  "city": string,
  "isdeleted": string

}

export class DetailCellRenderer implements ICellRendererComp {
  eGui!: HTMLElement;

  init(params: ICellRendererParams) {
    this.eGui = document.createElement('div');
    this.eGui.innerHTML = '<h1 style="padding: 20px;">My Custom Detail</h1>';
  }

  getGui() {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}

const dateFormatter = (param: any) => {
  const date = param.data.created_on;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

const statusFormatter = (param: any) => {
  const sta = param.data.status;
  // @ts-ignore
  const staObj = MERCHANT_STATUS.find((d) => d.FieldValue == sta);
  return staObj?.FieldText || 'Pending';
}

@Component({
  selector: 'app-merchant-master',
  templateUrl: './merchant-master.component.html',
  styleUrls: ['./merchant-master.component.scss']
})
export class MerchantMasterComponent implements OnInit {
  @Output() merchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() merchantConfigEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  // @Output() isEdit: EventEmitter<any> = new EventEmitter<any>();
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
  public detailCellRenderer = new DetailCellRenderer;
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
  dynamicDate: any = this.getToday();
  public rowData!: IMerchantData[];
  tablecolumn: any;
  currentPage: number = 1;
  globalSearch: string = '';
  collectionSize: number = 0;
  modalConfigAdd: ModalConfig;
  modalConfigEdit: ModalConfig;
  modalConfigMerchant: ModalConfig;
  Merchantdata: any;
  userType: any;
  modalConfigBlocked: ModalConfig;
  public menuItems: any;
  public permissions: any = '';
  currentDate: any = new Date();
  tableInfo: any;
  serviceProviderForm: FormGroup
  serviceProviderData: any[] = [];
  submit1: boolean = false
  selectedServiceProvider: string = '';

  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;
  @ViewChild('filSearchMerName') private filSearchMerName: NgSelectComponent;
  @ViewChild('filSearchMID') private filSearchMID: NgSelectComponent;
  @ViewChild('filResellerPartnerId') private filResellerPartnerId: NgSelectComponent;
  @ViewChild('filStatus') private filStatus: NgSelectComponent;
  @ViewChild('filSearchToDate') private filSearchToDate: FormControl;
  @ViewChild('filSearchFromDate') private filSearchFromDate: FormControl;

  public columnDefs: ColDef[] = [
    { field: 'name', tooltipField: 'name', headerName: 'Legal Name', resizable: true, cellRenderer: 'agGroupCellRenderer' },
    { field: 'merchantId', tooltipField: 'merchantId', headerName: 'Auth ID' },
    { field: 'businessName', tooltipField: 'businessName', headerName: 'Trade Name', },
    { field: 'contactperson', tooltipField: 'contactperson', headerName: 'Contact Person', },
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'contactno', tooltipField: 'contactno', headerName: 'Contact No', },
    { field: 'emailid', tooltipField: 'emailid', headerName: 'Email ID', },
    // {field: 'state',headerName: 'State',},
    // {field: 'dateCorporation_on',headerName: 'Date Of Incorporation',},
    { field: 'reseller_Id', tooltipField: 'reseller_Id', headerName: ' Partner ID', },
    { field: 'reseller_Name', tooltipField: 'reseller_Name', headerName: ' Partner Name', },
    { field: 'sales_lead', tooltipField: 'sales_lead', headerName: 'Sales Lead', },
    { field: 'created_on', tooltipField: 'created_on', headerName: 'Created On', },
    { field: 'riskApproval', tooltipField: 'riskApproval', headerName: 'Risk Approval', },
    // {field: 'basicSetupApproval',headerName: 'Basic Setup Approval',},
    { field: 'kycapproval', tooltipField: 'kycapproval', headerName: 'KYC Approval', },
    { field: 'status', tooltipField: 'status', headerName: 'Status', },
    // {field: 'city', tooltipField: 'city', headerName: 'City',hide: true},
    // {field: 'created_on', headerName: 'Created On Formatted',  filter: 'agDateColumnFilter', valueFormatter: dateFormatter},
    // {field: 'status', headerName: 'Status Formatted', minWidth: 120, valueFormatter: statusFormatter},
    {
      field: 'actions', headerName: 'Actions', width: 30, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
        /*{
          clicked: async (event: any, param:any) => {
            this.selectedMerchant = param.data.merchantId
            console.log("ad--------------->",this.selectedMerchant,  param.data.merchantId)
            this.merchantSelectEvent.emit(this.selectedMerchant);
            return await this.modalMerchantBankComponent.open();
          },
          buttonIconClass: 'icon-settings'
        },*/{
          clicked: async (event: any, param: any) => {
            this.tableInfo = param.data.merchantId
            this.BlockedmerchantSelectEvent.emit(this.tableInfo);
            return await this.modalblockedComponent.open();
          },
          buttonIconClass: 'icon-settings'
        },
        /*{
          clicked: async (field: any, param:any) => {
            console.log((`${field} was clicked`))
            this.Merchantdata = param.data.merchantId
            console.log("ad--------------->",this.Merchantdata,  param.data.merchantId)
            this.merchantConfigEvent.emit(this.Merchantdata);
            await this.modalMerchantComponent.open()
          },
          buttonIconClass: 'icon-edit-2'
        }*/
      ]
    }
  ];
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  private gridApi!: GridApi;
  private filterObj: any = {};
  @ViewChild('modalEdit') private modalEditComponent: ModalComponent
  @ViewChild('modalAdd') private modalAddComponent: ModalComponent
  @ViewChild('modalMerchant') private modalMerchantComponent: ModalComponent
  @ViewChild('modalMerchantBank') private modalMerchantBankComponent: ModalComponent
  private innerWidth: number;
  private _event: any;
  resellerListOptions: any;
  merchantStatusdata: any;
  Resultdata: any;
  private gridColumnApi!: ColumnApi;
  totalRecords: any;
  LocalUser: any;

  constructor(private fb: FormBuilder, private masterservice: MasterService, private menuService: MenusService, private location: Location, private alertService: AlertService, private sideNavService: SideNavService, private merchantService: MerchantService, private router: Router, private sidebarComponent: SidebarComponent, private storageService: StorageService) {
    this.merchantService.getBusinessType().subscribe((data) => this.merchantStatus = data);
    console.log("============>", this.tableSelectedColumn);
    this.serviceProviderForm = fb.group({
      spId: [, []]
    });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? []
        : this.rowData.filter(v => (v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).map(v => v.name).slice(0, 10))
    );
  maxSize: number = 7;
  ellipses: boolean = true;

  async ngOnInit(): Promise<void> {
    this.innerWidth = window.innerWidth;
    this.setPageSize();
    const path = this.location.prepareExternalUrl(this.location.path());
    this.permissions = this.menuService.getPermissions(path);
    if (this.permissions == null || this.permissions == '' || !this.permissions) {
      this.alertService.errorAlert({
        title: "No Access",
        backdrop: true,
        toast: true,
        timer: 1500
      })
      await this.router.navigateByUrl('/');


    }

    this.modalConfigBlocked = {
      modalTitle: "Merchant Status",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
    this.modalConfigAdd = {
      modalTitle: "Add Merchant",
      modalSize: 'xl',
      hideCloseButton(): boolean {
        return true;
      },
      hideDismissButton(): boolean {
        return true
      }
    }

    this.modalConfigEdit = {
      modalTitle: "Edit Merchant",
      modalSize: 'xl',
      hideCloseButton(): boolean {
        return true;
      },
      hideDismissButton(): boolean {
        return true
      }
    }
    this.modalConfigMerchant = {
      modalTitle: "Merchant RMS Configuration",
      modalSize: 'xl',
      hideCloseButton(): boolean {
        return true;
      },
      hideDismissButton(): boolean {
        return true
      }
    }

    this.merchantService.getResellerList().subscribe((data) => this.resellerListOptions = data)
    this.merchantStatusDropdown()
    this.MerchnatList()

    this.LocalUser = localStorage.getItem("menuItems")
    this.userType = JSON.parse(this.LocalUser).finalMenus[0].ROLENAME
    this.serviceProvider();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(this.innerWidth, "------->");
    this._event = event;
    this.innerWidth = window.innerWidth;
    this.setPageSize();
  }

  onSortChange(event: any) {
    const listOfSortModel = this?.gridColumnApi?.getColumnState().filter(s => s.sort !== null)
    console.log("==Sort===>", listOfSortModel);
  }

  // changeDate(){
  //   this.currentDate=this.searchFromDate
  // }


  // changeEndDate()
  // {
  //   this.currentDate=this.searchToDate
  // }


  setPageSize() {
    // this.columnDefs = this.columnDefs.map((col)=>{
    //   if(col.field == 'actions'){
    //     col.pinned = "right";
    //   }
    //   return col;
    // });
    if (this.innerWidth <= 1600 && this.innerWidth >= 1200) {
      this.maxSize = 5;
    } else if (this.innerWidth <= 1199 && this.innerWidth >= 768) {
      this.maxSize = 3;
      this.ellipses = false;
    } else if (this.innerWidth < 768) {
      this.maxSize = 2;
      this.ellipses = false;
      // this.columnDefs = this.columnDefs.map((col)=>{
      //   if(col.field == 'actions'){
      //     col.pinned = null;
      //   }
      //   return col;
      // });
    }
    // this.gridApi.setColumnDefs(this.columnDefs)
  }

  updateSelectedColumn(event: any) {
    if (event.target.checked) {
      if (this.tableSelectedColumn.indexOf(this.columnDefsCopy[parseInt(event.target.value)]) < 0) {
        // this.tableSelectedColumn.push(this.columnDefs[parseInt(event.target.value)]);
        this.tableSelectedColumn.splice(parseInt(event.target.value), 0, this.columnDefsCopy[parseInt(event.target.value)]);
      }
    } else {
      if (this.tableSelectedColumn.indexOf(this.columnDefsCopy[parseInt(event.target.value)]) > -1) {
        this.tableSelectedColumn.splice(this.tableSelectedColumn.indexOf(this.columnDefsCopy[parseInt(event.target.value)]), 1);
      }
    }
    this.gridApi.setColumnDefs(this.tableSelectedColumn)
    this.gridApi.setDefaultColDef(this.defaultColDef);
  }

  // Component code
  quickFilterShowAction($event: Event) {
    this.quickFilterShow = !this.quickFilterShow;
    if (!this.quickFilterShow) {
      this.filSearchMerName.handleClearClick();
      this.filSearchMID.handleClearClick();
      this.filResellerPartnerId.handleClearClick();
      this.filStatus.handleClearClick();
      this.searchFromDate = '';
      this.searchToDate = '';
      this.selectedServiceProvider = ''; // Reset selected service provider
      this.refreshGrid();
    }
  }

  serviceProvider() {
    let data = {
      "Type": "5",
      "Value": ""
    };
    this.masterservice.getDropDown(data).subscribe((res: any) => {
      this.serviceProviderData = res;
    });
  }

  onServiceProviderSelect(event: any) {
    this.selectedServiceProvider = event ? event.FieldValue.toString() : ''; // Capture the selected FieldValue and ensure it's a string
  }

  onSearchBtnClick($event: Event) {
    this.submit1 = true;
    if (this.serviceProviderForm.invalid) {
      return;
    }

    if (new Date(this.searchFromDate) > new Date(this.searchToDate)) {
      this.alertService.errorAlert({
        text: "From Date can not be greater than To Date"
      });
      this.rowData = [];
      return;
    }

    const filter: MerchantFilter = {};

    if (this.Status != "") {
      filter.name = this.searchMerName && this.Status ? 
        (this.searchMerName + '|' + this.Status + '|') : 
        (this.Status ? '|' + this.Status + '|' : 
        (this.searchMerName ? this.searchMerName + '|' + '|' : '|' + '|'));
    } else {
      if (this.searchMerName || '') filter.name = this.searchMerName || '';
    }

    if (this.searchMID || '') filter.mid = this.searchMID || '';
    if (this.resellerPartnerId || "") filter.rid = this.resellerPartnerId || '';
    if (this.Status) filter.Status = this.Status || '';
    if (this.searchFromDate) filter.startDate = this.searchFromDate;
    if (this.searchToDate) filter.endDate = this.searchToDate;

    // Add the selected service provider's FieldValue to the filter
    if (this.selectedServiceProvider) {
      filter.sp = this.selectedServiceProvider;
    }

    return this.merchantService.getAllMerchant(this.pageSize, 0, filter)
      .subscribe((data) => {
        this.rowData = data?.data || data?.merchants || data || [],
        this.collectionSize = data?.totalCount || data?.totalrecords || data?.totalRecords || data?.length || 0;

        if (this.rowData.length <= 0) {
          this.alertService.errorAlert({ text: "No data found!" });
          return;
        }
      });
  }
  



  closeModalAdd($event: any) {
    if (!$event.showModal) {
      this.modalAddComponent.close();
      this.refreshGrid();
    }

  }

  refreshGrid() {
    this.gridApi.applyTransaction({ remove: this.rowData });
    return this.merchantService.getAllMerchant(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => (this.rowData = data.data || data.merchants || data, this.collectionSize = data.totalCount || data.totalrecords || data.totalRecords || data.length));
  }

  onGridReady(params: GridReadyEvent<IMerchantData>) {
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

    return this.merchantService.getAllMerchant(this.pageSize, (this.currentPage - 1))
      .subscribe((data) => {
        this.rowData = data.data || data.merchants || data;
        this.collectionSize = data.totalCount || data.totalrecords || data.totalRecords || data.length
        this.totalRecords = data.totalRecords
      });
  }

  onBtnC(e: Event) {
    e.preventDefault();
    // @ts-ignore
    return this.apiHttpService
      .get(
        `${API_URL}/get-merchant`
      )
      // @ts-ignore
      .subscribe((data) => (this.gridApi.applyTransaction({ add: data })));
  }

  onExportCSV() {
    // @ts-ignore
    const random3 = Math.floor(Math.random() * 10000000000 + 1);
    const today = new Date();
    const referenceId = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2) + "_" + (("0" + today.getHours())).slice(-2) + "-" + (("0" + today.getMinutes())).slice(-2) + "-" + (("0" + today.getSeconds())).slice(-2);
    const fileName = 'Merchant_Master' + "_" + referenceId;
    // let params: any = {
    //   skipHeader: false,
    //   skipFooters: true,
    //   allColumns: true,
    //   onlySelected: false,
    //   suppressQuotes: true,
    //   fileName: fileName+'.csv',
    //   columnSeparator: ','
    // };
    // params['columns'] = {}
    // this.tableSelectedColumn.forEach((col)=>{
    //   if(col?.field) params['columns'][col?.field] = col?.headerName
    // })

    // this.gridApi.exportDataAsCsv(params)

    const filter: MerchantFilter = {}
    if (this.Status != "") {
      // filter.name = this.searchMerName?this.searchMerName:''+this.Status?this.Status:'';
      filter.name = this.searchMerName && this.Status ? (this.searchMerName + '|' + this.Status + '|') : (this.Status ? '|' + this.Status + '|' : (this.searchMerName ? this.searchMerName + '|' + '|' : '|' + '|'));


    }

    else {
      if (this.searchMerName || '') filter.name = this.searchMerName || '';
    }

    //   // if (this.Status != "") {
    // // } else {
    // //   if (this.searchMerName || '') filter.name = this.searchMerName || '';
    // // }
    // // if (this.searchMerName) filter.name = this.searchMerName ?  this.searchMerName : "";
    // filter.name = this.searchMerName&&this.Status ? (this.searchMerName+ '|'+this.Status) : (this.Status ?'|'+this.Status :(this.searchMerName?this.searchMerName+'|':'|')) ;
    if (this.searchMID || '') filter.mid = this.searchMID || '';
    if (this.resellerPartnerId || "") filter.rid = this.resellerPartnerId || '';
    if (this.Status) filter.Status = this.Status || '';
    if (this.searchFromDate) filter.startDate = this.searchFromDate;
    if (this.searchToDate) filter.endDate = this.searchToDate;
    return this.merchantService.getAllMerchant(this.totalRecords + 3, 0, filter)
      .subscribe((data) => {
        const expData: any[] = [];
        (data?.data || data?.merchants || data || []).forEach((curr: any) => {
          const tempRec: any = {}
          // this.tableSelectedColumn.forEach((col) => {
          //   if (col?.field) tempRec[col?.field] = curr[col?.field]
          // })
          this.tableSelectedColumn.forEach((col) => {
            if (!(col?.field == "actions")) {
              if (col?.field) tempRec[col?.field] = curr[col?.field]

            }
          })
          expData.push(tempRec);
        })

        // this.JSONToCSVConvertor(data?.data || data?.merchants || data || [],fileName, "Report");
        this.exportAsExcelFile(expData, fileName);
      })




  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const tempRec: any = []
    var index = 0;
    this.tableSelectedColumn.forEach((col) => {
      if (!(col?.field == "actions")) {
        tempRec[index] = col
        index++;
      }
    })
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], {
      // @ts-ignore
      header: [...tempRec.map((col: any) => col.headerName)]
    });
    // const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [[...tempRec.map((col: any) => col.headerName)]]);
    XLSX.utils.sheet_add_json(worksheet, json, { origin: 'A2', skipHeader: true });
    XLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  searchQuickFilter($event?: NgbTypeaheadSelectItemEvent) {
    this.gridApi.setQuickFilter($event?.item);
  }

  onGlobalSearchChange($event: any) {
    if ($event == '' || $event == null) {
      this.gridApi.setQuickFilter($event);
    }
  }

  async onAddNew($event: any) {
    // this.sidebarComponent.sidebarToggler.nativeElement.click();
    await this.sideNavService.toggelEvent$.emit($event)
    // await this.sideNavService.toggle($event);
    await this.router.navigate(['/merchants/merchant-creation'])
    // return await this.modalAddComponent.open();
  }

  async MerchantNew() {
    return await this.modalMerchantComponent.open();
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    const filter: MerchantFilter = {}
    if (this.Status != "") {
      // filter.name = this.searchMerName?this.searchMerName:''+this.Status?this.Status:'';
      filter.name = this.searchMerName && this.Status ? (this.searchMerName + '|' + this.Status + '|') : (this.Status ? '|' + this.Status + '|' : (this.searchMerName ? this.searchMerName + '|' + '|' : '|' + '|'));


    }

    else {
      if (this.searchMerName || '') filter.name = this.searchMerName || '';
    }

    //   // if (this.Status != "") {
    // // } else {
    // //   if (this.searchMerName || '') filter.name = this.searchMerName || '';
    // // }
    // // if (this.searchMerName) filter.name = this.searchMerName ?  this.searchMerName : "";
    // filter.name = this.searchMerName&&this.Status ? (this.searchMerName+ '|'+this.Status) : (this.Status ?'|'+this.Status :(this.searchMerName?this.searchMerName+'|':'|')) ;
    if (this.searchMID || '') filter.mid = this.searchMID || '';
    if (this.resellerPartnerId || "") filter.rid = this.resellerPartnerId || '';
    if (this.Status) filter.Status = this.Status || '';
    if (this.searchFromDate) filter.startDate = this.searchFromDate;
    if (this.searchToDate) filter.endDate = this.searchToDate;
    this.merchantService.getAllMerchant(this.pageSize, (param - 1), filter)
      .subscribe((data) => {
        this.rowData = data.data || data.merchants || data;
        this.collectionSize = data.totalCount || data.totalRecords || data.length;
        this.gridApi.applyTransaction({ add: this.rowData });
      }
      );
  }

  onRowClicked(param: RowClickedEvent | any) {
    console.log("Row Clicked", param);
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }


  async onRowDoubleClicked(param: RowClickedEvent | any) {
    if (this.permissions.includes('Edit')) {
      // this.isEdit.emit(true);
      return await this.router.navigate(['/merchants/merchant-creation'], {
        queryParams: {
          mid: param?.data?.merchantId,
          action: 'edit'
        }
      })
    }
    return false
  }

  onFilterChange(param: FilterChangedEvent | any) {
    //     console.log("onFilterChange----->",param);
    //     console.log("this.filterObj----->",this.filterObj?.age?.appliedModel);
    //     // this.rowData.length = 0
    //     this.gridApi.applyTransaction({remove: this.rowData})
    //     this.gridApi.showLoadingOverlay();
    // var body = {
    //   "name":"",
    //   "mid" : "",
    //   "startDate": "",
    //   "endDate": ""
    // }
    //     const self= this;
    //     // setTimeout(()=>{
    //     this.merchantService.getAllMerchant(this.pageSize, (this.currentPage-1))
    //       // @ts-ignore
    //       .subscribe((data) => ( console.log("****onFilterChange"),self.gridApi.applyTransaction({add:data.filter((dt)=>{
    //           if(dt.age == self.filterObj?.age?.appliedModel.filter)
    //             return dt;
    //         })
    //       })));
    //     // }, 1000)
    //

  }

  onFilterModified(param: FilterModifiedEvent | any) {
    // console.log("onFilterModified----->",param);
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {
    console.log("onFilterOpened----->", param);
  }

  onPageSizeChanges($event: Event) {
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    const filter: MerchantFilter = {}
    if (this.Status != "") {
      // filter.name = this.searchMerName?this.searchMerName:''+this.Status?this.Status:'';
      filter.name = this.searchMerName && this.Status ? (this.searchMerName + '|' + this.Status + '|') : (this.Status ? '|' + this.Status + '|' : (this.searchMerName ? this.searchMerName + '|' + '|' : '|' + '|'));


    }

    else {
      if (this.searchMerName || '') filter.name = this.searchMerName || '';
    }

    //   // if (this.Status != "") {
    // // } else {
    // //   if (this.searchMerName || '') filter.name = this.searchMerName || '';
    // // }
    // // if (this.searchMerName) filter.name = this.searchMerName ?  this.searchMerName : "";
    // filter.name = this.searchMerName&&this.Status ? (this.searchMerName+ '|'+this.Status) : (this.Status ?'|'+this.Status :(this.searchMerName?this.searchMerName+'|':'|')) ;
    if (this.searchMID || '') filter.mid = this.searchMID || '';
    if (this.resellerPartnerId || "") filter.rid = this.resellerPartnerId || '';
    if (this.Status) filter.Status = this.Status || '';
    if (this.searchFromDate) filter.startDate = this.searchFromDate;
    if (this.searchToDate) filter.endDate = this.searchToDate;
    this.merchantService.getAllMerchant(this.pageSize, (this.currentPage - 1), filter)
      .subscribe((data) => (this.rowData = data.data || data.merchants || data, this.collectionSize = data.totalCount || data.totalRecords, this.gridApi.applyTransaction({ add: this.rowData })));

  }

  MerchnatList() {
    let reqData = {
      "name": ""
    }
    console.log("request body", reqData)
    this.merchantService.getMerchantBYName(reqData).subscribe((res: any) => {
      this.Resultdata = res
      console.log("merchant mid", res)
    });
  }


  closeModalBlocked($event: any) {
    if (!$event.showModal) {
      this.modalblockedComponent.close();
      this.refreshGrid();
    }
  }

  merchantStatusDropdown() {
    return this.merchantService.getMerchantStatus()
      // .post(
      //   `${API_URL}/GetDropdown`, postdata
      // )
      .subscribe((res) => (this.merchantStatusdata = res, console.log("res", this.merchantStatusdata)));

  }

  OnlyCharacterAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  allowAlfanumeric($event: Event): void {
    if (this.searchMID.length > 10) {
      return
    }

    this.searchMerName = this.searchMerName.replace(/[^a-z 0-9]/gi, '') || '';
    this.searchMID = this.searchMID.replace(/[^a-z 0-9]/gi, '') || '';
  }
  fun(id: any) {
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id: any) {
    document?.getElementById(id)?.classList.remove("hey")
  }
}
