import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChargebackServiceService } from '../chargeback-service.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-raise-charge-back-view',
  templateUrl: './raise-charge-back-view.component.html',
  styleUrls: ['./raise-charge-back-view.component.scss']
})
export class RaiseChargeBackViewComponent implements OnInit {
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  chargeBackRaiseForm:FormGroup
  isForm1Submitted:boolean=false
  UpfrontNonUpfront: any[] = [];
  MerchUpfrontNonUpfront: any[] = [];
  files: any;
  fileName: any;
  fileExtension: any;
  fileExtensionError: boolean;
  fileResponse: any;
  loading: boolean=false;

  constructor(private fb:FormBuilder, private chregbackservice:ChargebackServiceService, private alertService: AlertService) {
   this.chargeBackRaiseForm=fb.group({
    ChargeBackID:[,[Validators.required]],
    Remarks:[,[Validators.required]],
    BankCutOffDate:[,[Validators.required]],
    MerchantCutOffDate:[,[Validators.required]],
    emailId:[,[]],
    file: [,[]],
    BankDebitType: [,[]],
    MerchantDebitType: [,[]]
   })
  }

  ngOnInit(): void {
    debugger

    this.onMerchantMId.subscribe((res: any) => {
      this.isForm1Submitted=false
      this.data = res
      this.chargeBackRaiseForm.reset()
      this.chargeBackRaiseForm.controls['emailId'].setValue(this.data.Merchant_Email_ID)
      this.chargeBackRaiseForm.controls['BankDebitType'].setValue(this.UpfrontNonUpfront[0].FieldValue)
      this.chargeBackRaiseForm.controls['MerchantDebitType'].setValue( this.MerchUpfrontNonUpfront[0].FieldValue)
      this.chargeBackRaiseForm.controls['emailId'].disable()
      this.files=[]
        this.chargeBackRaiseForm.controls['file'].reset()
    })


    this.UpfrontNonUpfront = [{ FieldValue: 'Upfront', FieldText: 'Upfront' },
    { FieldValue: 'Non-Upfront', FieldText: 'Non-Upfront' },]

    this.MerchUpfrontNonUpfront = [{ FieldValue: 'Upfront', FieldText: 'Upfront' },
    { FieldValue: 'Non-Upfront', FieldText: 'Non-Upfront' },]


  }

  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }


  onFileSelect(event: any) {
    debugger

    // type = type || 'single'
    // if (event.target.files[0].size < 1048576) {
    if (event.target.files.length > 0) {
      let i
      var file = event.target.files;
      for (i = 0; i < file?.length; i++) {
        var allowedExtensions = ["ZIP", "zip"];
     
     
      this.fileName = file[i].name;
      this.fileExtension = this.fileName.split('.').pop();

      if (this.isInArray(allowedExtensions, this.fileExtension)) {
        
        this.alertService.errorAlert({
          html: "ZIP " + " files are not allowed"
        })
        this.fileExtensionError = true;
        this.files=[]
        this.chargeBackRaiseForm.controls['file'].reset()
        return

      }
      else {
        // alert("Only " + "Image, Document, Excel and PDF" + " files are allowed");
        this.fileExtensionError = false;

      }

      if (this.fileExtensionError == false) {
        if (file) {
          // const formData = new FormData();

          // formData.append('file', file);

          // this.reconservice.uploadMPRfile(formData).subscribe((res: any) => {
          //   this.fileResponse = res[0].fileName;
          // })
          this.files = file


        } 
        else {
          this.alertService.errorAlert({
            html: "Failed to load file"
          })
          this.files =null
        }
      }
       
      }


      



      // this.fileExtensionError = false;
     
    }


  }




  onSubmit(formdata: any) {
    debugger
    const formData = new FormData();
    // var AddedBy: any = localStorage.getItem("user")
    let i;
    // let f:any="/path/to/file";
    var f = new File([""], "faildToNam", { type: 'text/html' });
    if(this.files.length>0){
       for (i = 0; i < this.files?.length; i++) {
      formData.append('files', this.files[i])
    }
    }
    else{
      formData.append('files',f)
   }
   
    formData.append('chargeBackId', formdata.ChargeBackID)
    formData.append('merchantId', this.data.MID)
    formData.append('txnId', this.data.Txn_Id)
    formData.append('amount', this.data.Amount)
    formData.append('remarks', formdata.Remarks)
    formData.append('bankLastDate', formdata.BankCutOffDate)
    formData.append('merchLastDate', formdata.MerchantCutOffDate)
    formData.append('UpfrontNonUpfront', formdata.BankDebitType)
    formData.append('MerchUpfrontNonUpfront', formdata.MerchantDebitType)

    if(this.chargeBackRaiseForm.valid)
    {
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.chregbackservice.Raisedchargebackinsert(formData).subscribe((res: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")

        if(res.Status=='success')
        {
          this.alertService.successAlert(res.Reason)
         
            //this.alertService.successAlert(res.Reason)
            this.closeModal.emit({
              showModal: false
            });
             this.isForm1Submitted=false
        }
        else{
          this.alertService.errorAlert({html:res.Reason})
          this.isForm1Submitted=false
          return
        }

        // if(res.Status=='fail')
        // {
         
        // }
  
      })
     

    }

   this.isForm1Submitted=true
   

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
