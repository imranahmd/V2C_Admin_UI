import { Component, OnInit, Output } from '@angular/core';
import { AfterViewInit, EventEmitter, Input, TemplateRef, ViewChild } from '@angular/core';
import {
  ColDef,
  FilterModifiedEvent,
  FilterOpenedEvent,
  GridApi,
  ICellRendererComp,
  ICellRendererParams,
  PaginationChangedEvent,
  RowClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';
import { debounceTime, distinctUntilChanged, map, Observable } from "rxjs";
// import { CellCustomComponent } from './cell-custom/cell-custom.component';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConfirmPasswordValidator } from "../merchants.validator";
import { environment } from "../../../../../environments/environment";
import { ApiHttpService } from "../../../../_services/api-http.service";
import { DatePipe, Location } from "@angular/common";
import { MenusService } from "../../../../_services/menu.service";
import { AlertService } from "../../../../_services/alert.service";
import { RefundManagementService } from "./../../refund-management/refund-management.service";
import { ProvidersService } from 'src/app/_services/providers.service';
import { ReusablecycleComponent } from '../reusablecycle/reusablecycle.component';
const { API_URL } = environment;

export interface IMerchantData {
  "id": number,
  "merchantId": string,
  "merchanTransactionId": string,
  "searchFromDate": string,
  "ifscCode": string,
  "bankName": string,
  "rodate": string,
  "emailId": string,
  "mobileNo": string,
  "account_holder": string
}

@Component({
  selector: 'app-transaction-life-cycle',
  templateUrl: './transaction-life-cycle.component.html',
  styleUrls: ['./transaction-life-cycle.component.scss']
})
export class TransactionLifeCycleComponent implements OnInit {
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() BulkmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() CyclemerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();

  public searchFromDate: string = '';
  public searchToDate: string = '';
  @ViewChild('authorList', { static: true }) authorList: TemplateRef<any>;
  @ViewChild('amountEle', { static: true }) amountEle: TemplateRef<any>;
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;
  @ViewChild('modalbulk') private modalbulkComponent: ModalComponent;
  @ViewChild('modalcycle') private modalCycleComponent: ModalComponent;
  public transactionListFormGroup: FormGroup;
  formcontrols: any;
  @Input() merchantId: string;
  @Input() onMerchantChange: EventEmitter<any> = new EventEmitter<any>();
  selectedmerchant: number;
  transactionListFilter: FormGroup;
  transactionBulkFilter: FormGroup;
  isForm1Submitted: Boolean;
  currentURL: Boolean = false
  modalConfigDelete: ModalConfig;

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  public rowData!: any[];
  tablecolumn: any;
  currentPage: number = 1;
  pageSize: number = 10000000;
  globalSearch: string = '';
  collectionSize: number = 0;
  SingleRow: any;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  tableInfo: any;
  Resdata: any;
  Resdatas: any;
  isDisable: boolean = false;
  isverify: string = 'N';
  isValid: string = 'N';
  isChecked: boolean = true;
  newDate: any = new Date()
  selectedAttributes: any
  arr: any = {}
  public IFSCValue: string = '';
  randomdata: { merchantid: string; };
  public columnDefs: ColDef[] = []
  public tableSelectedColumn: ColDef[] = [...this.columnDefs];
  public permissions: any;
  Requestbody: any;
  Ress: any;
  errorMessage: any;
  formData: any;
  IFSCvalue: any;
  validIFSC: any;
  currDate: any = new Date();
  validationIFSC: boolean;
  IFSCcheck: boolean;
  ValidAccount: boolean = true;
  errorOccured: boolean = false;
  IFSCData: any;
  param: IMerchantData;
  highlight: boolean;
  refundData: any = false;
  modalConfigBlocked: ModalConfig;
  modalConfigBulk: ModalConfig;
  modalConfigCycle: ModalConfig;
  refundRaiseLog: any = {};
  @ViewChild('modalDelete') private modalDeleteComponent: ModalComponent
  private gridApi!: GridApi;
  private filterObj: any = {};
  private merchantValue: null;
  private merchantresponse: any;
  private queryParams: any = {};
  serviceproviderdata: any;
  transactionStatus: any;
  transactionID: any = '';
  array: any[] = [];
  file: any;
  fileName: any;
  fileExtension: any;
  fileExtensionError: boolean;
  fileResponse: any;
  transactionListSubmit: FormGroup;
  transactionUserStatus: any;
  loading: boolean;
  loading1: boolean
  isForm2Submitted: boolean;
  isForm3Submitted: boolean;
  lifecycle: boolean = true;
  bulkfile: boolean = false;
  fileData: any;
 
  constructor(
    private alertService: AlertService,
    private datePipe: DatePipe,
    private providerService: ProvidersService,
    private merchantService: RefundManagementService,
    private menuService: MenusService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private apiHttpService: ApiHttpService,
    fb: FormBuilder) {
    var URL = this.router.url
    this.refundData = false
    if (URL.indexOf("merchant-master") > 0) {
      this.currentURL = true
    } else {
      this.currentURL = false

    }

    this.MerchnatList()
    // Validators.required
    this.transactionListFilter = fb.group({
      // merchantId: [this.merchantId || "",],
      merchantId: [],
      sId: [,],
      searchFromDate: ["", [Validators.required]],
      searchToDate: ["", [Validators.required]],
      lifecyclestatus: [, [Validators.required]],
      transactionId: ["", []],
      RRN: ["", []],
      // custMobile: ["", []],
    }
    );
    this.transactionBulkFilter = fb.group({
      // merchantId: [this.merchantId || "",],
      searchType: [, [Validators.required]],
      // Value: [,],
      // TransactionRRN: ["", [Validators.required]],
      file: ["", [Validators.required]]
    }
    );

    this.transactionListSubmit = fb.group({
      // merchantId: [this.merchantId || "",],
      lifecyclestatuss: [, [Validators.required]],
      file: [,],
      Remark: ["", []],

    }
    );


  }

  get transactionListSubmitForm() {
    return this.transactionListSubmit as FormGroup;
  }
  get refundListFilter() {
    return this.transactionListFilter as FormGroup;
  }
  get refundBulkFilter() {
    return this.transactionBulkFilter as FormGroup;
  }

  get transactionListForm() {
    return this.transactionListFormGroup?.get('allTransactions') as FormArray
  }
  get refundListFilterNew() {
    return this.transactionListSubmitForm as FormGroup;
  }


  ngAfterViewInit(): void {

  }

  loadData() {debugger

    let data: any = [];
    let value:any = this.rowData
if(value.Status!="Data does not exist"){
    this.rowData?.forEach((item) => {
      data.push(
        new FormGroup({
          MerchantId: new FormControl(item?.MerchantId),
          Transaction_Id: new FormControl(item?.Transaction_Id),
          TransactionAmount: new FormControl(item?.TransactionAmount || 0),
          // Amount: new FormControl(),
          Select: new FormControl(false),
        })
      );
    });
}
  
    return data;
  }

  loadBooks(bookList: any) {

    let data: any = [];
    bookList.forEach((book: any) => {
      data.push(
        new FormGroup({
          bookName: new FormControl(''),
          bookPrice: new FormControl(book.price),
        })
      );
    });
    return data;
  }

  loadAuthors(authors: any) {

    let data: any = [];
    authors.forEach((author: any) => {
      data.push(
        new FormGroup({
          authorName: new FormControl(''),
          isSelected: new FormControl(author.isSelected),
          bookList: new FormArray(this.loadBooks(author.books)),
        })
      );
    });

    return data;
  }

  toggleRadio(bookTypeIndex: any, authorIndex?: any) {
    //
    const currentControl = (this.transactionListFilter?.get('allTransactions') as FormArray).controls[bookTypeIndex];

    console.log("--------->", currentControl);
    // currentControl.get('Amount')?.disable();
    const TransactionAmount = currentControl.get('TransactionAmount')?.value;
    if (currentControl.get('Select')?.value) {
      this.refundRaiseLog[bookTypeIndex] = true
      currentControl.get('Amount')?.enable();
      currentControl.get('Amount')?.setValidators([Validators.required, Validators.min(1), Validators.max(TransactionAmount), Validators.maxLength(TransactionAmount.length)]);
    } else {
      delete this.refundRaiseLog[bookTypeIndex]
      currentControl.get('Amount')?.setValue(null);
      currentControl.get('Amount')?.disable();
      currentControl.get('Amount')?.setValidators([]);
    }
    currentControl.get('Amount')?.updateValueAndValidity();
  }

  canShow(bookTypeIndex: any, bookDetail: any) {
    let canShow = false;
    let selectedAuthor: any = {};
    this.formcontrols = this.transactionListFilter?.get('allTransactions');
    let allBookDetails = this.formcontrols?.controls; //both book types
    allBookDetails.forEach((formGroup: any, formGroupIndex: any) => {
      if (formGroupIndex === bookTypeIndex) {
        selectedAuthor = formGroup
          .get('authorsList')
          .value.find((item: any) => item.isSelected);
      }
    });
    if (selectedAuthor) {
      //checking if 2 arrays are equal or not
      canShow =
        Array.isArray(selectedAuthor.bookList) &&
        Array.isArray(bookDetail.value) &&
        selectedAuthor.bookList.length === bookDetail.value.length &&
        selectedAuthor.bookList.every(
          (val: any, index: any) => val === bookDetail.value[index]
        );
    }
    return canShow;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.transactionListFilter.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  ngOnInit(): void {
    this.ServiceProvide();
    this.transactionStatusList()
    this.transactionUserStatusList()
    // books.books.forEach((data) => {
    //   data.authors.forEach((author: any) => {
    //     author.isSelected = false;
    //   });
    // });

    // this.rowData = books.books
    console.log(this.rowData)

    const path = this.location.prepareExternalUrl(this.location.path());
    this.permissions = this.menuService.getPermissions(path);

    // if (this.merchantId) {
    //   this.isDisable = !this.isDisable;
    // }
    this.route.queryParams
      .subscribe(params => {
        this.queryParams = params;
        this.merchantId = params?.mid || null;
        this.isDisable = true;
        // this.refundListFilterGroup.get('merchantId')?.setValue(this.merchantId);
        // this.refundListFilterGroup.get('merchantId')?.disable();
        this.onMerchantChange.emit(this.merchantId);
      }
      );

    this.isForm1Submitted = false;
    this.isForm2Submitted = false;
    // @ts-ignore
    // this.onMerchantChange.subscribe((data) => {
    //   this.merchantId = data;
    //   <FormControl><unknown>this.refundListFilterGroup.get('merchantId')?.patchValue(data);
    //   this.refreshGrid(this.merchantId);
    // })

    // if (!(this.permissions.includes('Add New') || this.permissions.includes('Edit'))) {
    //   this.refundListFilterGroup.disable()
    // }


    // this.rowData = books.books;


    this.columnDefs = [
      {
        headerName: 'Select',
        // cellRendererFramework: ReusablecycleComponent,
        // cellRendererParams: {
        //   ngTemplate: this.authorList,
        // },
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,
        // checkboxSelection: (
        //   params:any
        // ) => {
        //   return false;
        // },
      },
      { field: 'merchant_id', tooltipField: 'Merchant ID', headerName: 'Merchant ID', filter: true },
      { field: 'merchant_name', tooltipField: 'Merchant Name', headerName: 'Merchant Name', filter: true },
      { field: 'TransactionId', tooltipField: 'Transaction ID', headerName: 'Transaction ID', filter: true },
      { field: 'TxnDate', tooltipField: 'Transaction Date', headerName: 'Transaction Date', filter: true },
      { field: 'RRNNo', tooltipField: 'RRN', headerName: 'RRN', filter: true },
      { field: 'LifeCycleStatus', tooltipField: 'Life Cycle Status', headerName: 'Life Cycle Status', filter: true },

    ];

    this.modalConfigBlocked = {
      modalTitle: "Audit Trail " + this.transactionID,
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
    this.modalConfigBulk = {
      modalTitle: "Bulk Upload",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
    this.modalConfigCycle = {
      modalTitle: "Life Cycle Status Summary",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
  }

  // DeleteAccount(ID: any) {
  //   let data = {
  //     "Pid": ID.id || ID
  //   }

  //   return this.apiHttpService
  //     .post(
  //       `${API_URL}/delete-merchantbank-byid`, data
  //     );

  // }

  onRowSelected(event: RowSelectedEvent) {
    // this.array = []
    // this.array.push(event.node.data)
    // window.alert(
    //   'row ' +
    //     event.node.data +
    //     ' selected = ' +
    //     event.node.isSelected()
    // );
  }

  onSelectionChanged(event: SelectionChangedEvent) {
    // this.array.pop(event.node.data)
    // var rowCount = event.api.getSelectedNodes().length;
    // this.gridApi
    this.array = event.api.getSelectedRows();
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? []
        : this.rowData.filter(v => (v.merchantId.toLowerCase().indexOf(term.toLowerCase()) > -1))?.map(v => v.merchantId).slice(0, 10))
    );

  async closeModelAction($event: Event) {
    await this.modalDeleteComponent.dismiss();
    // this.refreshGrid(this.merchantId);
  }

  refreshGrid(formvalue: any) {

    let data = {
      "merchantId": formvalue.merchantId || '',
      "fromDate": formvalue.searchFromDate || '',
      "toDate": formvalue.searchToDate || '',
      "spId": formvalue.sId || '',
      "transactionId": formvalue.transactionId || '',
      "lifeCycleCode": formvalue.lifecyclestatus || '',
      "rrnNumber": formvalue.RRN || ''

    }

    this.apiHttpService
      .post(
        `${API_URL}/getTransaction-LifeCycleDetails?pageSize=${this.pageSize}&page=${(this.currentPage - 1)}`, data
      )
      .subscribe((data: any) => {
        this.rowData = data?.Data || data;
        this.collectionSize = this.rowData.length||data?.totalCount || data?.length;
        this.transactionListFormGroup = new FormGroup({
          allTransactions: new FormArray(this.loadData()),
        });
        this.formcontrols = this.transactionListFormGroup?.get('allTransactions');

        (this.transactionListFormGroup.get('allTransactions') as FormArray).controls.forEach((con: any) => {
          con.get('Amount')?.disable();
        })

      })
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

  loadDatabyMid() {
    //this.refundListFilterGroup.controls['merchantId'].setValue(mid)
    // this.refreshGrid(this.merchantId);
  }

  onGridReady(params: any) {
    debugger
    this.gridApi = params.api;

    let data = {
      "merchantId": "M00005353",
      "fromDate": "2022-01-01",
      "toDate": "2023-03-13",
      "spId": "",
      "lifeCycleCode": "",
      "transactionId": "",
      "rrnNumber": "RES"
    }

    this.apiHttpService
      .post(
        `${API_URL}/getTransaction-LifeCycleDetails?pageSize=${this.pageSize}&page=${(this.currentPage - 1)}`, data
      )
      .subscribe((data: any) => {

        this.rowData = data?.Data || data;
        // this.rowData.push(books.books);
        // console.log(this.rowData)
        this.collectionSize = data?.totalCount || data?.length;
        this.transactionListFormGroup = new FormGroup({
          allTransactions: new FormArray(this.loadData()),
        });
        console.log("Hello")

        console.log(this.loadData())
        this.formcontrols = this.transactionListFormGroup?.get('allTransactions');
        console.log("=------===>", this.transactionListFormGroup.get('allTransactions'));

        (this.transactionListFilter.get('allTransactions') as FormArray)?.controls.forEach((con: any) => {
          con?.get('Amount')?.disable();
        })

      })

  }

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  reformatString(elements: any) {
    return (elements.replace(/\_/g, " ").charAt(0).toUpperCase() + elements.replace(/\_/g, " ").slice(1)).replace(/([A-Z]+)/g, ' $1').replace(/^ /, '')
  }

  onExportCSV() {
    // @ts-ignore
    var random3 = Math.floor(Math.random() * 10000000000 + 1);
    var today = new Date();
    var referenceId = today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2) + "_" + (("0" + today.getHours())).slice(-2) + "-" + (("0" + today.getMinutes())).slice(-2) + "-" + (("0" + today.getSeconds())).slice(-2)
    var fileName = '1Pay_' + referenceId
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

  onPaginationChange(param: PaginationChangedEvent | any) {

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

  onSubmit(formvalue: any) {debugger

   
    document?.getElementById('lifecyclestatus')?.classList.remove("hello")
  
  
    this.columnDefs.forEach(element => {
      if (element.field == "Status") {
        this.columnDefs.pop()
        this.tableSelectedColumn = this.columnDefs,
          this.gridApi.setColumnDefs(this.columnDefs)
      }
    });
    setTimeout(() => {
      if (this.transactionListFilter.valid) {
        if ((2000 > new Date(this.transactionListFilter.controls["searchFromDate"].value).getFullYear() || new Date(this.transactionListFilter.controls["searchFromDate"].value) > this.currDate) || (2000 > new Date(this.transactionListFilter.controls["searchToDate"].value).getFullYear() || new Date(this.transactionListFilter.controls["searchToDate"].value) > this.currDate)) {
          this.alertService.errorAlert({
            text: "Date out of Range!"
          })



          // this.DynamicValues = false
          return
        }
        if (new Date(this.searchFromDate) > new Date(this.searchToDate)) {
          this.alertService.errorAlert({
            text: "From Date can not be greater the To Date!"
          })
          this.rowData = []
          return
        }
        //  this.merchantId = this.merchantId || formvalue.merchantId
        this.merchantId = formvalue.merchantId
        this.loading1 = true
        document?.getElementById('loading1')?.classList.add("spinner-border")
        document?.getElementById('loading1')?.classList.add("spinner-border-sm")
        var merchantdata = {
          "merchantId": formvalue.merchantId || '',
          "fromDate": formvalue.searchFromDate || '',
          "toDate": formvalue.searchToDate || '',
          "spId": formvalue.sId || '',
          "transactionId": formvalue.transactionId || '',
          "lifeCycleCode": formvalue.lifecyclestatus || '',
          "rrnNumber": formvalue.RRN || ''
        }
        // if (this.transactionListFilter .valid) {
        //   if ((2000 > new Date(this.transactionListFilter .controls["searchFromDate"].value).getFullYear() || new Date(this.transactionListFilter .controls["searchFromDate"].value) > this.currDate) || (2000 > new Date(this.transactionListFilter .controls["searchToDate"].value).getFullYear() || new Date(this.transactionListFilter .controls["searchToDate"].value) > this.currDate)) {
        //     this.alertService.errorAlert({
        //       text: "Date out of Range!"
        //     })
    
    
    
           
        //      return
        //   }
           
        this.apiHttpService
          .post(
            `${API_URL}/getTransaction-LifeCycleDetails?pageSize=` + this.pageSize + '&page=' + (this.currentPage - 1), merchantdata
          )
          .subscribe((data: any) => {
            this.loading1 = false
            document?.getElementById('loading1')?.classList.remove("spinner-border")
            document?.getElementById('loading1')?.classList.remove("spinner-border-sm")
            if (data.Status) {
              this.alertService.errorAlert({
                html: data.Status
              })
             
              this.refundData = false
              this.isForm1Submitted = false
              // this.rowData = []
              return
            }

            this.rowData = data?.Data

            this.refundData = this.rowData
            this.collectionSize = this.rowData.length||data?.totalCount || data?.length
            data[0]?.status == 'false' ? console.log(JSON.parse(data[0]?.error).Error) : this.transactionListFilter.reset();

            this.transactionListFilter.get('merchantId')?.setValue(this.merchantId);
            this.ValidAccount = true;
            (this.isForm1Submitted = false)

            this.rowData = data?.Data || data;
            this.collectionSize =this.rowData.length|| data?.totalCount || data?.length;
            this.transactionListFormGroup = new FormGroup({
              allTransactions: new FormArray(this.loadData()),
            });
            this.formcontrols = this.transactionListFormGroup?.get('allTransactions');

            (this.transactionListFormGroup.get('allTransactions') as FormArray).controls.forEach((con: any) => {
              con.get('Amount')?.disable();
            })
          });
        // }
      }
      else{
        if(this.transactionListFilter.controls['lifecyclestatus'].invalid||this.transactionListFilter.controls['lifecyclestatus'].invalid){
          document?.getElementById('lifecyclestatus')?.classList.add("hello")
        }else{
          document?.getElementById('lifecyclestatus')?.classList.remove("hello")
        }
      }
      // this.reset();
      this.isForm1Submitted = true;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      this.highlight = false;
      // this.accPan.nativeElement.focus();
      document?.getElementById(this.findInvalidControls()[0])?.focus();
      // console.log("hhhhhh" + this.findInvalidControls()[0].toString())
      // document.getElementsByClassName('ng-invalid')?.focus();
      setTimeout(() => {
        this.highlight = true;

      }, 1000);
    }, 0);
    
  
}


  onBulkSearch(formvalue: any) {
    debugger
    //
    // if (this.refundListFilterGroup.controls['retypesearchFromDate'].invalid) {
    //   alert("Account number should match with retype account!")
    // }
    setTimeout(() => {
      if (this.transactionBulkFilter.valid) {

        var BulkformData = new FormData();
        //  this.merchantId = this.merchantId || formvalue.merchantId
        this.merchantId = formvalue.merchantId
        this.loading = true
        document?.getElementById('loading')?.classList.add("spinner-border")
        document?.getElementById('loading')?.classList.add("spinner-border-sm")
        BulkformData.append('Type', formvalue.searchType);
        BulkformData.append('file', this.fileData);

        this.apiHttpService
          .post(
            `${API_URL}/BulkLifeSearchCycleDetails?pageSize=` + this.pageSize + '&page=' + (this.currentPage - 1), BulkformData

          )
          .subscribe((data: any) => {
            this.loading = false
            document?.getElementById('loading')?.classList.remove("spinner-border")
            document?.getElementById('loading')?.classList.remove("spinner-border-sm")
            if (data.Status) {
              this.alertService.errorAlert({
                html: data.Status
              })
              return
            }
            // { field: 'merchant_id', tooltipField: 'Merchant ID', headerName: 'Merchant ID', filter: true },
            var count = 0
            this.columnDefs.forEach(element => {
              if (element.field == "Status") {
                // this.columnDefs.pop()
                count++;
                this.tableSelectedColumn = this.columnDefs,
                  this.gridApi.setColumnDefs(this.columnDefs)
              }
            });
            if (count < 1) {
              this.columnDefs.push(
                // {field: "Status",headerValueGetter: (params) => this.reformatString(elements), filter: 'agNumberColumnFilter'}
                { field: 'Status', tooltipField: 'Status', headerName: 'Status', filter: true }
              )
              this.tableSelectedColumn = this.columnDefs,
              this.gridApi.setColumnDefs(this.columnDefs)
            }



            // this.gridApi.setRowData(data)


            this.rowData = data?.Data

            this.refundData = this.rowData
            this.collectionSize = this.rowData.length||data?.totalCount || data?.length
            // data[0] ? console.log(JSON.parse(data)) : this.resetBulkform();

            // this.transactionListFilter.get('merchantId')?.setValue(this.merchantId);
            this.ValidAccount = true;
            (this.isForm3Submitted = false)

            this.rowData = data?.Data || data;
            this.collectionSize = this.rowData.length||data?.totalCount || data?.length;
            // this.transactionListFormGroup = new FormGroup({
            //   allTransactions: new FormArray(this.loadData()),
            // });
            // this.formcontrols = this.transactionListFormGroup?.get('allTransactions');

            // (this.transactionListFormGroup.get('allTransactions') as FormArray).controls.forEach((con: any) => {
            //   con.get('Amount')?.disable();
            // })
          });

      }
      // this.reset();
      this.isForm3Submitted = true;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      this.highlight = false;
      // this.accPan.nativeElement.focus();
      document?.getElementById(this.findInvalidControls()[0])?.focus();
      // console.log("hhhhhh" + this.findInvalidControls()[0].toString())
      // document.getElementsByClassName('ng-invalid')?.focus();
      setTimeout(() => {
        this.highlight = true;

      }, 1000);
    }, 0);

  }
  // reset() {
  //   this.transactionListFilter.reset(); // Reset form data
  //   this.showHide=false
  // }
  bulkUpload() {
    this.BulkmerchantSelectEvent.emit(this.transactionID);
    return this.modalbulkComponent.open();
  }
  async onRowDoubleClicked(param: RowClickedEvent | any) {
    debugger
    this.transactionID = param.data.TransactionId
    this.BlockedmerchantSelectEvent.emit(this.transactionID);
    return await this.modalblockedComponent.open();
  }

  closeModalBlocked($event: any) {
    if (!$event.showModal) {
      this.modalblockedComponent.close();
      // this.refreshGrid();
    }
  }
  //get merchant By Name
  MerchnatList() {
    const merchantdata = {
      "name": ""
    };
    this.apiHttpService
      .post(
        `${API_URL}/GetMerchant/`, merchantdata
      )
      .subscribe((res: any) => (this.Resdata = res));
  }

  transactionStatusList() {
    debugger
    let serviceprovidedata = {
      "Type": "25",
      "Value": ""
    }
    this.apiHttpService
      .post(`${API_URL}/GetDropdown`, serviceprovidedata)
      .subscribe((res) => {
        this.transactionStatus = res
      });
  }

  transactionUserStatusList() {
    debugger
    let serviceprovidedata = {
      "Type": "25",
      "Value": "UserInput"
    }
    this.apiHttpService
      .post(`${API_URL}/GetDropdown`, serviceprovidedata)
      .subscribe((res) => {
        this.transactionUserStatus = res
      });
  }
  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  cycle() {
    debugger
    // this.lifecycle = true
    // this.bulkfile = false
    document.getElementById("home")?.classList.add("show")
    document.getElementById("profile")?.classList.remove("show")
    document.getElementById("home")?.classList.add("active")
    document.getElementById("profile")?.classList.remove("active")

    document.getElementById("home-line-tab")?.classList.add("active")
    document.getElementById("profile-line-tab")?.classList.remove("active")
    this.refundData = false
    this.resetform()
    this.resetBulkform()
    this.array =[]
  }
  bulk() {
    debugger
    // this.bulkfile = true
    // this.lifecycle = false
    document.getElementById("profile")?.classList.add("show")
    document.getElementById("home")?.classList.remove("show")
    document.getElementById("profile")?.classList.add("active")
    document.getElementById("home")?.classList.remove("active")

    document.getElementById("profile-line-tab")?.classList.add("active")
    document.getElementById("home-line-tab")?.classList.remove("active")
    this.refundData = false
    this.resetform()
    this.resetBulkform()
    this.array =[]
  }
  onFileSelect(event: any) {
    debugger

    // type = type || 'single'
    // if (event.target.files[0].size < 1048576) {
    if (event.target.files.length > 0) {




      var allowedExtensions = ["xlsx", "XLSX", "CSV", "csv"];
      var file = event.target.files[0];
      this.file = file
      this.fileName = file.name;
      this.fileExtension = this.fileName.split('.').pop();

      // if (this.isInArray(allowedExtensions, this.fileExtension)) {
      //   this.fileExtensionError = false;

      // } 
      // else {
      //   // alert("Only " + "Image, Document, Excel and PDF" + " files are allowed");
      //   this.alertService.errorAlert({
      //     html: "Only " + "XLSX " + " files are allowed"
      //   })
      //   this.fileExtensionError = true;
      //   return
      // }

      // this.fileExtension
      this.fileExtensionError = false;
      if (this.fileExtensionError == false) {
        if (file) {
          const formData = new FormData();
          var AddedBy: any = localStorage.getItem("user")
          formData.append('uploadFile', file);
          formData.append('addedBy', AddedBy);
          this.apiHttpService
            .post(
              `${API_URL}/upload-StatusFile/`, formData
            )
            .subscribe((data: any) => {

              this.fileResponse = data;
              // this.transactionListSubmitForm.controls['file'].setValue(this.fileResponse?.Data?.DocPath)




            })

        } else {
          this.alertService.errorAlert({
            html: "Failed to load file"
          })
        }
      }
    }


  }

  onBulkFileSelect(event: any) {
    debugger

    // type = type || 'single'
    // if (event.target.files[0].size < 1048576) {
    if (event.target.files.length > 0) {
      var allowedExtensions = ["xlsx", "XLSX", "CSV", "csv"];
      var file = event.target.files[0];
      this.file = file
      this.fileName = file.name;
      this.fileExtension = this.fileName.split('.').pop();

      // if (this.isInArray(allowedExtensions, this.fileExtension)) {
      //   this.fileExtensionError = false;

      // } 
      // else {
      //   // alert("Only " + "Image, Document, Excel and PDF" + " files are allowed");
      //   this.alertService.errorAlert({
      //     html: "Only " + "XLSX " + " files are allowed"
      //   })
      //   this.fileExtensionError = true;
      //   return
      // }

      // this.fileExtension
      this.fileExtensionError = false;
      if (this.fileExtensionError == false) {
        if (file) {
          var AddedBy: any = localStorage.getItem("user")
          // this.transactionBulkFilter.controls['file'].setValue(file)
          this.fileData = file
          // formData.append('addedBy', AddedBy);
          // this.apiHttpService
          //   .post(
          //     `${API_URL}/upload-StatusFile/`, formData
          //   )
          //   .subscribe((data: any) => {

          //     this.fileResponse = data;
          //     // this.transactionListSubmitForm.controls['file'].setValue(this.fileResponse?.Data?.DocPath)




          //   })

        } else {
          this.alertService.errorAlert({
            html: "Failed to load file"
          })
        }
      }
    }


  }
  updateTransaction(formData: any) {

    debugger
    if (this.transactionListSubmitForm.controls['lifecyclestatuss'].invalid) {
      document?.getElementById('lifecyclestatuss')?.classList.add("hello")
    } else {
      document?.getElementById('lifecyclestatuss')?.classList.remove("hello")
    }
    if (this.transactionListSubmitForm.valid) {
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      var data: any = []
      this.array.forEach(element => {
        data.push({
          "addedBy": localStorage.getItem("user") || '',
          "fileName": this.fileResponse?.Data?.DocPath || '',
          "transactionId": element.TransactionId,
          "rrnStatus": formData.lifecyclestatuss.split('(')[0].trim(),
          "remarks": formData.Remark || '',
        })
      });
if(data.length<=0)
{
  this.alertService.errorAlert({
    text: "Select atleast one checkbox"
  })



  // this.DynamicValues = false
  this.loading=false
  return
}

      this.apiHttpService
        .post(

          `${API_URL}/updateTransaction-LifeCycleDetails?pageSize=` + this.pageSize + '&page=' + (this.currentPage - 1), data
        )
        .subscribe((data: any) => {
          this.loading = false
          this.isForm1Submitted = false
          this.isForm2Submitted = false
          document?.getElementById('loading')?.classList.remove("spinner-border")
          document?.getElementById('loading')?.classList.remove("spinner-border-sm")
          // if(data.Data[0].Status=='Success'){
          this.CyclemerchantSelectEvent.emit(data.Data);
          this.modalCycleComponent.open();
          // this.onSubmit(this.transactionListFilter.value)
          this.transactionListSubmitForm.reset()
          this.transactionListSubmit.reset()
          this.transactionListFilter.reset()
          this.transactionListFormGroup.reset()
          // this.isForm1Submitted = false
          // this.isForm2Submitted = false
          this.gridApi.deselectAll();

          // this.alertService.successAlert('Submitted Successfully!')
          // }
          let res = data

        });

    }
      this.isForm2Submitted = true;

  }

//  splitfun(param:any){debugger
//   return param?.split['|'][1]||''
//  }
newFun(e:any){debugger
  console.log((e.target).attr('id'))
}
  ServiceProvide() {

    let serviceprovidedata = {
      "Type": "5",
      "Value": ""
    }
    this.apiHttpService
      .post(`${API_URL}/GetDropdown`, serviceprovidedata)
      .subscribe((res) => {
        this.serviceproviderdata = res
      });
  }

  resetform() {
    document?.getElementById('lifecyclestatus')?.classList.remove("hello")
    this.transactionListFilter.reset()
    this.refundData = false
    this.isForm1Submitted = false
    this.transactionListFilter.controls.searchToDate.setValidators(Validators.required)
    this.transactionListFilter.controls.searchFromDate.setValidators(Validators.required)
    this.transactionListFilter.controls.lifecyclestatus.setValidators(Validators.required)
    this.transactionListFilter.controls.searchToDate.updateValueAndValidity()
    this.transactionListFilter.controls.searchFromDate.updateValueAndValidity()
    this.transactionListFilter.controls.lifecyclestatus.updateValueAndValidity()
  }

  resetBulkform() {
    this.transactionBulkFilter.reset()
    this.refundData = false
    this.isForm3Submitted = false
    this.transactionBulkFilter.controls.file.setValidators(Validators.required)
    this.transactionBulkFilter.controls.searchType.setValidators(Validators.required)
    // this.transactionBulkFilter.controls.lifecyclestatus.setValidators(Validators.required)
    this.transactionBulkFilter.controls.file.updateValueAndValidity()
    this.transactionBulkFilter.controls.searchType.updateValueAndValidity()
    // this.transactionBulkFilter.controls.lifecyclestatus.updateValueAndValidity()
  }

  keyPressFunction(event: any) {
    if (event.target.value.length > 0) {
      this.transactionListFilter.controls.searchToDate.clearValidators()
      this.transactionListFilter.controls.searchFromDate.clearValidators()
      this.transactionListFilter.controls.lifecyclestatus.clearValidators()
      this.transactionListFilter.controls.searchToDate.updateValueAndValidity()
      this.transactionListFilter.controls.searchFromDate.updateValueAndValidity()
      this.transactionListFilter.controls.lifecyclestatus.updateValueAndValidity()


    }

  }

  OnlyNumbersAllowed(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58) || charCode == 46;

  }

  OnlyNumbersAllowedWithoutDecimal(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58);

  }

  OnlySpecialAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode >= 41 && charCode <= 57) && (charCode == 100) && (charCode >= 133 && charCode <= 140) && (charCode >= 173 && charCode <= 176);

  }

  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }
  
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  OnlyCharacterAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }
  fun(id: any) {
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id: any) {
    document?.getElementById(id)?.classList.remove("hey")
  }

  updateRefund() {
    debugger

    if (this.transactionListFormGroup.valid) {
      const data = this.transactionListFormGroup.get('allTransactions')?.value?.filter((ref: any) => ref.Select)?.map((ref: any) => {
        return {
          "TransId": ref.Transaction_Id,
          "RefundAmt": ref.Amount,
          "Merchant_Id": ref.MerchantId
        }
      })
      console.log("===>", data)
      this.merchantService.raiseRefundService(data).subscribe((res) => {
        if (res) {
          this.alertService
            .successAlert(
              'Raised Refund request status',
              this.formattedResponse(res.data || res)
            ).then((d) => {
              this.refreshGrid(this.refundListFilter.value)
            });
        } else {
          this.alertService.errorAlert({
            html: ''
          })
        }
      })


    }
  }

  noKeyInput($event: any) {
    return false
  }

  formattedResponse(data: any) {
    let html = '<div class="table-responsive">\n' +
      '    <table class="table table-hover">\n' +
      '        <thead>\n' +
      '        <tr>\n' +
      '            <th>#</th>\n' +
      '            <th>Merchant ID</th>\n' +
      '            <th>Transaction ID</th>\n' +
      '            <th>Response</th>\n' +
      '        </tr>\n' +
      '        </thead>\n' +
      '        <tbody>\n';
    data.forEach((d: any, i: number) => {
      html += `<tr>
<th>${i + 1}</th>
<th>${d.MerchantId}</th>
<td>${d.Id}</td>
<td>${d.respMessage}</td>
</tr>`;
    });

    html += '</tbody>\n' +
      '    </table>\n' +
      '</div>';
    return html;
  }
  isRaiseRefBtnDisable() {
    return Object.keys(this.refundRaiseLog).length > 0 && this.transactionListFilter.valid;
  }
}

var filterParams = {
  // @ts-ignore
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('/');
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,




}
