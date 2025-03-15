import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargebackServiceService } from '../chargeback-service.service';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent, RowClickedEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/_services/alert.service';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

@Component({
  selector: 'app-download-charge-back-docs',
  templateUrl: './download-charge-back-docs.component.html',
  styleUrls: ['./download-charge-back-docs.component.scss']
})
export class DownloadChargeBackDocsComponent implements OnInit {
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;

  downloadChargeForm: FormGroup
  Resdata: any;
  downLoadData: any;
  showMessage: any;
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
  download: any;
  currDate:any=new Date();
  loading: boolean=false;
  Data: any;
  
  modalConfigBlocked: ModalConfig;
  viewdata: any;

  constructor(private fb: FormBuilder, private chargeBackService: ChargebackServiceService, private alertService: AlertService) {
    this.downloadChargeForm = fb.group({
      FromDate: [, [Validators.required]],
      ToDate: [, [Validators.required]],
      ChargeBackID: [, [Validators.maxLength(45)]],
      TransactionID: [, [Validators.maxLength(45)]],
      merchantId: [, [Validators.maxLength(500)]]

    })
  }

  ngOnInit(): void {

   this.MerchnatList()
    this.columnDefs = [

      { field: 'CB_ID', tooltipField: 'CB_ID', headerName: 'Chargeback ID', filter: true },
      { field: 'MerchantId', tooltipField: 'MerchantId', headerName: 'Auth ID', filter: true },
      { field: 'TxnId', tooltipField: 'TxnId', headerName: 'Transaction ID', filter: true },
      { field: 'TxnAmt', tooltipField: 'TxnAmt', headerName: 'Transaction Amount', filter: true },
      // { field: 'CB_STATUS', tooltipField: 'CB_STATUS', headerName: 'CB STATUS', filter: true },
      // { field: 'CRN_NO', tooltipField: 'CRN_NO', headerName: 'CRN NO', filter: true },
      // { field: 'Uploaded_File_Name', tooltipField: 'Uploaded_File_Name', headerName: 'Uploaded File Name', filter: true },
      // { field: 'File_Upload_Date', tooltipField: 'File_Upload_Date', headerName: 'File Upload Date', filter: true },

      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          // {
          //   clicked: async (field: any, data: any, param: any, formvalue: any) => {
          //     debugger
          //     this.download = data.data.Uploaded_File_Name

          //     this.download1(this.download)

          //   },
          //   buttonIconClass: 'icon-download-cloud',


          // },
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.viewdata=data.data
              this.BlockedmerchantSelectEvent.emit(this.viewdata);
              return await this.modalblockedComponent.open();
              // this.download = data.data.Uploaded_File_Name

              // this.download1(this.download)

            },
            buttonIconClass: 'icon-eye',


          },




        ]
      },





    ];

    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.modalConfigBlocked = {
      modalTitle: "Chargeback Details",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }

  }



  MerchnatList() {
    const merchantdata = {
      "name": ""
    };

    this.chargeBackService.getMerchantList(merchantdata).subscribe((res: any) => (
      this.Resdata = res));
  }


  onSubmit(formvalue: any) {debugger
    let data = {
      "txnId": formvalue.TransactionID || '',
      "cbId": formvalue.ChargeBackID || '',
      "merchantId": formvalue.merchantId || '',
      "Fdate": formvalue.FromDate || '',
      "ToDate": formvalue.ToDate || ''
    }

    if(this.downloadChargeForm.valid)
    {
      if ((2000 > new Date(this.downloadChargeForm.controls["FromDate"].value).getFullYear() || new Date(this.downloadChargeForm.controls["FromDate"].value) > this.currDate) || (2000 > new Date(this.downloadChargeForm.controls["ToDate"].value).getFullYear() || new Date(this.downloadChargeForm.controls["ToDate"].value) > this.currDate)) {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })



       // this.refundStatusdata = false
        return
      }
      if (this.downloadChargeForm.controls['FromDate'].value > this.downloadChargeForm.controls['ToDate'].value) {
        this.alertService.errorAlert({
          text: "From Date can not be greater than To Date!"
        })
        this.rowData = []
        return
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")

      this.chargeBackService.DownloadChargeBackDocs(data).subscribe((res: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")

        if(res?.Error)
        {
          this.alertService.errorAlert({
            text:res?.Error[0]
          })
          this.showMessage=false
          return
  
        }
  
        this.downLoadData = res
        this.showMessage = res
        this.rowData = this.downLoadData || data;
        this.collectionSize = this.downLoadData.totalCount || this.downLoadData.length;
      })
    }

   
    this.isForm1Submitted=true
  }


  resetform() {
    this.downloadChargeForm.reset()
    this.showMessage=false
    this.isForm1Submitted=false
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


  download1(data: any) {debugger
    this.chargeBackService.downloadZipFile(data).subscribe((res: any) => {
      var blob = new Blob([res], {
        type: 'application/zip',
        // filename: this.fileName,
      });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      // let url = window.URL.createObjectURL(res.blob());
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = data;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })

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

  // async onRowDoubleClicked(param: RowClickedEvent | any) {
  //   debugger
  //    this.Data = param.data
  //     this.BlockedmerchantSelectEvent.emit(this.Data);
  //     return await this.modalblockedComponent.open();
  // }

  closeModalBlocked($event: any) {debugger
    if (!$event.showModal) {
       this.modalblockedComponent.close();
      // this.refreshGrid();
    }
  }


}
