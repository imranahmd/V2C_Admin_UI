import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { environment } from 'src/environments/environment';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { MasterService } from '../../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { csvToJson } from 'src/app/util/csvjson';
import Swal from 'sweetalert2';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'

const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

export interface UserAudit {
  id: number;
  userName: string;
  ipAddrss: string;
  updatedDate: string;
  actionName: string;
  auditData: string;
}

@Component({
  selector: 'app-user-monitoring',
  templateUrl: './user-monitoring.component.html',
  styleUrls: ['./user-monitoring.component.scss']
})
export class UserMonitoringComponent implements OnInit {
  loading: boolean = false
  isForm1Submitted: Boolean;

  settlementForm: FormGroup;
  // public rowData!: any[];
  // public rowData!: UserAudit[];
  public rowData: any[] = [];


  gridApi: any;
  collectionSize: number = 0;
  currentPage: number = 1;
  pageSize: number = defaultPageSize || 10;
  pageSizeArr: any = defaultPageSizeArr;
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    filter: false,
    resizable: true
  };
  public columnDefs: ColDef[] = [];
  tableInfo: any;
  columnDefsCopy: ColDef[] = [];
  tableSelectedColumn: ColDef[] = [];
  filterObj: any;
  Resdata: any;
  public searchUserName: string = ''; // Bind this to your input
  public searchDate: string = ''; // Bind this to your input

  showGrid: boolean = false;

  constructor(
    private masterservice: MasterService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private apiHttpService: ApiHttpService,
    private http: HttpClient
  ) {
    this.settlementForm = this.fb.group({
      userId: [null, Validators.required],  // Make userId required
      date: [null, Validators.required],      // Make date required
    });
    
    
  }

  ngOnInit(): void {
    debugger
    this.columnDefs = [
      { field: 'userName', headerName: 'User Name', filter: true },
      { field: 'ipAddrss', headerName: 'IP Address', filter: true },
      { field: 'updatedDate', headerName: 'Updated Date', filter: true },
      { field: 'actionName', headerName: 'Action Name', filter: true },
      { field: 'auditData', headerName: 'Request Data', filter: true },
      { field: 'data_new', headerName: 'Response Data', filter: true }
  ];
  
    this.columnDefsCopy = [...this.columnDefs.filter(col => !col?.hide)];
    this.tableSelectedColumn = [...this.columnDefs.filter(col => !col?.hide)];
    this.GetUser();
    this.fetchData(); 
    
   }

   updateSelectedTimeslots(event: any) {
    if (event.target.checked) {
      if (this.tableSelectedColumn.indexOf(this.columnDefs[parseInt(event.target.value)]) < 0) {
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

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  onPaginationChange(param: PaginationChangedEvent | any) {
    this.gridApi.paginationGoToPage(param - 1); // AG Grid uses 0-based indexing
  }

  onPageSizeChanges($event: Event) {
    this.gridApi.paginationSetPageSize(this.pageSize);
    this.currentPage = 1; // Reset to first page when page size changes
  }

  // onPaginationChange(param: PaginationChangedEvent | any) {
  //   debugger
  //   console.log(param)
  //   this.gridApi.paginationGoToPage(param - 1)
  // }

  // onPageSizeChanges($event: Event) {
  //   $event.preventDefault();
  //   this.gridApi.paginationSetPageSize(this.pageSize)
  //   this.gridApi.refreshCells()
  // }

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
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {
    console.log("onFilterOpened----->", param);
  }

  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
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


  fetchData(userName: string = '', date: string = '', page: number = 1, size: number = this.pageSize): void {
    this.loading = true;
    const params = new URLSearchParams();
    params.set('user', userName);
    params.set('date', date);
    params.set('page', (page - 1).toString());
    params.set('size', size.toString());

    const apiUrlWithParams = `${API_URL}/AuditTail?${params.toString()}`;

    this.apiHttpService.post(apiUrlWithParams, {}).subscribe(
      (data: any) => {
        this.rowData = data; // Set rowData directly if API returns array
        this.collectionSize = data.length; // Update total records count
        this.loading = false;
        this.showGrid = true;
      },
      (error: any) => {
        console.error('Error fetching data:', error);
        this.alertService.error('Error fetching user audit data');
        this.loading = false;
      }
    );
}


  GetUser() {
    const userData = { "Type": "60", "Value": "" };
    this.loading = true;

    this.masterservice.GetUser(userData).subscribe((res: any) => {
      this.Resdata = res;
      this.loading = false;
    }, (error: any) => {
      this.loading = false;
      this.alertService.error('Error fetching user data');
    });
  }

  addSettlement(formValue: any) {
  this.isForm1Submitted = true;

  if (this.settlementForm.invalid) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: 'Both User and Date are required!',
      confirmButtonText: 'Okay'
    });
    return;
  }

  const { userId, date } = formValue;
  this.fetchData(userId, date);
}



  onGridReady(params: any) {
    this.gridApi = params.api; // Capture the grid API
  }
  
  restForm() {
    this.settlementForm.reset();
    this.rowData = []; // Clear row data on reset
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


  onExportCSV() {
    debugger
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
            // tempRec[col?.field.trim()] = (curr[`"${col?.field.trim()}"`] || curr[`"${col?.headerName?.trim()}"`])
            tempRec[col?.field.trim()] = (curr[col?.field.trim()] || curr[col?.headerName?.trim()])
          }

        }
      })
      expData.push(tempRec);
    })
    this.exportAsExcelFile(this.rowData, fileName)
  }
  
}
