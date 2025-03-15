import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { param } from 'jquery';
import { RechargeManagementService } from '../recharge-management.service';
import { AlertService } from 'src/app/_services/alert.service';


@Component({
  selector: 'app-bank-statement',
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./bank-statement.component.scss']
})
export class BankStatementComponent implements OnInit {
  loading: boolean = false
  types: any = []
  bankStatmentForm: FormGroup
  transactionDetails: any

  data: any 
  key: any 
  transactionSummary: any 
  Balances: any 
  propertyNames: any[] = []
  submitForm1:boolean=false
  showgrid: any;

  currentPage = 1;
  itemsPerPage = 10; // Number of items per page
  totalItems:any;
  pageSizes = [10, 20, 50]; // List of available page sizes
  pastDate: any = new Date("2000-01-01");
  currDate: any = new Date();

  constructor(private rechargeservice: RechargeManagementService, private fb: FormBuilder,private alertService: AlertService) {
    this.bankStatmentForm = fb.group({
      transactiontype:[,[Validators.required]],
      FromDate: ['', [Validators.required]],
      ToDate: ['', [Validators.required]]

    })
    this.types = [{ FieldValue: 'D', FieldText: 'Debit' },
    { FieldValue: 'C', FieldText: 'Credit' },
    { FieldValue: 'B', FieldText: 'Both' }
    ]
  }

  ngOnInit(): void {

    // this.onSubmit('')
  

  }



  onSubmit(formvalue: any) {debugger
    let data = {
      "Tran_Type":formvalue.transactiontype||'',
      "From_Dt":formvalue.FromDate||'',
      "To_Dt": formvalue.ToDate||'',
    }


    if(this.bankStatmentForm.valid)
    {
      if ((2000 > new Date(this.bankStatmentForm.controls["FromDate"].value).getFullYear() || new Date(this.bankStatmentForm.controls["FromDate"].value) > this.currDate) || (2000 > new Date(this.bankStatmentForm.controls["ToDate"].value).getFullYear() || new Date(this.bankStatmentForm.controls["ToDate"].value) > this.currDate)) {
        this.alertService.errorAlert({
          text: "Date out of Range!"
        })



        this.showgrid= false
        return
      }
      if (this.bankStatmentForm.controls['FromDate'].value > this.bankStatmentForm.controls['ToDate'].value) {
        this.alertService.errorAlert({
          text: "From Date can not be greater than To Date!"
        })
        
        return
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.rechargeservice.getBankStatementData(data).subscribe((res:any)=>{debugger
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        // this.transactionDetails=res
        if(res?.hasOwnProperty("error"))
        {
          this.alertService.errorAlert({html:res?.error})
          this.showgrid=false
          return
        }
        this.transactionDetails=res
       this.totalItems = this.transactionDetails.length;
        this.showgrid=res;
        this.data= this.transactionDetails.Acc_Stmt_DtRng_Res.Body.transactionDetails
       this.totalItems = this.data.length;
        this.key=Object.keys(this.transactionDetails.Acc_Stmt_DtRng_Res.Body.transactionDetails[0])
        this.transactionSummary=Object.keys(this.transactionDetails.Acc_Stmt_DtRng_Res.Body.transactionDetails[0].transactionSummary);
        this.Balances= this.transactionDetails.Acc_Stmt_DtRng_Res.Body.accountBalances
        this.propertyNames = Object.keys(this.transactionDetails.Acc_Stmt_DtRng_Res.Body.accountBalances)
        console.log(this.propertyNames)
  
  
  
      })
    }

    else{
      if (this.bankStatmentForm.controls['transactiontype'].invalid ) {
        document?.getElementById('type')?.classList.add("hello")
      } 

      else {
        document?.getElementById('type')?.classList.remove("hello")
      }
    }

  

   
    this.submitForm1=true

  }

  resetform()
  {
    this.bankStatmentForm.reset()
    this.submitForm1=false
    this.showgrid=false
    document?.getElementById('type')?.classList.remove("hello")
  }
  get pagedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(startIndex, startIndex + this.itemsPerPage);
  }


  getKey(param: any) {
    return Object.keys(param)
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

}
