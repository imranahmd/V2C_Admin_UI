import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
const EXCEL_EXTENSION = '.xlsx'
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import * as FileSaver from 'file-saver';
import { csvToJson } from 'src/app/util/csvjson';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { moreThanOneWhiteSpaceValidator } from 'src/app/common/common.validators';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  addPermissionForm: FormGroup

  gridApi: any;
  collectionSize: number = 0;
  currentPage: number = 1;
  //pageSize: number = 10;
  pageSize: number = defaultPageSize || 10;

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
  permissiondata: any;
  menudata: any;
  submenudata: any;
  menuId: any;
  filterObj: any;
  loading: boolean;
  submit1: boolean = false
  Id: any;
  menuIdName: any;
  EditFlag: any = false;
  permissionId: any='';
  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService,) {
    this.addPermissionForm = fb.group({
      MenuName: [, [Validators.required,Validators.maxLength(100)]],
      submenuName: [, [Validators.required,Validators.maxLength(100)]],
      newPermission: ['', [Validators.required,moreThanOneWhiteSpaceValidator(),Validators.maxLength(100)]],
      featureDescription: ['', [Validators.required,moreThanOneWhiteSpaceValidator(),Validators.maxLength(100)]]

    })
  }

  ngOnInit(): void {

    this.columnDefs = [

      { field: 'PermissionId', tooltipField: 'PermissionId', headerName: 'Permission ID',filter:true },
      { field: 'MenuName', tooltipField: 'MenuName', headerName: 'Menu Name',filter:true},
      { field: 'SubmenuName', tooltipField: 'SubmenuName', headerName: 'Submenu Name',filter:true},
      { field: 'PermissionAction', tooltipField: 'PermissionAction', headerName: 'Features',filter:true },
      { field: 'Description', tooltipField: 'Description', headerName: 'Feature Description',filter:true },
      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right',cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.UpdatePermission(data.data)
            },
            buttonIconClass: 'icon-edit-2',


          },

          {
            clicked: async (field: any, param: any) => {
              debugger
              debugger
              // this.tableInfo = param.data
              // await this.modalDeleteComponent.open();
              this.alertService.confirmBox(this.deletePermission(param.data.PermissionId), {}, {
                html: "Record has been deleted.!"
              }, () => {
                this.permissionList()
              })



            },
            buttonIconClass: 'icon-trash'
          },


        ]
      },



    ];
    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];


    this.permissionList()
    this.getMenu()
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

  onFilterModified(param: FilterModifiedEvent | any) {
    // console.log("onFilterModified----->",param);
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {
    console.log("onFilterOpened----->", param);
  }
  onPaginationChange(param: PaginationChangedEvent | any) {
    debugger

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
    this.gridApi.applyTransaction({ remove: this.rowData })
    this.gridApi.showLoadingOverlay();
    this.gridApi.applyTransaction({ add: this.rowData })
    // this.Services.GetRiskActionLogs(this.pageSize, (this.currentPage - 1))
    //   .subscribe((data) => (console.log("****onPageSizeChange"), this.rowData = data.data || data.merchants || data,
    //    this.collectionSize = data.totalCount || data.totalRecords,

    //     ));

  }


  permissionList() {
    var data = {
      "admin": "admin"
    }
    
    this.masterservice.Getpermissionlist(data).subscribe((res: any) => {
      
    //  this.reset()
      this.permissiondata = res
      this.menuId = res.data.MenuId
      this.rowData = this.permissiondata?.data || data,
        this.collectionSize = this.permissiondata.data?.totalCount || this.permissiondata.data?.length;
    })
  }


  // permissionAdd This function use for add permission//
  permissionAdd(formvalue: any) {
    debugger
    this.menuIdName = formvalue.submenuName
    ?.toString() || ''
    if (this.addPermissionForm.valid) {
    if (!this.EditFlag) {
      var data = {
        "MenuId": this.menuIdName,
        // "MenuId":formvalue.MenuName,
        "NewpermssionName": formvalue.newPermission,
        "DescriptionName": formvalue.featureDescription
      }
      this.loading = true
    document?.getElementById('loading')?.classList.add("spinner-border")
    document?.getElementById('loading')?.classList.add("spinner-border-sm")
  
        this.masterservice.insertPermission(data).subscribe((res: any) => {
          this.loading = false
      document?.getElementById('loading')?.classList.remove("spinner-border")
      document?.getElementById('loading')?.classList.remove("spinner-border-sm")
          if (res.Status == "success") {
            this.alertService.successAlert(res.Reason)
          }
          this.permissionList()

        })
    }
    else {
     var newdata= {
        "MenuId":this.menuIdName,
        "PermissionAction":formvalue.newPermission,
        "Description":formvalue.featureDescription,
        "PermissionId":this.permissionId
    }
    this.loading = true
    document?.getElementById('loading')?.classList.add("spinner-border")
    document?.getElementById('loading')?.classList.add("spinner-border-sm")
    this.masterservice.updatePermission(newdata).subscribe((res:any)=>{
      this.loading = false
      document?.getElementById('loading')?.classList.remove("spinner-border")
      document?.getElementById('loading')?.classList.remove("spinner-border-sm")
      
      if (res.Status == "success") {
        this.alertService.successAlert(res.Reason)
      }
      this.permissionList()
      //this.addPermissionForm.reset()
      this.EditFlag = false
    })
    

    }
  }

  else{
    if (this.addPermissionForm.controls['MenuName'].invalid ) {
      document?.getElementById('MenuName')?.classList.add("hello")
    } 

    else {
      document?.getElementById('MenuName')?.classList.remove("hello")
    }

    if (this.addPermissionForm.controls['submenuName'].invalid ) {
      document?.getElementById('submenuName')?.classList.add("hello")
    } 

    else {
      document?.getElementById('submenuName')?.classList.remove("hello")
    }
  }

    this.submit1 = true
  }





  UpdatePermission(Editvalue: any) {
    debugger
    this.submenuChange( {"MenuId":Editvalue.MenuId})
    this.EditFlag = Editvalue
    this.permissionId = Editvalue.PermissionId?.toString()
    var data = this.addPermissionForm.patchValue({
      "MenuName": Editvalue.MenuId ,
      "submenuName":Editvalue.SubmenuId,
      "newPermission": Editvalue.PermissionAction,
      "featureDescription": Editvalue.Description,
      "PermissionId": Editvalue.PermissionId?.toString()
    })



  }



  deletePermission(Id: any) {
    debugger
    var permissionId = Id.toString()
    var data = {
      "PermissionId": permissionId
    }
    return this.masterservice.DeletePermission(data)
  }







  getMenu() {debugger
    var data = {
      "admin": "admin"
    }
    this.masterservice.GetMenu(data).subscribe((res: any) => {
      this.menudata = res.data

    })
  }


  submenuChange(event: any) {
    debugger
    this.Id = event.MenuId.toString()
    var data = {
      "MenuId": this.Id
    }
    this.masterservice.GetSubmenu(data).subscribe((res: any) => {
      this.submenudata = res.data
      this.addPermissionForm.controls["submenuName"].setValue(this.submenudata[0].SubmenuId)
      

    })
  }


  reset() {
    this.addPermissionForm.reset()
    this.submit1 = false
    this.EditFlag = false
    document?.getElementById('submenuName')?.classList.remove("hello")
    document?.getElementById('MenuName')?.classList.remove("hello")
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

  OnlyCharacterAllowed(event: { which: any; keyCode: any; }): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

}
