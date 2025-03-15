import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MasterService } from '../master.service';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { csvToJson } from 'src/app/util/csvjson';
const EXCEL_EXTENSION = '.xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { AlertService } from 'src/app/_services/alert.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { ModalConfig } from 'src/app/common/modal/modal.config';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  @Output() BlockedmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() AddmerchantSelectEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalbloked') private modalblockedComponent: ModalComponent;

  modalConfigBlocked: ModalConfig;
  Status: any
  addRoleForm: FormGroup
  RoleList: any;
  gridApi: any;
  collectionSize: number = 0;
  currentPage: number = 1;
  //pageSize: number = 10;
  pageSize: number = defaultPageSize || 10;
  submit1:boolean=false
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
  tableInfo: any;

  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService,) {
    this.Status = [{ FieldValue: '1', FieldText: 'Active' },
    { FieldValue: '2', FieldText: 'Inactive' },]

    this.addRoleForm = fb.group({
      roleName: ['', [Validators.required]],
      roleDescription: ['', [Validators.required]],
      Status: [, [Validators.required]]

    })
  }



  ngOnInit(): void {
    this.roleList()
    this.columnDefs = [

      { field: 'ROLEID', tooltipField: 'ROLEID', headerName: 'Role ID',filter: true },
      { field: 'ROLENAME', tooltipField: 'ROLENAME', headerName: 'Role Name',filter: true },
      { field: 'ROLEDESCRIPTION', tooltipField: 'ROLEDESCRIPTION', headerName: 'Role Description',filter: true },
      { field: 'Status', tooltipField: 'Status', headerName: 'Status',filter: true },
      {
        field: 'action', headerName: 'Action', resizable: true,width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {debugger
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
            clicked: async (field: any, param: any) => {
              // this.tableInfo = param.data
              // this.deleteRole(this.tableInfo)
              this.alertService.confirmBox(this.deleteRole(param.data.ROLEID), {}, {
                html: "Record has been deleted.!"
              }, () => {
                this.roleList();
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
      modalTitle: "Add Role",
      modalSize: 'lg',
      hideDismissButton(): boolean {
        return true
      },
      hideCloseButton(): boolean {
        return true
      }
    }

  }

  closeModalBlocked($event: any) {
    if (!$event.showModal) {
      this.modalblockedComponent.close();
     this.roleList();
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

  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  addRole(formData: any) {
    debugger

    let roleData = {

      "RoleName": formData.roleName,
      "RoleDescription": formData.roleDescription,
      "StatusRole": formData.Status

    }

    if(this.addRoleForm.valid)
    {
      document?.getElementById('Status')?.classList.remove("hello")
      this.masterservice.createRole(roleData).subscribe((res: any) => {
        if (res.Status == 'success') {
          this.alertService.successAlert(res.Reason)
        }
        this.roleList()
        this.reset()
  
      })
    }else
    document?.getElementById('Status')?.classList.add("hello")


    this.submit1=true

  }

  roleList() {
    var data = {
      "admin": "admin"
    }

    this.masterservice.getRole(data).subscribe((res: any) => {
      this.RoleList = res
      this.rowData = this.RoleList?.data || data;
      this.collectionSize = this.RoleList.data?.totalCount || this.RoleList.data?.length;
      ;
    })

  }

  deleteRole(Id: any) {
    debugger
    var roleId = Id.toString()

    let deleteData = {
      "RoleId": roleId

    }
    return this.masterservice.DeleteRole1(deleteData)
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

  onPaginationChange(param: PaginationChangedEvent | any) {
    console.log(param)
    this.gridApi.paginationGoToPage(param - 1)
  }

  onPageSizeChanges($event: Event) {
    $event.preventDefault();
    this.gridApi.paginationSetPageSize(this.pageSize)
    this.gridApi.refreshCells()
  }


  onFilterChange(param: FilterChangedEvent | any) {debugger
    // if (this.merchantMDRform.controls['merchantId'].value === "") {
    //   this.merchantValue = null
    // } else {
    //   this.merchantValue = this.merchantMDRform.controls['merchantId'].value
    // }
    // let Requestbody = {
    //   "merchantId": this.merchantId || this.merchantValue
    // }

    // // this.rowData.length = 0
    // this.gridApi.applyTransaction({ remove: this.rowData })
    // this.gridApi.showLoadingOverlay();

    // const self = this;
    // // setTimeout(()=>{
    // self.apiHttpService
    //   .post(
    //     `${API_URL}/get-merchantmdrlist?pageSize=${this.pageSize}&page=${(this.currentPage - 1)}`, Requestbody
    //   )
    //   // @ts-ignore
    //   .subscribe((data) => {debugger
    //     self.gridApi.applyTransaction({
    //       add: data?.filter((dt: any) => {
    //         if (dt.age == self.filterObj?.age?.appliedModel.filter)
    //           return dt;
    //       })
    //     });
  
    //     this.collectionSize = data?.totalCount || data?.length
    //   });
    // }, 1000)
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
  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }
  reset() {
    this.addRoleForm.reset()
    document?.getElementById('Status')?.classList.remove("hello")
    this.submit1=false
  }

}
