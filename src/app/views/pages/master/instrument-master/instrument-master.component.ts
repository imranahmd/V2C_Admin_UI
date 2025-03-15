import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColDef, FilterChangedEvent, FilterModifiedEvent, FilterOpenedEvent, PaginationChangedEvent } from 'ag-grid-community';
import { BtnCellRenderer } from 'src/app/common/button-cell-renderer.component';
import { environment } from 'src/environments/environment';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
const { API_URL, defaultPageSizeArr, defaultPageSize } = environment;
@Component({
  selector: 'app-instrument-master',
  templateUrl: './instrument-master.component.html',
  styleUrls: ['./instrument-master.component.scss']
})
export class InstrumentMasterComponent implements OnInit {
  InstrumentForm: FormGroup
  isSubmitted: boolean = false
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
  InstrumentData: any;
  response: any;
  upDateId: any;
  loading: boolean=false;







  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService) {
    this.InstrumentForm = fb.group({
      InstrumentId: ['', [Validators.required,Validators.maxLength(50)]],
      Description: ['', [Validators.required,Validators.maxLength(100)]]

    })
  }

  ngOnInit(): void {
    this.columnDefs = [
      { field: 'InstrumentId', tooltipField: 'InstrumentId', headerName: 'Instrument ID', filter: true },
      { field: 'InstrumentDescription', tooltipField: 'InstrumentDescription', headerName: 'Instrument Description', filter: true },

      { field: 'Created_On', tooltipField: 'Created_On', headerName: 'Created On', filter: true },
      { field: 'Modified_On', tooltipField: 'Modified_On', headerName: 'Modified On', filter: true },
      { field: 'Modified_By', tooltipField: 'Modified_By', headerName: 'Modified By', filter: true },


      {
        field: 'action', headerName: 'Action', resizable: true, width: 25, pinned: 'right', cellRenderer: BtnCellRenderer, cellRendererParams: [
          {
            clicked: async (field: any, data: any, param: any, formvalue: any) => {
              debugger
              this.tableInfo = data.data
               this.Setvalue(this.tableInfo)
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
                this.GetInstrumentList()
              })

            },
            buttonIconClass: 'icon-trash'
          },
        ]
      },

    ];

    this.columnDefsCopy = [...(this.columnDefs.filter((col) => !col?.hide))];
    this.tableSelectedColumn = [...(this.columnDefs.filter((col) => !col?.hide))];

    this.GetInstrumentList()

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






  restForm() {

  }

  GetInstrumentList() {
    debugger
    this.masterservice.getInstrumentList().subscribe((res: any) => {
      this.InstrumentData = res
      this.rowData = this.InstrumentData,
        this.collectionSize = this.InstrumentData?.totalCount || this.InstrumentData?.length;

    })
  }


  addIntrument(formvalue: any) {debugger

    let Req= 
    {
        "InstrumentId":formvalue.InstrumentId,
        "InstrumentDes":formvalue.Description,
        "CreatedBy": localStorage.getItem('user'),
        "ModifiedBy":localStorage.getItem('user')
    }
    if(this.InstrumentForm.valid)
    {
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.masterservice.createUpdateInstrument(Req).subscribe((res:any)=>{
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        this.response=res
        if(res.Status==true)
        {
          this.alertService.successAlert(res.Message)
        }
      
        this.GetInstrumentList()
        this.isSubmitted = false
        this.InstrumentForm.reset()
        document.getElementById('InstrumentId')?.removeAttribute('disabled')
      })
    }
  

    this.isSubmitted=true

  }




  delete(Id: any) {
    debugger
    var ID = Id?.InstrumentId


    var data = {
      "Id":ID
    }
    return this.masterservice.deleteInstrumentDetails(data)

  }


  Setvalue(editvalue: any) {debugger
    this.upDateId = editvalue
    this.InstrumentForm.patchValue({

      InstrumentId: editvalue?.InstrumentId,
      Description: editvalue?.InstrumentDescription

    })
    document.getElementById('InstrumentId')?.setAttribute('disabled', '')
    
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
