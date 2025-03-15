import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControlName, Validators, FormBuilder } from '@angular/forms';
import { ApiHttpService } from "../../../../_services/api-http.service";
import { ChargebackServiceService } from '../chargeback-service.service';
import { environment } from 'src/environments/environment';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent, RowClickedEvent } from 'ag-grid-community';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
import { AlertService } from 'src/app/_services/alert.service';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

@Component({
  selector: 'app-raise-charge-back',
  templateUrl: './raise-charge-back.component.html',
  styleUrls: ['./raise-charge-back.component.scss']
})
export class RaiseChargeBackComponent implements OnInit {
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;


  Resdata: any;
  chargeBackRaiseForm: FormGroup
  chargebacklistData: any;
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
  isForm1Submitted: boolean = false
  showMessage: any = false;
  modalConfigBlocked: ModalConfig;
  Data: any;
  formValue: any;
  currDate:any=new Date();
  loading: boolean=false;


  constructor(private apiHttpService: ApiHttpService, private chargeBackService: ChargebackServiceService, private fb: FormBuilder,private alertService: AlertService) {
    this.chargeBackRaiseForm = fb.group({
      // merchantId: [this.merchantId || "",],
      merchantId: [, []],
      transactionId: ["", [Validators.maxLength(45)]],
      ToDate: [, [Validators.required]],
      FromDate: ["", [Validators.required]],
      ReferenceNumber: ["", [Validators.maxLength(45)]]
    }
    );
  }

  ngOnInit(): void {

    this.columnDefs = [

      { field: 'Txn_Id', tooltipField: 'Txn_Id', headerName: 'Transaction Id', filter: true },
      { field: 'Amount', tooltipField: 'Amount', headerName: 'Amount', filter: true },
      { field: 'Txn_Date', tooltipField: 'Txn_Date', headerName: 'Transaction Date', filter: true },
      { field: 'MID', tooltipField: 'MID', headerName: 'Auth ID', filter: true },
      { field: 'Mer_Name', tooltipField: 'Mer_Name', headerName: 'Merchant Name', filter: true },
      { field: 'Bank_Ref_No', tooltipField: 'Bank_Ref_No', headerName: 'Bank Reference Number', filter: true },
      { field: 'Mer_Ord_No', tooltipField: 'Mer_Ord_No', headerName: 'Merchant Order Number', filter: true },
      { field: 'Txn_Type', tooltipField: 'Txn_Type', headerName: 'Transaction Type', filter: true },
      { field: 'Bank_Name', tooltipField: 'Bank_Name', headerName: 'Bank Name', filter: true },
      { field: 'Merchant_Email_ID', tooltipField: 'Merchant_Email_ID', headerName: 'Merchant Email ID', filter: true },

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

    this.modalConfigBlocked = {
      modalTitle: "Transaction Details",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }

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


  async onRowDoubleClicked(param: RowClickedEvent | any) {
    debugger
     this.Data = param.data
     this.BlockedmerchantSelectEvent.emit(this.Data);
     return await this.modalblockedComponent.open();
  }





  MerchnatList() {
    const merchantdata = {
      "name": ""
    };

    this.chargeBackService.getMerchantList(merchantdata).subscribe((res: any) => (
      this.Resdata = res));
  }



  onSubmit(formvalue: any) {
    debugger
    this.formValue = formvalue
    let data = {

      "txnId": formvalue.transactionId || '',
      "bankRefNo": formvalue.ReferenceNumber || '',
      "mid": formvalue.merchantId || '',
      "fdate": formvalue.FromDate,
      "todate": formvalue.ToDate

    }

    if (this.chargeBackRaiseForm.valid) {
      if ((2000 > new Date(this.chargeBackRaiseForm.controls["FromDate"].value).getFullYear() || new Date(this.chargeBackRaiseForm.controls["FromDate"].value) > this.currDate) || (2000 > new Date(this.chargeBackRaiseForm.controls["ToDate"].value).getFullYear() || new Date(this.chargeBackRaiseForm.controls["ToDate"].value) > this.currDate)) {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })



       // this.refundStatusdata = false
        return
      }
      if (this.chargeBackRaiseForm.controls['FromDate'].value > this.chargeBackRaiseForm.controls['ToDate'].value) {
        this.alertService.errorAlert({
          text: "From Date can not be greater than To Date!"
        })
        this.rowData = []
        return
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.chargeBackService.getChargeBackDataForRaised(data).subscribe((res: any) => {
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
        this.collectionSize = this.chargebacklistData?.totalCount || this.chargebacklistData?.length;
      })
    }



    this.isForm1Submitted = true


  }


  closeModalBlocked($event: any) {debugger
    if (!$event.showModal) {
      this.modalblockedComponent.close();
      this.refreshGrid();
    }
  }



  refreshGrid()
  {
    
    let data = {

      "txnId": this.formValue.transactionId || '',
      "bankRefNo": this.formValue.ReferenceNumber || '',
      "mid": this.formValue.merchantId || '',
      "fdate": this.formValue.FromDate,
      "todate": this.formValue.ToDate

    }

    if (this.chargeBackRaiseForm.valid) {
      this.chargeBackService.getChargeBackDataForRaised(data).subscribe((res: any) => {
        if(res.Error)
        {
          // this.alertService.errorAlert({
          //   text:res?.Error[0]
          // })
          this.showMessage=false
          return
        }
        this.chargebacklistData = res
        this.showMessage = res
        this.rowData = this.chargebacklistData || data;
        this.collectionSize = this.chargebacklistData.totalCount || this.chargebacklistData.length;
      })
    }
  }





  resetform() {
    this.chargeBackRaiseForm.reset()
    this.isForm1Submitted = false
    this.showMessage = false

  }



  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  OnlyNumbersAllowed(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58) || charCode == 46;

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
