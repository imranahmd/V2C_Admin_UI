import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { PayoutSettlementService } from '../payout-settlement.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-generate-payout-two',
  templateUrl: './generate-payout-two.component.html',
  styleUrls: ['./generate-payout-two.component.scss']
})
export class GeneratePayoutTwoComponent implements OnInit {
  generatepayout2: FormGroup;
  isForm1Submitted: Boolean = false;
  loading: boolean;
  fileName: any;
  payoutdata: any;
  withmerchant: boolean= false;
  withoutmerchant: Boolean = false;
  currentNewDate: any =new Date();
  constructor(private apiHttpService: ApiHttpService, private payoutservice: PayoutSettlementService,  private alertService: AlertService) {

    this.generatepayout2 = new FormGroup({
      Bankprovider: new FormControl('YesBank', [Validators.required]),
      txnDate: new FormControl('', [Validators.required]),


    })
   }

  ngOnInit(): void {
   
  }
  onSubmit(formvalue: any)
  {
    let payoutAddData = {
      "payoutEscrow": formvalue.Bankprovider,
      "txn_Date": formvalue.txnDate,
      "username": localStorage.getItem('user')

      

    }
    if (this.generatepayout2.valid) {
      if ((2000 > new Date(this.generatepayout2.controls["txnDate"].value).getFullYear() ||  new Date(this.generatepayout2.controls["txnDate"].value) >this.  currentNewDate))  {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })
  
     
       
        this.payoutdata = false
        return
      }
      this.payoutservice.generatepayout(payoutAddData).subscribe((res: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
       
        
      
        console.log(res)

        this.payoutdata = res;
        if(this.payoutdata.ResponseMessage== "Data Not Available.")
        {
          this.alertService.errorAlert({
            html: this.payoutdata?.ResponseMessage
          })

          this.payoutdata =false;

        }
        if(this.payoutdata?.Data[0]?.transactionwise_payout_path &&  this.payoutdata?.Data[0]?.merchantwise_payout_path)
        {
          this.withoutmerchant=true
          this.withmerchant=false
        }
        if (this.payoutdata.merchantwise_payout_path == "null" && this.payoutdata?.Data[0]?.transactionwise_payout_path ) {
          this.withmerchant=true
          // this.withoutmerchant=false
        }
       
        
        

       
      }
      )
      
      
    }
    this.isForm1Submitted = true;
  }
  GeneratePayout() {


    document.getElementById("home")?.classList.add("show")
    document.getElementById("profile")?.classList.remove("show")
    document.getElementById("home")?.classList.add("active")
    document.getElementById("profile")?.classList.remove("active")

    document.getElementById("home-line-tab")?.classList.add("active")
    document.getElementById("profile-line-tab")?.classList.remove("active")

  }
  PayoutReferenceId() {
    debugger

    document.getElementById("profile")?.classList.add("show")
    document.getElementById("home")?.classList.remove("show")
    document.getElementById("profile")?.classList.add("active")
    document.getElementById("home")?.classList.remove("active")

    document.getElementById("profile-line-tab")?.classList.add("active")
    document.getElementById("home-line-tab")?.classList.remove("active")

  }



  get form1() {
    return this.generatepayout2.controls;
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  
  resetform()
  {

    this.payoutdata = false
    this.generatepayout2.reset()
  }
  Downloads(file: any) {
    debugger
    //  const downloaddata = new FormData();

    //     downloaddata.append('name',a);
    this.fileName = file
    this.payoutservice.Downloadpayout(file).subscribe((res: any) => {
      debugger
      var blob = new Blob([res], {
        type: 'docx/pdf',
        // filename: this.fileName,
      });
      const url = window.URL.createObjectURL(blob);
      // window.open(url);
      // let url = window.URL.createObjectURL(res.blob());
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }),
      () => console.log('Error downloading the file.'),
      () => console.info('OK');

  }
}
