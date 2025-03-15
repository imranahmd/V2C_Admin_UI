import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChargebackServiceService } from '../chargeback-service.service';
import { AlertService } from 'src/app/_services/alert.service';
import { environment } from 'src/environments/environment';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { LoaderService } from 'src/app/_services/loader.service';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

@Component({
  selector: 'app-download-view',
  templateUrl: './download-view.component.html',
  styleUrls: ['./download-view.component.scss']
})
export class DownloadViewComponent implements OnInit {
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  @Output()closeModal: EventEmitter<any> = new EventEmitter<any>();
  transactionId: any;
  data: any;
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
  allviewdata: any;


  constructor(private chargeBackService: ChargebackServiceService, private alertService: AlertService,private loaderService: LoaderService) { }

  ngOnInit(): void {

    this.onMerchantMId.subscribe((res: any) => {
      debugger
      this.rowData=[]
      this.allviewdata=res
      this.transactionId = res.TxnId
    
     
      this.GetComments() 
     
      this.columnDefs = [

        { field: 'Merchant_Remark', tooltipField: 'Merchant_Remark', headerName: 'Merchant Remark', filter: true },
        { field: 'Merchant_id', tooltipField: 'Merchant_id', headerName: 'Merchant ID', filter: true },
        { field: 'Txn_Id', tooltipField: 'Txn_Id', headerName: 'Transaction ID', filter: true },
        { field: 'AddedOn', tooltipField: 'AddedOn', headerName: 'Added On', filter: true },
        { field: 'Admin_Remark', tooltipField: 'Admin_Remark', headerName: 'Admin Remark', filter: true },
        { field: 'AddedBy', tooltipField: 'AddedBy', headerName: 'Added By', filter: true },
       
  
        // {
        //   field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
        //     {
        //       clicked: async (field: any, data: any, param: any, formvalue: any) => {
        //         debugger
        //         this.download = data.data.Uploaded_File_Name
  
        //         this.download1(this.download)
  
        //       },
        //       buttonIconClass: 'icon-download-cloud',
  
  
        //     },
  
  
  
  
        //   ]
        // },
  
  
  
  
  
      ];
  
      this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
      this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    })
   
   
  }


  GetComments() {debugger
    let data = {
      "txnId": this.transactionId
    }
    this.loaderService.showLoader();
    this.chargeBackService.getComments(data).subscribe((res:any)=>{
      this.loaderService.hideLoader();
      this.data=res
   
      if(this.data?.Error)
      {
        this.alertService.errorAlert({html:this.data?.Error[0]})
        this.closeModal.emit({
          showModal: false
        });
        return
      }
      else{
        this.rowData = this.data;
        // this.showgrid=this.data
        this.collectionSize = this.data.totalCount || this.data.length;
      }
     
    })

  }



  download1(data: any) {debugger

    if(data=="No Document"){
      this.alertService.errorAlert({html:data})
      return
    }
  
    else{
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


  // dwonload()
  // {debugger
  //   this.download1('')

  // }

  


}
