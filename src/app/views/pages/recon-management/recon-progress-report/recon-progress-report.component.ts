import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from "../../../../_services/api-http.service";
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { RiskdashboardService } from '../../riskdashboard/riskdashboard.service';
import { AlertService } from "../../../../_services/alert.service";
import { ReconServiceService } from './../recon/recon-service.service';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import {
  ColDef,
  FilterChangedEvent,
  FilterModifiedEvent,
  FilterOpenedEvent,
  GridApi,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererParams,
  PaginationChangedEvent,
  RowClickedEvent,
} from 'ag-grid-community';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReconManagementService } from '../recon-management.service';
import { TextCellRenderer } from 'src/app/common/text-cell-renderer.component';
import { TotalValueRenderer } from '../total-value-renderer.component';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
import * as $ from "jquery";
const { API_URL } = environment;

@Component({
  selector: 'app-recon-progress-report',
  templateUrl: './recon-progress-report.component.html',
  styleUrls: ['./recon-progress-report.component.scss']
})
export class ReconProgressReportComponent implements OnInit {
  ReconProgressReportform: FormGroup;
  modalConfigBlocked: ModalConfig;
  loading: boolean=false;
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;
  public columnDefs: ColDef[] = [
    { field: 'FileId', headerName: 'File ID' },
    { field: 'FileName', headerName: 'File Name' },
    { field: 'sp_name', headerName: 'Service Provider' },
    // { field: 'FileUploadPath', headerName: 'File Upload Path' },
    { field: 'sucessRecord', headerName: 'Success Record' },
    { field: 'TotalRecordsInFile', headerName: 'Total Records In File' },
    { field: 'NoofException', headerName: 'Number Of Exception',minWidth: 175, cellRenderer: TotalValueRenderer  },
    { field: 'NoOfBadRecords', headerName: 'Number Of Bad Records' },
    { field: 'BadRecordsFileName', headerName: 'Bad Records File Name' },
    { field: 'BadRecordsFilePath', headerName: 'Bad Records File Path' },
    { field: 'UploadedOn', headerName: 'Uploaded On' },
    { field: 'reconstatus', headerName: 'Recon Status' },
    // {
    //   field: 'Download File', headerName: 'Download File', resizable: true, cellRenderer: BtnCellRenderer, cellRendererParams: [
    //     {
    //       clicked: async (field: any, param: any) => {
    //          
    //         this.downloadRefundFile('', param.data.FileUploadPath);
    //       },
    //       buttonIconClass: 'icon-download-cloud'
    //     }
    //   ]
    // },
    {
      field: 'action', headerName: 'Start Recon', resizable: true, cellRenderer: BtnCellRenderer, cellRendererParams: [
        {
          clicked: async (field: any, param: any) => {
             
            this.StartRecon(param.data);
          },
          buttonIconClass: 'icon-navigation'
        },
        {
          clicked: async (field: any, param: any) => {
            debugger
            // this.tableInfo = param.data
            // await this.modalDeleteComponent.open();
            this.alertService.confirmBox(this.DeleteAccount(param.data.FileId), {}, {
              html: "Record has been deleted.!"
            }, () => {
              this.search(this.ReconProgressReportform.value);
            })

          },
          buttonIconClass: 'icon-trash'
        },
      ]
    },


  ];
  // displayColumnLabel(fieldValue: any) {
  //   if (fieldValue) {
  //     return fieldValue; // do something you want to do with value (modifications)
  //   }
  //   return 'default value';
  // }
  public rowDatang: any = [];
  currentPage: number = 1;
  pageSize: number = 10;
  rowData: any[];
  collectionSize: number = 0;
  tableSelectedColumn: ColDef[] = [...this.columnDefs];
  Actiondata: any;
  private gridApi!: GridApi;
  private filterObj: any = {};


  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 170,
    filter: false,
    resizable: true
  };
  SingleRow: any;
  Resdata: any;
  ReconProgressResponse: any=false;
  reconProgressResponse: any;
  isForm1Submitted: Boolean = false;
  SPData: any;
  ReconDate: string | null;
  fileType: any;
  fileInitial: any;
  Recondata: any;
  reconmessage: any;
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();

  DeleteAccount(ID: any) {
    debugger
    let data = {
      "FileId":  ID.toString()
    }

    return this.apiHttpService
      .post(
        `${API_URL}/deletereconfile`, data
      );

  }
  downloadRefundFile(fileName: any, filePath: any) {
    this.fileType = filePath.split('.').pop();
    this.fileInitial = filePath.split('.')[0].split('/').pop()
    const formData = new FormData();
    formData.append('urlfile', filePath);
    formData.append('docname', '');
    this.reconService.downlaodimage(formData).subscribe((res: any) => {
      var response = res;
      var random = Math.floor(Math.random() * 10000000000 + 1);
      var today = new Date();
      const linkSource = 'data:application/' + this.fileType + ';base64,' + response.Data;
      const downloadLink = document.createElement("a");
      const NewfileName = "Rewardoo_" + today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2) + "-" + random.toString().slice(-4) + this.fileInitial + "." + this.fileType;
      downloadLink.href = linkSource;
      downloadLink.download = NewfileName;
      downloadLink.click();
    })


  }

  constructor(private apiHttpService: ApiHttpService, private reconService: ReconManagementService, private datepipe: DatePipe, private alertService: AlertService, private reconservice: ReconServiceService) {
    this.ReconProgressReportform = new FormGroup({
      Sp: new FormControl(''),
      reconDate: new FormControl('', [Validators.required]),


    })
  }

  get form1() {
    return this.ReconProgressReportform.controls;
  }

  ngOnInit(): void {
    this.ServiceProvide();
    this.isForm1Submitted = false
   
    this.modalConfigBlocked = {
      modalTitle: "Recon exception",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
  }
  buttonView() {
    
  //  var val = $('#reconId').val();
  //  document?.getElementById('reconId')?.value
  var val = (<HTMLInputElement>document?.getElementById('reconId'))?.value;
    this.BlockedmerchantSelectEvent.emit( val);
    return  this.modalblockedComponent.open();
    
    // alert(`${this.cellValue} view won!`);
}
  onGridReady(params: GridReadyEvent<any>) {

    var date = new Date()
    let Reconprogressdata = {
      "ServiceId": "",
      "ReconDate": this.datepipe.transform(date, 'yyyy/MM/dd')
    }

    this.reconservice.getReconProgressReports(Reconprogressdata).subscribe((data: any) => {
      this.rowData = data || []
      this.collectionSize = data?.length || 0
      this.gridApi = params.api;
      this.gridApi.setColumnDefs(this.columnDefs);
      this.gridApi.getFilterInstance('age', (filterParam) => {
      })
      this.gridApi.showLoadingOverlay();
      // this.rowData.length>0?this.search({Sp:this.SPData,reconDate:this.ReconDate}):[]

      // return this.reconservice.getReconProgressReports(formData, this.pageSize, (this.currentPage - 1))

      //   .subscribe((data: any) => (this.rowData = data?.data || data, this.collectionSize = data?.totalCount || data?.length));



    })
  }
  StartRecon(fieldData: any) { 
    if (fieldData.statuscode != "0") {
      this.alertService.errorAlert({
        text: "Recon already in process or completed"
      })
      // this.rowData = []
      // this.reconProgressResponse = false
       return
    }
    let serviceprovidedata = {
      "FileId": fieldData.FileId.toString()
    }
    this.apiHttpService
      .post(`${API_URL}/startRecon`, serviceprovidedata)
      .subscribe((res) => {
        this.Recondata = res
        console.log(res)
        this.reconmessage = res;
        if (this.reconmessage.status == "true") {
          this.alertService.successAlert(this.reconmessage.message)

        }



       
      });

  }

  async onRowClicked(param: RowClickedEvent | any) {

    this.SingleRow = param.data
    // await this.modalDeleteComponent.openData(this.SingleRow)

  }

  onRowDoubleClicked(param: RowClickedEvent | any) {
    param.node.setExpanded(!param.node.expanded);
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
    this.gridApi.paginationGoToPage(param - 1)
  }
  onPageSizeChanges($event: Event) {

    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();


    //  this.reconservice.getReconList(this.pageSize, (this.currentPage - 1))
    // .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.data || data.merchants || data, this.collectionSize = data.totalCount || data.totalRecords, this.gridApi.applyTransaction({add: this.rowData})));

  }

  //call api serviceProvide dropdown
  ServiceProvide() {

    let serviceprovidedata = {
      "Type": "5",
      "Value": ""
    }
    this.apiHttpService
      .post(`${API_URL}/GetDropdown`, serviceprovidedata)
      .subscribe((res) => {
        this.Resdata = res
      });
  }

  search(formdata: any) { debugger
    if (this.ReconProgressReportform.valid) {
      this.SPData = formdata.Sp
      this.ReconDate = this.datepipe.transform(formdata.reconDate, 'yyyy/MM/dd')
      let Reconprogressdata = {
        "ServiceId": formdata.Sp,
        "ReconDate": this.datepipe.transform(formdata.reconDate, 'yyyy/MM/dd')
      }
    this.rowData=[]
    this.loading = true
    document?.getElementById('loading')?.classList.add("spinner-border")
    document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.reconservice.getReconProgressReports(Reconprogressdata).subscribe((data: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")

        if(data.Status=="false")
        {
          this.alertService.errorAlert({
            html:data.Message
          })
          this.reconProgressResponse=false
          return
        }
         
        this.reconProgressResponse = data;
        this.rowData = data
        

      })
      
    }

    this.isForm1Submitted = true;

  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  fun(id: any) {
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id: any) {
    document?.getElementById(id)?.classList.remove("hey")
  }



}
