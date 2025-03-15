import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { PayoutSettlementService } from '../payout-settlement.service';
import { AlertService } from 'src/app/_services/alert.service';
import { environment } from 'src/environments/environment';
import { DataTable } from 'simple-datatables';
const { API_URL } = environment;

@Component({
  selector: 'app-settlement-file-one',
  templateUrl: './settlement-file-one.component.html',
  styleUrls: ['./settlement-file-one.component.scss']
})
export class SettlementFileOneComponent implements OnInit {
  dailysettlement: FormGroup;
  uploadfile: FormGroup;
  isForm1Submitted: Boolean = false;
  isForm2Submitted: Boolean = false;
  settlementmessage: any;
  file: any;
  ReversefeedShow: Boolean = false;
  array: any[] = [];
  photoName: any;
  fileExtension: any;
  fileExtensionError: boolean;
  rowData: any;
  BulkResponse: boolean;
  dataTable: DataTable;
  loading: boolean;
  rowDataValue: boolean = false;
  dailysettlement1:any
  
  constructor(private apiHttpService: ApiHttpService, private settlementservice: PayoutSettlementService, private alertService: AlertService) {
    this.dailysettlement = new FormGroup({
      PayoutId: new FormControl('', [Validators.required]),
      UTRNO: new FormControl('', [Validators.required]),


    })



  }

  ngOnInit(): void {
    this.uploadfile = new FormGroup({
      UploadFile: new FormControl('', [Validators.required]),
    })


  }
  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  onSubmit(formvalue: any) {
    debugger
    let dailysettlement1= {

      "utrNo": formvalue.UTRNO,
      "payoutRefId": formvalue.PayoutId,
      "userName": localStorage.getItem('user'),


    }

    if (this.dailysettlement.valid) {
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.settlementservice.Settlementfile(dailysettlement1).subscribe((res: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        console.log(res)
        this.settlementmessage = res;
        if (this.settlementmessage.Status == "Success") {
          this.alertService.successAlert(this.settlementmessage.Message)

        }

      })
    }
    this.isForm1Submitted = true;



  }
  onFileSelect(event: any) {
    debugger
    if (event.target.files.length > 0) {
      var allowedExtensions = ["txt", "TXT"];
      this.file = event.target.files[0];
      this.photoName = this.file.name;

      this.fileExtension = this.photoName.split('.').pop();

      if (this.isInArray(allowedExtensions, this.fileExtension)) {
        this.fileExtensionError = false;

      } else {
        // this.alertService.successAlert("Only " + " Excel and CSV" + " files are allowed");
        this.alertService.errorAlert({
          title: "Only " + "txt" + " file is allowed",
          backdrop: true,
          toast: false,
        });
        this.rowData = false;
        this.fileExtensionError = true;
        // this.InputVar.nativeElement.value = "";
        // this.formarraycontrol = this.t.controls[control].reset()
        return
        // let setvalue =  (<HTMLInputElement>document.getElementById('File1'))
        // setvalue.value = "";
        // file = null;
      }


    }


  }
  onUpload(val: any) {
    debugger
    if (this.fileExtensionError == false && this.uploadfile.valid) {
      var userid: any = localStorage?.getItem('user')
      if (this.file) {
        //
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('userName', userid);
        this.loading = true
        document?.getElementById('loading')?.classList.add("spinner-border")
        document?.getElementById('loading')?.classList.add("spinner-border-sm")
        this.apiHttpService
          .post(
            `${API_URL}/bulkUploadSettlementV1`, formData
            // , {  responseType: 'text'}
          )
          
          .subscribe((data: any) => {
            this.loading = false
            document?.getElementById('loading')?.classList.remove("spinner-border")
            document?.getElementById('loading')?.classList.remove("spinner-border-sm")
           
            debugger
            if (!data[0].UTRNumber) {
              this.alertService.errorAlert({ html: data[0].Message })
              this.rowDataValue = false
              return;
            }
          

            // let str = data.text;
            // let pos = str.lastIndexOf(',');
            // str = str.substring(0, pos) + str.substring(pos + 1);JSON.parse()
            this.rowData = data;
            if (this.rowData) {
              this.rowDataValue = true
            }

            this.rowData ? this.alertService.successAlert('	Bulk UTR Number Updated Successfully') : this.alertService.errorAlert({ html: 'Unable to upload CSV file' }),
              this.dataTable ? this.dataTable.destroy() : console.log(this.rowData)
            this.rowData ? this.dataTable = new DataTable("#dataTableExample") : this.dataTable.destroy(),

              this.BulkResponse = this.rowData

            if (this.rowData) {
              Object.values(this.rowData).forEach((element: any, i: number) => {
                console.log(element)
                this.dataTable.rows().add([i + 1 + '', element.Status, element.Message, element.UTRNumber, element.PgRefrenceNumber]);
              })
            }


            //,
            // this.page =
            //,
            // this.onVerify()
            // this.refreshGrid()
          },
            (error) => {
              console.log("****Error------>", error)
            })

        //   var reader = new FileReader();
        //   reader.onloadend = (e: any) => {
        //
        //     var contents = e.target.result;
        //     this.photoContent = contents.split(',')[1];
        //  }
        //   reader.readAsDataURL(file);
        //   this.addCorpForm.get('UploadFile').setValue(file);
        //   this.submitFile()
        //  this.UploagePageForm.patchValue({
        //   "Doc":"Done",
        // });
        //  this.UploagePageForm.get('Doc').setValue('Done');
      } else {
        this.alertService.toastErrorMessageAlert({
          html: "Failed to load file"
        })
      }
    }
    else {
      this.rowDataValue = false;
    }
    this.isForm2Submitted = true;

  }
  resetform()
  {
    this.dailysettlement1 = false
    this.dailysettlement.reset()
    this.isForm1Submitted = false 
  }
  resetBulkform()
  {
    this.rowDataValue= false
    this.uploadfile.reset()
    this.BulkResponse = false
    this.isForm2Submitted = false

  }


  DailySettlement() {
    debugger
    // this.lifecycle = true
    // this.bulkfile = false
    document.getElementById("home")?.classList.add("show")
    document.getElementById("profile")?.classList.remove("show")
    document.getElementById("home")?.classList.add("active")
    document.getElementById("profile")?.classList.remove("active")

    document.getElementById("home-line-tab")?.classList.add("active")
    document.getElementById("profile-line-tab")?.classList.remove("active")

    document.getElementById("home-line-tab")?.classList.add("active")
    document.getElementById("profile-line-tab")?.classList.remove("active")
   
    this.dailysettlement1 = false
    this.resetform()
    this.resetBulkform()
    this.array =[]
    this.ReversefeedShow=false;

  }
  ReverseFeed() {
    debugger
    // this.bulkfile = true
    // this.lifecycle = false
    document.getElementById("profile")?.classList.add("show")
    document.getElementById("home")?.classList.remove("show")
    document.getElementById("profile")?.classList.add("active")
    document.getElementById("home")?.classList.remove("active")

    document.getElementById("profile-line-tab")?.classList.add("active")
    document.getElementById("home-line-tab")?.classList.remove("active")
    this.BulkResponse = false
    this.resetform()
    this.resetBulkform()
    this.rowData = false
    this.array =[]
    this.ReversefeedShow=true;

  }
  get form1() {
    return this.dailysettlement.controls;
  }
  get form2() {
    return this.uploadfile.controls;
  }
  fun(id: any) {
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id: any) {
    document?.getElementById(id)?.classList.remove("hey")
  }
  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 95 && charCode <= 122))   {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

}
