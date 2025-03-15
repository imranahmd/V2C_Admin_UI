import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ColDef, GridApi, PaginationChangedEvent } from 'ag-grid-community';
import { MasterService } from '../../master/master.service';
import { ApiHttpService } from "../../../../_services/api-http.service";
import { environment } from 'src/environments/environment';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { AlertService } from 'src/app/_services/alert.service';

const { API_URL } = environment;


@Component({
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.scss']
})
export class TransactionViewComponent implements OnInit {
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  TransactionData: any;
  private gridApi!: GridApi;
  private filterObj: any = {};
  private merchantValue: null;
  private merchantresponse: any;
  private queryParams: any = {};
  public columnDefs: ColDef[] = []
  public tableSelectedColumn: ColDef[] = [...this.columnDefs];

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  public rowData!: any[];
  tablecolumn: any;
  currentPage: number = 1;
  pageSize: number = 10;
  globalSearch: string = '';
  collectionSize: number = 0;
  SingleRow: any;
  fileType: any;
  fileInitial: any;

  constructor(private masterService: MasterService, private apiHttpService: ApiHttpService,private alertService:AlertService) { }

  ngOnInit(): void {
    debugger


    this.onMerchantMId.subscribe((res) => {
      debugger
      this.TransactionData = res
      let data = {
        "trnsactionId": this.TransactionData
      }

      this.apiHttpService
        .post(
          `${API_URL}/audittrail-List?pageSize=${this.pageSize}&page=${(this.currentPage - 1)}`, data
        )
        .subscribe((data: any) => {
          debugger
          this.rowData = data.Data
        })
      console.log(this.TransactionData)
    })
    this.columnDefs = [
      { field: 'LifeCycleStatus', tooltipField: 'Life Cycle Status', headerName: 'Life Cycle Status' },
      // { field: 'FileName', tooltipField: 'File', headerName: 'File' },
      {
        field: 'FileName', headerName: 'File Download', width: 30, cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (event: any, param: any) => {
              debugger
              var fileName
              var filePath = param.data.FileName
              if (filePath == '') {
                this.alertService.errorAlert({
                  html:'File does not exist'
                })
              } else {
                this.downloadFile(fileName, filePath)
              }

            },
            buttonIconClass: 'icon-download-cloud'
          },
        ]
      },
      { field: 'Remarks', tooltipField: 'Remark', headerName: 'Remark' },
      { field: 'AddedOn', tooltipField: 'Added On', headerName: 'Added On' },
      { field: 'AddedBy', tooltipField: 'Added By', headerName: 'Added By' },

    ];




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
      const NewfileName = "Rewardoo_" + today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2) + "-" + random.toString().slice(-4) + this.fileInitial + "." + this.fileType;

      downloadLink.href = linkSource;
      downloadLink.download = NewfileName;
      downloadLink.click();
    })


  }

  onGridReady(params: any) {
    debugger
    //this.gridApi = params.api;

    this.rowData = []
    //  [
    //   {
    //     'LifeCycleStatus': "RNS",
    //     'File': "Transactions.txt",
    //     "Remark": "Added Successfully",
    //     "Addedby": "Admin",
    //     "Addedon": "2023-03-14 15:01:01"
    //   }
    // ]

    this.gridApi = params.api;




  }

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
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




}
