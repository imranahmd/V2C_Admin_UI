import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { csvToJson } from 'src/app/util/csvjson';
import { environment } from 'src/environments/environment';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
const EXCEL_EXTENSION = '.xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.scss']
})
export class ServiceProviderComponent implements OnInit {
  @Output() AddmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;
  serviceProviderForm: FormGroup
  submit1: boolean = false
  gridApi: any;
  collectionSize: number = 0;
  currentPage: number = 1;
  //pageSize: number = 10;
  pageSize: number = defaultPageSize || 10;
  modalConfigBlocked: ModalConfig;
  pageSizeArr: any = defaultPageSizeArr;
  public rowData!: any[];
  public columnDefs: ColDef[] = []
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  private filterObj: any = {};
  showhide: boolean = false;
  tableInfo: any;
  spName: any = '';
  serviceProviderData: any;



  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService,) {
    this.serviceProviderForm = fb.group({
      spId: [, []]
    })
  }

  ngOnInit(): void {

    this.columnDefs = [

      { field: 'sp_id', tooltipField: 'sp_id', headerName: 'ID', filter: true },
      { field: 'sp_name', tooltipField: 'sp_name', headerName: 'SP Name', filter: true },
      { field: 'master_mid', tooltipField: 'master_mid', headerName: 'Master MID', filter: true },
      { field: 'master_tid', tooltipField: 'master_tid', headerName: 'Master TID	', filter: true },
      { field: 'api_key', tooltipField: 'api_key', headerName: 'API Key	', filter: true },
      {
        field: 'action', headerName: 'Action', resizable: true,width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.tableInfo = data.data
              this.BlockedmerchantSelectEvent.emit(this.tableInfo);
              return await this.modalblockedComponent.open();

            },
            buttonIconClass: 'icon-edit-2',


          },




        ]
      },



    ];
    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.modalConfigBlocked = {
      modalTitle: "Service Provider Information",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }

    this.serviceProvider()
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
    var fileName = 'Rewardoo_' + referenceId
    var params = {
      skipHeader: false,
      skipFooters: true,
      allColumns: true,
      onlySelected: false,
      suppressQuotes: true,
      fileName: fileName + '.csv',
      columnSeparator: ','
    };

    const csvString = this.gridApi.getDataAsCsv();
    console.log("=======>", csvString);
    const convJson = csvToJson(csvString);
    console.log("=======>", convJson);
    const expData: any[] = [];
    (convJson || []).forEach((curr: any) => {
      const tempRec: any = {}
      this.tableSelectedColumn.forEach((col) => {
        // @ts-ignore
        if (col?.field != "actions") {
          if (col?.field) {
            // @ts-ignore
            tempRec[col?.field.trim()] = (curr[`"${col?.field.trim()}"`] || curr[`"${col?.headerName?.trim()}"`]).replace(/\"/g, '')
          }

        }
      })
      expData.push(tempRec);
    })
    // this.exportAsExcelFile(expData,fileName)
  }

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }


  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    
  }

  onPaginationChange(param: PaginationChangedEvent | any) {debugger

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
    this.gridApi.applyTransaction({remove: this.rowData})
    this.gridApi.showLoadingOverlay();
    this.gridApi.applyTransaction({add: this.rowData})
    // this.Services.GetRiskActionLogs(this.pageSize, (this.currentPage - 1))
    //   .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.data || data.merchants || data,
    //    this.collectionSize = data.totalCount || data.totalRecords,

    //     ));

  }


  onFilterChange(param: FilterChangedEvent | any) {debugger
  
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

  onFilterModified(param: FilterModifiedEvent | any) {debugger
    // console.log("onFilterModified----->",param);
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {debugger
    console.log("onFilterOpened----->", param);
  }

  async onAddNew($event: any) {
    // this.sidebarComponent.sidebarToggler.nativeElement.click();
    // await this.sideNavService.toggelEvent$.emit($event)
    // await this.sideNavService.toggle($event);
    this.AddmerchantSelectEvent.emit('');
    this.modalblockedComponent.open();
    // await this.router.navigate(['/merchants/merchant-creation'])
    // return await this.modalAddComponent.open();
  }



  closeModalBlocked($event: any) {debugger
    if (!$event.showModal) {
      this.modalblockedComponent.close();
      this.refreshGrid();
    }
  }

  refreshGrid() {
    let data = {

      "sp_name": this.spName?.toString() || ''

    }

    if (this.serviceProviderForm.valid) {
      this.masterservice.Getsplist(data).subscribe((res: any) => {
        this.showhide = res.data
        this.rowData = res?.data || data;
        this.collectionSize = res.data?.totalCount || res.data?.length;
      })

    }

  }


  onSubmit(formvalue: any) {
    debugger
    this.spName = formvalue.spId
    let data = {

      "sp_name": this.spName?.toString() || ''

    }

    if (this.serviceProviderForm.valid) {
      this.masterservice.Getsplist(data).subscribe((res: any) => {
        this.showhide = res.data
        this.rowData = res?.data || data;
        this.collectionSize = res.data?.totalCount || res.data?.length;
      })

    }
    this.submit1 = true
  }



serviceProvider()
{
  let data={
    "Type":"5",
    "Value":""
  }
  this.masterservice.getDropDown(data).subscribe((res:any)=>{
    this.serviceProviderData=res
  })
}



  reset() {
    this.serviceProviderForm.reset()
    this.submit1 = false
    this.showhide = false
  }

}

