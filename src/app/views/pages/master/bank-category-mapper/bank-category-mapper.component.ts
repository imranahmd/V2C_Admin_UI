import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
const EXCEL_EXTENSION = '.xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { csvToJson } from 'src/app/util/csvjson';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
@Component({
  selector: 'app-bank-category-mapper',
  templateUrl: './bank-category-mapper.component.html',
  styleUrls: ['./bank-category-mapper.component.scss']
})
export class BankCategoryMapperComponent implements OnInit {

  @Output() AddmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;

 serviceProviderForm:FormGroup
  submit1:boolean=false
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
  spName: any;
  gridApi: any;
  collectionSize: number = 0;
  currentPage: number = 1;
  //pageSize: number = 10;
  pageSize: number = defaultPageSize || 10;
  modalConfigBlocked: ModalConfig;
  pageSizeArr: any = defaultPageSizeArr;
  public rowData!: any[];
  showhide: any;
  tableInfo: any;
  loading: boolean=false;


  constructor(private fb:FormBuilder,private masterservice: MasterService, private alertService: AlertService) { 
    this.serviceProviderForm=fb.group({
      bankId:[,[]]
    })
  }

  ngOnInit(): void {
    this.columnDefs = [

      { field: 'id', tooltipField: 'id', headerName: 'Id', filter: true },
      { field: 'merchant_id', tooltipField: 'merchant_id', headerName: 'Merchant Id', filter: true },
      { field: 'sp_name', tooltipField: 'sp_name', headerName: 'Sp Name', filter: true },
      { field: 'bank_name', tooltipField: 'bank_name', headerName: 'Bank Name', filter: true },
      { field: 'business_category', tooltipField: 'business_category', headerName: 'Business Category', filter: true },
      { field: 'min_mdr_amount', tooltipField: 'min_mdr_amount', headerName: 'Min MDR Amount', filter: true },
      { field: 'base_rate', tooltipField: 'base_rate', headerName: 'Base Rate', filter: true },
      { field: 'mdr_type', tooltipField: 'mdr_type', headerName: 'MDR Type', filter: true },
      
      
      { field: 'instrument_id', tooltipField: 'instrument_id', headerName: 'Instrument Id', filter: true },
      { field: 'min_amt', tooltipField: 'min_amt', headerName: 'Min Amount', filter: true },
      { field: 'max_amt', tooltipField: 'max_amt', headerName: 'Max Amount', filter: true },
  
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

          {
            // clicked: async (field: any, param: any) => {
            //   debugger
            //   this.tableInfo = param.data
            //   await this.modalDeleteComponent.open();
            //   this.alertService.confirmBox(this.deleteRole(param.data.ROLEID), {}, {
            //     html: "Record has been deleted.!"
            //   }, () => {
            //     this.roleList()
            //   })
            

            // },

            clicked: async (field: any, param: any) => {debugger
              // this.tableInfo = param.data
              // this.deleteRole(this.tableInfo)
              this.alertService.confirmBox(this.deletespmbankcategory(param.data.id), {}, {
                html: "Record has been deleted.!"
              }, () => {
                this.refreshGrid();
              })
            
            },
            buttonIconClass: 'icon-trash'
          },




        ]
      },



    ];
    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.modalConfigBlocked = {
      modalTitle: "Service Provider Bank Category Mapping",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }
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

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
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
      document?.getElementById('Banks')?.classList.remove("hello")
      document?.getElementById('MDRType')?.classList.remove("hello")
      document?.getElementById('serviceProviderName')?.classList.remove("hello")
      document?.getElementById('merchantId')?.classList.remove("hello")
    }
  }

  refreshGrid()
  {
    this.spName 
    let data = {

      "bank_id": this.spName || ''

    }

    if (this.serviceProviderForm.valid) {
      this.masterservice.Getbankcategoryspmlist(data).subscribe((res: any) => {
        this.showhide = res.data
        this.rowData = res?.data || data;
        this.collectionSize = res.data?.totalCount || res.data?.length;
      })

    }
  }



  onSubmit(formData:any)
  {
    this.spName = formData.bankId
    let data = {

      "bank_id": this.spName || ''

    }

    if (this.serviceProviderForm.valid) {
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.masterservice.Getbankcategoryspmlist(data).subscribe((res: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        this.showhide = res.data
        this.rowData = res?.data || data;
        this.collectionSize = res.data?.totalCount || res.data?.length;
      })

    }
    this.submit1 = true

  }

  reset()
  {

  }


  deletespmbankcategory(Id:any)
  {debugger
    let data={
      "id":Id
    }
    return this.masterservice.Deletespmbankcategory(data)
  }

}
