import { Component, OnInit } from '@angular/core';
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
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';

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
  selector: 'app-settlement-generation',
  templateUrl: './settlement-generation.component.html',
  styleUrls: ['./settlement-generation.component.scss']
})
export class SettlementGenerationComponent implements OnInit {

 
  public searchFromDate: string = '';
  public searchToDate: string = '';
  @ViewChild('authorList', { static: true }) authorList: TemplateRef<any>;
  @ViewChild('amountEle', { static: true }) amountEle: TemplateRef<any>;

  public refundListFormGroup: FormGroup;
  formcontrols: any;
  @Input() merchantId: string;
  @Input() onMerchantChange: EventEmitter<any> = new EventEmitter<any>();
  selectedmerchant: number;
  refundListFilterGroup: FormGroup;
  isForm1Submitted: Boolean;
  currentURL: Boolean = false
  modalConfigDelete: ModalConfig;
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  Instrumentselect: boolean = false;
  public rowData!: any[];
  tablecolumn: any;
  currentPage: number = 1;
  pageSize: number = 10;
  globalSearch: string = '';
  collectionSize: number = 0;
  SingleRow: any;
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
  validationIFSC: boolean;
  IFSCcheck: boolean;
  ValidAccount: boolean = true;
  errorOccured: boolean = false;
  IFSCData: any;
  param: IMerchantData;
  highlight: boolean;
  refundData: any = false;
  refundRaiseLog: any = {};
  @ViewChild('modalDelete') private modalDeleteComponent: ModalComponent
  private gridApi!: GridApi;
  private filterObj: any = {};
  private merchantValue: null;
  private merchantresponse: any;
  private queryParams: any = {};
  instrumentID: any;
  Resbank: any;
  spID: any;
  loading: boolean;
  fileType: any;
  fileInitial: any;

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
    var e = {
      "target": { 'value': "" }
    }
    var x = {
      "target": { 'value': "" }
    }
    this.seletservice(e)
    this.selectinstrument(x)
    // this.MerchnatList()
    // Validators.required
    this.refundListFilterGroup = fb.group({
      // merchantId: [this.merchantId || "",],
      spId: [, [Validators.required]],
      InstrumentId: [, [Validators.required]],
      Cycle: [, [Validators.required]],
      ReconDate: [, [Validators.required]],
    }
    );


  }

  get refundListFilter() {
    return this.refundListFilterGroup as FormGroup;
  }

  get refundListForm() {
    return this.refundListFormGroup.get('allTransactions') as FormArray
  }

  ngAfterViewInit(): void {

  }
  ServiceProvide() {

    let serviceprovidedata = {
      "Type": "26",
      "Value": ""
    }
    this.apiHttpService
      .post(`${API_URL}/GetDropdown`, serviceprovidedata)
      .subscribe((res) => {
        this.Resdata = res

      });
  }
  loadData() {

    let data: any = [];

    this.rowData.forEach((item) => {
      data.push(
        new FormGroup({
          MerchantId: new FormControl(item.MerchantId),
          Transaction_Id: new FormControl(item.Transaction_Id),
          TransactionAmount: new FormControl(item.TransactionAmount || 0),
          Amount: new FormControl(),
          Select: new FormControl(false),
        })
      );
    });
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
    const currentControl = (this.refundListFormGroup?.get('allTransactions') as FormArray).controls[bookTypeIndex];

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
    this.formcontrols = this.refundListFormGroup?.get('allTransactions');
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
    const controls = this.refundListFilterGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  ngOnInit(): void {

    // books.books.forEach((data) => {
    //   data.authors.forEach((author: any) => {
    //     author.isSelected = false;
    //   });
    // });

    // this.rowData = books.books
    console.log(this.rowData)
    this.ServiceProvide()
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



    this.columnDefs = [

      { field: 'Id', tooltipField: 'Serial No', headerName: 'Serial No' },
      { field: 'SPId', tooltipField: 'Service Provider', headerName: 'Service Provider' },
      { field: 'InstrumentId', tooltipField: 'Instrument', headerName: 'Instrument' },
      { field: 'CycleId', tooltipField: 'Cycle', headerName: 'Cycle' },
      { field: 'ReconDate', tooltipField: 'Date', headerName: 'Date' },
      {
        field: 'FileName', headerName: 'File Download', width: 30, cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (event: any, param: any) => {
              debugger
              var fileName
              var filePath = param.data.FileLocation
              if (filePath == '') {
                this.alertService.errorAlert({
                  html: 'File does not exist'
                })
              } else {
                this.downloadFile(fileName, filePath)
              }

            },
            buttonIconClass: 'icon-download-cloud'
          },
        ]
      },
      { field: 'Status', tooltipField: 'Status', headerName: 'Status' },
      { field: 'GeneratedBy', tooltipField: 'Generated By', headerName: 'Generated By' },
    ];
  }
  get form1() {
    return this.refundListFilterGroup.controls;
  }

  seletservice(e: any) {
    debugger
    // this.Instrumentselect = true
    // this.ResinstrumentBrandDropdown = false
    // this.merchantMDRform.get('instrumentBrand')?.setValidators([])
    // this.merchantMDRform.get('instrumentBrand')?.updateValueAndValidity()
    // this.code = e?.target?.value || e;
    // this.merchantMDRform.controls['instrument_id'].setValue("")
    this.spID = this.refundListFilterGroup?.controls['spId']?.value
    if (!this.spID) {
      return
    }
    let serviceprovidedata = {
      "Type": "27",
      "Value": this.spID.toString() || ''
    }
    return this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, serviceprovidedata
      )
      .subscribe((res) => {
        this.Resdatas = res
        // if(this.Resdatas=="CC"||this.Resdatas=="DC")
        // {
        //   this.ResinstrumentBrandDropdown=true
        // }
        // else{
        //   this.ResinstrumentBrandDropdown=false
        // }
        return res;
      });
  }
  selectinstrument(e: any) {
    // this.bankselect = true
    // this.bankdata = e.target.value;
    // if (this.bankdata == "CC" || this.bankdata == "DC") {
    //   this.ResinstrumentBrandDropdown = true
    //   this.merchantMDRform.get('instrumentBrand')?.setValidators([Validators.required])
    //   this.merchantMDRform.get('instrumentBrand')?.updateValueAndValidity()

    // }
    // this.merchantMDRform.controls['bank_id'].setValue("")
    // const providerVal = this.refundListFilterGroup.get('spId')?.value
    this.spID = this.refundListFilterGroup?.controls['spId']?.value
    this.instrumentID = this.refundListFilterGroup?.controls['InstrumentId']?.value
    if (!this.instrumentID) {
      return
    }
    let serviceprovidedata = {
      "Type": "28",
      "Value": this.spID.toString() + '#' + this.instrumentID.toString()
    }
    this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, serviceprovidedata
      )
      .subscribe((res) => {
        this.Resbank = res
      });
  }

  DeleteAccount(ID: any) {
    let data = {
      "Pid": ID.id || ID
    }

    return this.apiHttpService
      .post(
        `${API_URL}/delete-merchantbank-byid`, data
      );

  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term: string) => term.length < 2 ? []
        : this.rowData.filter(v => (v.merchantId.toLowerCase().indexOf(term.toLowerCase()) > -1)).map(v => v.merchantId).slice(0, 10))
    );

  async closeModelAction($event: Event) {
    await this.modalDeleteComponent.dismiss();
    // this.refreshGrid(this.merchantId);
  }

  refreshGrid(formvalue: any) {

    let data = {
      "merchantId": this.merchantId || formvalue.merchantId || '',
      "merchanTransactionId": formvalue.merchanTransactionId || '',
      "searchFromDate": formvalue.searchFromDate || '',
      "Paymentsid": formvalue.Payid || '',
      "fromDate": formvalue.searchFromDate || '',
      "toDate": formvalue.searchToDate || '',
      "bankId": formvalue.bankId || '',
      "custMail": formvalue.custMail || '',
      "custMobile": formvalue.custMobile || ''
    }

    this.apiHttpService
      .post(
        `${API_URL}/GetRaiseRefundTranssaction-List?pageSize=${this.pageSize}&page=${(this.currentPage - 1)}`, data
      )
      .subscribe((data: any) => {
        this.rowData = data?.data || data;
        this.collectionSize = data?.totalCount || data?.length;
        this.refundListFormGroup = new FormGroup({
          allTransactions: new FormArray(this.loadData()),
        });
        this.formcontrols = this.refundListFormGroup?.get('allTransactions');

        (this.refundListFormGroup.get('allTransactions') as FormArray).controls.forEach((con: any) => {
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
    this.gridApi = params.api;
    this.rowData = []
    this.collectionSize = 0

  }
  getdownload(url: string, data: any) {
    return this.apiHttpService.post(url, data)
  }

  downloadFile(fileName: any, filePath: any) {
    debugger
    this.fileType = filePath.split('.').pop();
    this.fileInitial = filePath.split('.')[0].split('/').pop()
    const formData = new FormData();
    formData.append('urlfile', filePath);
    formData.append('docname', '');
    this.getdownload(`${API_URL}/download-uploadfiles/`, formData).subscribe((res: any) => {
      var response = res;
      var random = Math.floor(Math.random() * 10000000000 + 1);

      var today = new Date();

      const linkSource = 'data:application/' + this.fileType + ';base64,' + response.Data;
      const downloadLink = document.createElement("a");
      const NewfileName = "Payments_" + today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2) + "-" + random.toString().slice(-4) + this.fileInitial + "." + this.fileType;

      downloadLink.href = linkSource;
      downloadLink.download = NewfileName;
      downloadLink.click();
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
    var fileName = 'Payments_' + referenceId
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
    $event.preventDefault();
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    this.gridApi.applyTransaction({ add: this.rowData })

  }

  onSubmit(formvalue: any) {
    debugger
    //
    // if (this.refundListFilterGroup.controls['retypesearchFromDate'].invalid) {
    //   alert("Account number should match with retype account!")
    // } 
    this.refundListFilterGroup.controls['spId'].clearValidators()
    this.refundListFilterGroup.controls['spId'].updateValueAndValidity()
    this.refundListFilterGroup.controls['InstrumentId'].clearValidators()
    this.refundListFilterGroup.controls['InstrumentId'].updateValueAndValidity()
    this.refundListFilterGroup.controls['Cycle'].clearValidators()
    this.refundListFilterGroup.controls['Cycle'].updateValueAndValidity()
    this.refundListFilterGroup.controls['ReconDate'].addValidators([Validators.required])
    this.refundListFilterGroup.controls['ReconDate'].updateValueAndValidity()
    if (this.refundListFilterGroup.controls['spId'].invalid) {
      document?.getElementById('spId')?.classList.add("hello")
    } else {
      document?.getElementById('spId')?.classList.remove("hello")
    }
    if (this.refundListFilterGroup.controls['InstrumentId'].invalid) {
      document?.getElementById('InstrumentId')?.classList.add("hello")
    } else {
      document?.getElementById('InstrumentId')?.classList.remove("hello")
    }
    if (this.refundListFilterGroup.controls['Cycle'].invalid) {
      document?.getElementById('Cycle')?.classList.add("hello")
    } else {
      document?.getElementById('Cycle')?.classList.remove("hello")
    }
    setTimeout(() => {
      if (this.refundListFilterGroup.valid) {
        this.loading = true
        document?.getElementById('loading')?.classList.add("spinner-border")
        document?.getElementById('loading')?.classList.add("spinner-border-sm")
        //  this.merchantId = this.merchantId || formvalue.merchantId
        this.merchantId = formvalue.merchantId

        var merchantdata =
        {
          "Type": "1",
          "SPId": formvalue?.spId?.toString() || "0",
          "Instrument": formvalue?.InstrumentId?.toString() || "",
          "Cycle": formvalue?.Cycle?.toString() || "",
          "ReconDate": formvalue?.ReconDate,
          "UserId": localStorage.getItem("user")
        }
        this.apiHttpService
          .post(
            `${API_URL}/settle-Claim-ReportT0?pageSize=` + this.pageSize + '&page=' + (this.currentPage - 1), merchantdata
          )
          .subscribe((data: any) => {
            debugger
            this.loading = false
            document?.getElementById('loading')?.classList.remove("spinner-border")
            document?.getElementById('loading')?.classList.remove("spinner-border-sm")
            if (data?.Status == 'Success') {
              this.rowData = data?.Data
              this.refundData = this.rowData
              this.collectionSize = data?.totalCount || data?.length
              data[0].status == 'false' ? console.log(JSON.parse(data[0].error).Error) : this.refundListFilterGroup.reset();

              this.refundListFilterGroup.get('merchantId')?.setValue(this.merchantId);
              this.ValidAccount = true;
              (this.isForm1Submitted = false)

              this.rowData = data?.data || data;
              this.collectionSize = data?.totalCount || data?.length;
            }
            else {
              this.rowData = []
              this.refundData = false
              this.collectionSize = 0
              this.alertService.errorAlert({
                html: data?.Message
              })
            }

            // this.refundListFormGroup = new FormGroup({
            //   allTransactions: new FormArray(this.loadData()),
            // });
            // this.formcontrols = this.refundListFormGroup?.get('allTransactions');

            // (this.refundListFormGroup.get('allTransactions') as FormArray).controls.forEach((con: any) => {
            //   con.get('Amount')?.disable();
            // })
          });

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

  onGenerate(formvalue: any) {
    debugger
    //
    // if (this.refundListFilterGroup.controls['retypesearchFromDate'].invalid) {
    //   alert("Account number should match with retype account!")
    // } 
    this.refundListFilterGroup.controls['spId'].addValidators([Validators.required])
    this.refundListFilterGroup.controls['spId'].updateValueAndValidity()
    this.refundListFilterGroup.controls['InstrumentId'].addValidators([Validators.required])
    this.refundListFilterGroup.controls['InstrumentId'].updateValueAndValidity()
    this.refundListFilterGroup.controls['Cycle'].addValidators([Validators.required])
    this.refundListFilterGroup.controls['Cycle'].updateValueAndValidity()
    this.refundListFilterGroup.controls['ReconDate'].addValidators([Validators.required])
    this.refundListFilterGroup.controls['ReconDate'].updateValueAndValidity()
    if (this.refundListFilterGroup.controls['spId'].invalid) {
      document?.getElementById('spId')?.classList.add("hello")
    } else {
      document?.getElementById('spId')?.classList.remove("hello")
    }
    if (this.refundListFilterGroup.controls['InstrumentId'].invalid) {
      document?.getElementById('InstrumentId')?.classList.add("hello")
    } else {
      document?.getElementById('InstrumentId')?.classList.remove("hello")
    }
    if (this.refundListFilterGroup.controls['Cycle'].invalid) {
      document?.getElementById('Cycle')?.classList.add("hello")
    } else {
      document?.getElementById('Cycle')?.classList.remove("hello")
    }
    setTimeout(() => {
      if (this.refundListFilterGroup.valid) {
        this.loading = true
        document?.getElementById('gloading')?.classList.add("spinner-border")
        document?.getElementById('gloading')?.classList.add("spinner-border-sm")
        //  this.merchantId = this.merchantId || formvalue.merchantId
        this.merchantId = formvalue.merchantId

        var merchantdata =
        {
          "SPId": formvalue?.spId?.toString() || "0",
          "Instrument": formvalue?.InstrumentId?.toString() || "",
          "Cycle": formvalue?.Cycle?.toString() || "",
          "ReconDate": formvalue?.ReconDate,
          "UserId": localStorage.getItem("user")
        }
        this.apiHttpService
          .post(
            `${API_URL}/settle-Claim-GenrateT0?pageSize=` + this.pageSize + '&page=' + (this.currentPage - 1), merchantdata
          )
          .subscribe((data: any) => {
            debugger
            this.loading = false
            document?.getElementById('gloading')?.classList.remove("spinner-border")
            document?.getElementById('gloading')?.classList.remove("spinner-border-sm")
            if (data?.Status == 'Success') {
              this.rowData = data?.Data
              this.refundData = this.rowData
              this.collectionSize = data?.totalCount || data?.length
              data[0].status == 'false' ? console.log(JSON.parse(data[0].error).Error) : this.refundListFilterGroup.reset();

              this.refundListFilterGroup.get('merchantId')?.setValue(this.merchantId);
              this.ValidAccount = true;
              (this.isForm1Submitted = false)

              this.rowData = data?.data || data;
              this.collectionSize = data?.totalCount || data?.length;
            }
            else {
              this.rowData = []
              this.refundData = false
              this.collectionSize = 0
              this.alertService.errorAlert({
                html: data?.Message
              })
            }

            // this.refundListFormGroup = new FormGroup({
            //   allTransactions: new FormArray(this.loadData()),
            // });
            // this.formcontrols = this.refundListFormGroup?.get('allTransactions');

            // (this.refundListFormGroup.get('allTransactions') as FormArray).controls.forEach((con: any) => {
            //   con.get('Amount')?.disable();
            // })
          });

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
  reset(event: any) {
    this.refundListFilterGroup.reset();
    this.refundListFilterGroup.controls['spId'].clearValidators()
    this.refundListFilterGroup.controls['spId'].updateValueAndValidity()
    this.refundListFilterGroup.controls['InstrumentId'].clearValidators()
    this.refundListFilterGroup.controls['InstrumentId'].updateValueAndValidity()
    this.refundListFilterGroup.controls['Cycle'].clearValidators()
    this.refundListFilterGroup.controls['Cycle'].updateValueAndValidity()
    this.refundListFilterGroup.controls['ReconDate'].clearValidators()
    this.refundListFilterGroup.controls['ReconDate'].updateValueAndValidity()
    this.refundListFilterGroup.markAsUntouched(); // Reset form data
    this.refundListFilterGroup.updateValueAndValidity(); // Reset form data
    this.refundData = false
    // this.Resdata='' // Reset form data
    // this.Resdatas='' // Reset form data
    // this.Resbank='' // Reset form data
  }

  //get merchant By Name
  // MerchnatList() {
  //   const merchantdata = {
  //     "name": ""
  //   };
  //   this.apiHttpService
  //     .post(
  //       `${API_URL}/GetMerchant/`, merchantdata
  //     )
  //     .subscribe((res: any) => (this.Resdata = res));
  // }

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

    if (this.refundListFormGroup.valid) {
      const data = this.refundListFormGroup.get('allTransactions')?.value?.filter((ref: any) => ref.Select).map((ref: any) => {
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
              'Refund Raised successfully',
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
    return Object.keys(this.refundRaiseLog).length > 0 && this.refundListFormGroup.valid;
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
