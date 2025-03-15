import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_services/alert.service';
import { RefundManagementService } from '../refund-management.service';
import { DataTable } from 'simple-datatables';
import { moreThanOneWhiteSpaceValidator } from 'src/app/common/common.validators';

@Component({
  selector: 'app-upload-refund',
  templateUrl: './upload-refund.component.html',
  styleUrls: ['./upload-refund.component.scss']
})
export class UploadRefundComponent implements OnInit {
  Search_By: any = [];
  uploadRefundForm: FormGroup
  fileExtensionError: any;
  file: any;
  photoName: any;
  fileExtension: any;
  isForm1Submitted: any = false
  rowData: any;
  dataTable: DataTable;
  uploadResponse: any;
  showgrid: any=false;
  loading: boolean=false;

  constructor(private fb: FormBuilder, private alertService: AlertService, private refundService: RefundManagementService) {
    this.Search_By = [{ FieldValue: '14', FieldText: 'SBI NB' },
    { FieldValue: '0', FieldText: 'Others' },]

    this.uploadRefundForm = fb.group({
      spId: [, [Validators.required,moreThanOneWhiteSpaceValidator()]],

      file: [, [Validators.required]]

    })
  }

  get form1() {
    return this.uploadRefundForm as FormGroup;
  }

  ngOnInit(): void {
  }



  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onFileSelect(event: any) {
    debugger


    if (event.target.files.length > 0) {
      var allowedExtensions = ["xlsx", "XLSX","txt","TXT"];
      this.file = event.target.files[0];
      this.photoName = this.file.name;

      this.fileExtension = this.photoName.split('.').pop();

      if (this.isInArray(allowedExtensions, this.fileExtension)) {
        this.fileExtensionError = false;

      } else {
        this.alertService.errorAlert({
          title: "Only " + " XLSX " +"TXT" + " files are allowed",
          backdrop: true,
          toast: false,
        });

        this.fileExtensionError = true;

        return

      }


    }

  }
  onSubmit(f: any) {
    debugger
    document?.getElementById('spId')?.classList.remove("hello")
    if (this.fileExtensionError == false && this.uploadRefundForm.valid) {
     
      var userid: any = localStorage?.getItem('user')
      const formData = new FormData();

      if (this.file) {
        //
        formData.append('file', this.file);
        formData.append('userId', userid);
        formData.append('sPID', f.spId);
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.refundService.uploadManualRefundFile(formData).subscribe((data: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        this.rowData = data,
        this.showgrid=this.rowData
        this.rowData?.Status=='Success' ? this.alertService.successAlert('Uploaded Manual Refund file successfully') : this.alertService.errorAlert({ html: 'Unable to upload CSV file' }),
        this.dataTable ? this.dataTable.destroy() : console.log(this.rowData)
      this.rowData?.Status=='Success' ? this.dataTable = new DataTable("#dataTableExample") : this.dataTable.destroy(),

        this.uploadResponse = this.rowData

      if (this.rowData?.Data) {
        Object.values(this.rowData?.Data).forEach((element: any,i:number) => {
          console.log(element)
          this.dataTable.rows().add([i+1+'',element.Status,element.Message]);
        })
      }


      })
    }
    else{
      if(this.uploadRefundForm.controls['spId'].invalid||this.uploadRefundForm.controls['spId'].invalid){
        document?.getElementById('spId')?.classList.add("hello")
      }else{
        document?.getElementById('spId')?.classList.remove("hello")
      }
    }
    this.isForm1Submitted = true

  }

  OnlyCharacterAllowed(event: { which: any; keyCode: any; }): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  resetform() {
    this.uploadRefundForm.reset()
    this.isForm1Submitted = false
    this.rowData=false
    document?.getElementById('spId')?.classList.remove("hello")
  }

  NoDoubleSpace(event:any){debugger
    var val = event.target.value
    var len = event.target.value.length
    
    const charCode = (event.which) ? event.which : event.keyCode;
    if((val.charCodeAt(len-1)===charCode) &&(len >0)){
     return false
    }
    return true;
    // this.elementRef.nativeElement.querySelector('my-element')
  }


}
