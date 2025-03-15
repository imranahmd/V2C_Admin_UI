import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, PaginationChangedEvent, SelectionChangedEvent } from 'ag-grid-community';
import { RefundManagementService } from '../refund-management.service';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/_services/alert.service';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
@Component({
  selector: 'app-download-manual-refund',
  templateUrl: './download-manual-refund.component.html',
  styleUrls: ['./download-manual-refund.component.scss']
})
export class DownloadManualRefundComponent implements OnInit {
  Resdata: any;
  refundStatusForm: FormGroup;
  serviceProvider: any;
  refundTypeData: any;
  refundStatusData: any;

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

  refundStatusdata: any;
  Search_By: any = [];
  submit1: boolean = false
  currDate: any = new Date();
  pastDate: any = new Date("2000-01-01");
  loading: boolean = false;
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  array:any=[];
  downloadData: any;
  fileType: any;
  fileInitial: any;
  inkSource: string;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  constructor(private fb: FormBuilder, private refundService: RefundManagementService, private alertService: AlertService) {
    this.refundStatusForm = fb.group({
      merchantId: [, []],
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]],
      transactionId: ['', [Validators.maxLength(40)]],
      merchantTransactionId: ['', [Validators.maxLength(40)]],
      SearchBy: [, [Validators.required,Validators.maxLength(40)]],
      refundType: [, []],
      custMail: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      custMobile: ['', [Validators.pattern("[123456789][0-9]{9}"), Validators.maxLength(10)]],
      sId: [, []]

    })
  }

  get form1() {
    return this.refundStatusForm as FormGroup
  }

  ngOnInit(): void {
    this.MerchnatList()
    this.transactionStatusList()
    this.RefundStatus()
    this.RefundType()
    this.Search_By = [{ FieldValue: 'Transaction Date', FieldText: 'Transaction Date' },
    { FieldValue: 'Refund Date', FieldText: 'Refund Date' },]
    this.columnDefs = [
      {
        headerName: 'Select',
        headerCheckboxSelection: true,
        checkboxSelection: true,
        showDisabledCheckboxes: true,

      },

      { field: 'Agg Transaction Id', tooltipField: 'Agg Transaction Id', headerName: 'Agg Transaction Id' },
      { field: 'Merchant Transaction Id', tooltipField: 'Merchant Transaction Id', headerName: 'Merchant Transaction ID' },
      { field: 'Transaction Date', tooltipField: 'Transaction Date', headerName: 'Transaction Date' },
      { field: 'Transaction Amount', tooltipField: 'Transaction Amount', headerName: 'Transaction Amount' },
      { field: 'Service Provider', tooltipField: 'Refund Amount', headerName: 'Refund Amount' },
      { field: 'Payment Method', tooltipField: 'Payment Method', headerName: 'Payment Method' },
      { field: 'Bank Name', tooltipField: 'Bank Name', headerName: 'Bank Name' },
      { field: 'Refund Id', tooltipField: 'Refund Id', headerName: 'Refund ID' },
      { field: 'Refund Amount', tooltipField: 'Refund Amount', headerName: 'Refund Amount' },
      { field: 'Merchant Name', tooltipField: 'Merchant Name', headerName: 'Merchant Name' },
      { field: 'Email', tooltipField: 'Email', headerName: 'Email' },
      { field: 'Contact', tooltipField: 'Contact', headerName: 'Contact' },
      { field: 'Refund Type', tooltipField: 'Refund Type', headerName: 'Refund Type' },
      { field: 'Created On', tooltipField: 'Created On', headerName: 'Created On' },


    ];
    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

  }


  MerchnatList() {
    const merchantdata = {
      "name": ""
    };
    this.refundService.getAllMerchantList(merchantdata).subscribe((res: any) => {
      this.Resdata = res

    })
  }

  RefundType() {
    let data = {
      "Type": "30",
      "Value": ""
    }
    this.refundService.getRefundType(data).subscribe((res: any) => {
      this.refundTypeData = res

    })

  }

  RefundStatus() {
    let data = {
      "Type": "31",
      "Value": ""
    }
    this.refundService.getRefundType(data).subscribe((res: any) => {
      this.refundStatusData = res

    })

  }
  onGridReady(params: any) {
    this.gridApi = params.api;
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

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
    debugger
    this.gridApi.paginationGoToPage(param - 1)
  }

  onPageSizeChanges($event: Event) {
    debugger
    $event.preventDefault();
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.refreshCells()
  }


  onSubmit(formData: any) {debugger
    console.log("formvalue", formData)
    let refundRrquest = {
      "Paymentsid": formData.transactionId || "",
      "merchanTransactionId": formData.merchantTransactionId || "",
      "fromDate": formData.FromDate || "",
      "toDate": formData.ToDate || "",
      "merchantId": formData.merchantId || "",
      "spId": formData.sId || "",
      "custMail":formData.custMail||"",
      "custMobile":formData.custMobile||"",
      "count": "10",
      "pageNo": 0,
      "Type": 0,
      "SearchBy":formData.SearchBy||"",
      "refundType": formData.refundType || ""

    }
    if (this.refundStatusForm.valid) {
      if ((2000 > new Date(this.refundStatusForm.controls["FromDate"].value).getFullYear() || new Date(this.refundStatusForm.controls["FromDate"].value) > this.currDate) || (2000 > new Date(this.refundStatusForm.controls["ToDate"].value).getFullYear() || new Date(this.refundStatusForm.controls["ToDate"].value) > this.currDate)) {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })



        this.refundStatusdata = false
        return
      }
      if (this.refundStatusForm.controls['FromDate'].value > this.refundStatusForm.controls['ToDate'].value) {
        this.alertService.errorAlert({
          text: "From Date can not be greater than To Date!"
        })
        this.rowData = []
        return
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.refundService.getDownloadManualRefundFile(refundRrquest).subscribe((data: any) => {
       

        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        if(data.Status=="Error")
        {
          this.alertService.errorAlert({
            text:data.Message
          })
          this.refundStatusdata=false
          return
        }
              
        this.refundStatusdata = data
        this.rowData = data?.data || data;
        this.collectionSize = data?.totalCount || data?.data?.length || data?.length;


      })

    }
    else {
      if (this.refundStatusForm.controls['SearchBy'].invalid) {
        document?.getElementById('serchBy')?.classList.add("hello")
      }

      else {
        document?.getElementById('serchBy')?.classList.remove("hello")
      }

     
    }

    this.submit1 = true
  }


  onSelectionChanged(event: SelectionChangedEvent) {
    this.array = event.api.getSelectedRows();
  }
  downloadRefundFile(fileName: any, filePath: any) {
    this.fileType = filePath.split('.').pop();
    this.fileInitial = filePath.split('.')[0].split('/').pop()
    const formData = new FormData();
    formData.append('urlfile', filePath);
    formData.append('docname', '');
    this.refundService.downlaodimage(formData).subscribe((res: any) => {
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

  downLoadFile() {debugger
    var data: any = []
    this.array.forEach((element:any) => {
      data.push({
        "userId": localStorage.getItem("user") || '',

        "refundId": element['Refund Id'],

      })
    });

    this.refundService.DownloadManualRefundFileFrom(data).subscribe((res:any)=>{
      this.downloadData=res
      this.downloadRefundFile("",this.downloadData.FilePath)
    })


  }









  transactionStatusList() {
    debugger
    let serviceprovidedata = {
      "Type": "5",
      "Value": ""
    }
    this.refundService.getServiceProviderList(serviceprovidedata).subscribe((res: any) => {
      this.serviceProvider = res

    })

  }

  resetform() {
    this.refundStatusForm.reset()
    this.refundStatusdata = false
    document?.getElementById('serchBy')?.classList.remove("hello")
    this.submit1 = false
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  OnlyNumbersAllowed(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58) || charCode == 46;

  }

  OnlyCharacterAllowed(event: { which: any; keyCode: any; }): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

}


