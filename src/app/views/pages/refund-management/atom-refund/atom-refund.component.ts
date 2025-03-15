import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataTable } from 'simple-datatables';
import { AlertService } from 'src/app/_services/alert.service';
import { RefundManagementService } from '../refund-management.service';

@Component({
  selector: 'app-atom-refund',
  templateUrl: './atom-refund.component.html',
  styleUrls: ['./atom-refund.component.scss']
})
export class AtomRefundComponent implements OnInit {
  atomRefundForm:FormGroup
  file: any;
  photoName: any;
  fileExtension: any;
  fileExtensionError: boolean;
  dataTable: any;
  rowData: any;
  showgrid: any;
  uploadResponse: any;
  isForm1Submitted: boolean=false;
  constructor(private formbilder:FormBuilder,private alertService:AlertService,private refundService:RefundManagementService) {
    this.atomRefundForm=formbilder.group({
      file:['',[Validators.required]]
    })
   }

  ngOnInit(): void {
  }

  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onFileSelect(event: any) {
    debugger


    if (event.target.files.length > 0) {
      var allowedExtensions = ["csv", "CSV", "xlsx", "XLSX"];
      this.file = event.target.files[0];
      this.photoName = this.file.name;

      this.fileExtension = this.photoName.split('.').pop();

      if (this.isInArray(allowedExtensions, this.fileExtension)) {
        this.fileExtensionError = false;

      } else {
        this.alertService.errorAlert({
          title: "Only " + " CSV" + " files are allowed",
          backdrop: true,
          toast: false,
        });

        this.fileExtensionError = true;

        return

      }


    }

  }

  uploadAtomRefund()
  {

    debugger
    document?.getElementById('formFile')?.classList.remove("hello")
    if (this.fileExtensionError == false && this.atomRefundForm.valid) {
     
      var userid: any = localStorage?.getItem('user')
      const formData = new FormData();

      if (this.file) {
        //
        formData.append('file', this.file);
        formData.append('userId', userid);
      
      }

      this.refundService.uploadManualRefundFile(formData).subscribe((data: any) => {
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
  
    this.isForm1Submitted = true
  }

}
