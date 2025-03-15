import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { environment } from 'src/environments/environment';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  loading: boolean = false
  userForm: FormGroup
  Search_By: any = []
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

  refundTypeData: any;
  refundStatusData: any;

  refundStatusdata: any = false;
  submitForm1: boolean = false

  currDate: any = new Date();
  pastDate: any = new Date("2000-01-01");
  columnDefsCopy: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  tableSelectedColumn: ColDef[] = [...(this.columnDefs.filter((col) => !col?.hide))];
  userdata: any;
  tableInfo: any;
  showId: any;
  dropdownlist: any;
  filterObj: any;
  updateValue: any;
  isSubmitted: boolean = false



  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService) {
    this.userForm = fb.group({
      UserID: [, [Validators.required,Validators.maxLength(100),Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      UserName: [, [Validators.required,Validators.maxLength(100),Validators.pattern('^[a-zA-Z0-9 ]*$')]],
      EmailId: [, [Validators.required,Validators.maxLength(100),Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      ContactNo: [, [Validators.required,Validators.maxLength(10),Validators.pattern("[123456789][0-9]{9}")]],
      Password: [, [Validators.required,Validators.maxLength(100)]],
      Role: [, [Validators.required,Validators.maxLength(100)]]
    })

  }

  ngOnInit(): void {
    this.columnDefs = [
      { field: 'userid', tooltipField: 'userid', headerName: 'USER ID', filter: true },
      { field: 'fullName', tooltipField: 'fullName', headerName: 'User Full Name', filter: true },
     // { field: 'roleid', tooltipField: 'roleid', headerName: 'Role', filter: true },
      { field: 'rolename', tooltipField: 'rolename', headerName: 'Role Name', filter: true },
      { field: 'email_id', tooltipField: 'email_id', headerName: 'Email ID', filter: true },
     // { field: 'password', tooltipField: 'password', headerName: 'password', filter: true },
      { field: 'contactNo', tooltipField: 'contactNo', headerName: 'Contact Number', filter: true },


      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.tableInfo = data.data
              this.setValue(this.tableInfo)
              // this.BlockedmerchantSelectEvent.emit(this.tableInfo);
              // return await this.modalblockedComponent.open();

            },
            buttonIconClass: 'icon-edit-2',
          },
          {

            clicked: async (field: any, param: any) => {

              this.alertService.confirmBox(this.delete(param.data), {}, {
                html: "Record has been deleted.!"
              }, () => {
                this.userlist();
              })

            },
            buttonIconClass: 'icon-trash'
          },
        ]
      },

    ];

    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.userlist()
    this.getroledorpdown()

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




  dataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }



  onGridReady(params: any) {
    debugger
    this.gridApi = params.api;
    // let data = {
    //   "admin": "admin"
    // }
    // this.masterservice.getuserlist(data).subscribe((res: any) => {
    //   this.userdata = res


    // })

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



  resetform() {
    this.userForm.reset()
    this.isSubmitted=false

  }


  onSubmit(formvalue: any) {

    let data = {
      "userId": formvalue.UserID || '',
      "fullName": formvalue.UserName || '',
      "emailId": formvalue.EmailId,
      "contactNo": formvalue.ContactNo || '',
      "roleId": formvalue.Role || '',
      "password": formvalue.Password || '',

    }


    let updateData = {
      "userId": formvalue.UserID || '',
      "fullName": formvalue.UserName || '',
      "emailId": formvalue.EmailId || '',
      "contactNo": formvalue.ContactNo || '',
      "roleId": formvalue.Role || '',
      "password": formvalue.Password || ''
    }




    if(this.userForm.valid)
    {

     

      if (!this.updateValue) {
        this.loading = true
        document?.getElementById('loading')?.classList.add("spinner-border")
        document?.getElementById('loading')?.classList.add("spinner-border-sm")
        this.masterservice.insertuser(data).subscribe((res: any) => {
          this.loading = false
          document?.getElementById('loading')?.classList.remove("spinner-border")
          document?.getElementById('loading')?.classList.remove("spinner-border-sm")
          if (res.Status ==true) {
            this.alertService.successAlert(res.Message)
          }
          else{
            this.alertService.errorAlert({html:res.Message})
          }
          this.userlist()
          this.userForm.reset()
          this.isSubmitted=false
  
        })
  
      }
  
      else {
  
        this.loading = true
        document?.getElementById('loading')?.classList.add("spinner-border")
        document?.getElementById('loading')?.classList.add("spinner-border-sm")
        this.masterservice.Updateuser(updateData).subscribe((res: any) => {
          this.loading = false
          document?.getElementById('loading')?.classList.remove("spinner-border")
          document?.getElementById('loading')?.classList.remove("spinner-border-sm")
          if (res.Status == 'success') {
            this.alertService.successAlert(res.Reason)
          }
          this.userlist()
          this.userForm.reset()
          this.isSubmitted=false
          document.getElementById('UserID')?.removeAttribute('disabled')
  
        })
  
      }

    }


    else{
      if (this.userForm.controls['Role'].invalid ) {
        document?.getElementById('Role')?.classList.add("hello")
      } 

      else {
        document?.getElementById('Role')?.classList.remove("hello")
      }
    }


  


    this.isSubmitted = true


  }


  userlist() {
    // this.gridApi = params.api;
    let data = {
      "admin": "admin"
    }
    this.masterservice.getuserlist(data).subscribe((res: any) => {
      this.userdata = res
      this.showId = res
      this.rowData = this.userdata,
        this.collectionSize = this.userdata?.totalCount || this.userdata?.length;


    })

  }


  setValue(editvalue: any) {
    debugger
    this.updateValue = editvalue
    this.userForm.patchValue({
      UserID: editvalue.userid,
      UserName: editvalue.fullName,
      Password: editvalue.password,
      Role: editvalue.roleid,
      ContactNo: editvalue.contactNo,
      EmailId: editvalue.email_id
      // email_id

    });

    // this.userForm.get('UserID')?.disable();
    document.getElementById('UserID')?.setAttribute('disabled', '')



  }



  getroledorpdown() {
    debugger
    let data = {
      "admin": "admin"
    }
    this.masterservice.getroledorpdown(data).subscribe((res: any) => {
      this.dropdownlist = res



    })
  }



  delete(Id: any) {
    debugger

    var ID = Id.userid


    var data = {
      "USERID": ID
    }
    return this.masterservice.deleteUser(data)
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
    // console.log("onFilterModified----->",param);
    const temp = param?.filterInstance;
    this.filterObj[param?.column?.colId] = temp;
  }

  onFilterOpened(param: FilterOpenedEvent | any) {
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

  OnlyNumbersAllowed(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58) || charCode == 46;

  }



}
