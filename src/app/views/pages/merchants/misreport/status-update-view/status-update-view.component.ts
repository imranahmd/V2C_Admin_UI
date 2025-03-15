import { Component, OnInit } from '@angular/core';
import { EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicreportService } from '../dynamicreport.service';
import { AlertService } from 'src/app/_services/alert.service';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import * as $ from "jquery";
@Component({
  selector: 'app-status-update-view',
  templateUrl: './status-update-view.component.html',
  styleUrls: ['./status-update-view.component.scss']
})
export class StatusUpdateViewComponent implements OnInit {


  @Input() merchantStatusConfig: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantAdd: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalDelete') private modalDeleteComponent: ModalComponent
  serviceForm: FormGroup
  resdata: any;
  isForm1Submitted: boolean = false;
  highlight: boolean;
  loading: boolean;
  res: string;
  ID: any='';
  getbankdata: any;
  constructor(private fb: FormBuilder, private masterservice: DynamicreportService, private alertService: AlertService,) {
    this.serviceForm = fb.group({
      merchant_id: ['', []],
      utr_no: ['', [Validators.required]],
      amount: [, []],
      txn_id: [, []],
      status: [null, [Validators.required]],
      isApproved: ['', []],
      createdOn: [, []],
      createdBy: [, []],
      updatedOn: [, []],
      updatedBy: [, []],
      IPAddress: [, []],
      account_no: [, []],
      remark: [, ],
    })
  }

  ngOnInit(): void {
    debugger
    this.onMerchantMId.subscribe((res: any) => {
      debugger
      this.res = res
      if (res) {
        this.setValues(res)
      }
    })
  }
  fun(id: any) {
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id: any) {
    document?.getElementById(id)?.classList.remove("hey")
  }
  setValues(res: any) {
    debugger
    this.ID = res.Txn_Status
    this.serviceForm.patchValue({
      // mid: res.mid,
      merchant_id: res.AuthID,
      // utr_no: res.utr_no,
      amount: res.Txn_Amt,
      txn_id: res.Merchant_TxnID,
      // status: res.Txn_Status,
      // isApproved: res.isApproved,
      createdOn: res.createdOn,
      account_no: res.PG_TxnID.toString(),
      updatedBy: res.UpdatedBy,
      updatedOn: res.UpdatedOn,
      isApproved: res.VPA,
      IPAddress: res.process_id,
    })
    // this.serviceForm.disable()
    document?.getElementById('merchant_id')?.setAttribute("disabled", "disabled");
    // document?.getElementById('utr_no')?.setAttribute("disabled", "disabled");
    document?.getElementById('amount')?.setAttribute("disabled", "disabled");
    document?.getElementById('txn_id')?.setAttribute("disabled", "disabled");
    document?.getElementById('status')?.setAttribute("disabled", "disabled");
    document?.getElementById('isApproved')?.setAttribute("disabled", "disabled");
    document?.getElementById('createdOn')?.setAttribute("disabled", "disabled");
    document?.getElementById('account_no')?.setAttribute("disabled", "disabled");
    // this.serviceForm.controls['remark'].enable()

  }

  resetForm() {
    debugger
    this.serviceForm.patchValue({
      // mid: res.mid,
      serviceProviderName: '',
      serviceClassInvoker: '',
      Instruments: null,
      Banks: null,
      MasterMID: '',
      MasterTID: '',
      APIKey: '',
      UDF1: '',
      UDF2: '',
      UDF3: '',
      UDF4: '',
      UDF5: '',
      RefundProcessor: '',
      CutOffTime: ''

    })

    this.isForm1Submitted = false
    this.serviceForm.controls['Instruments'].clearValidators()
    this.serviceForm.controls['Instruments'].updateValueAndValidity()
    this.serviceForm.controls['Banks'].clearValidators()
    this.serviceForm.controls['Banks'].updateValueAndValidity()
    // document?.getElementById('Banks')?.classList.add("hi")
    // document?.getElementById('Instruments')?.classList.add("hi")
    // $("Banks").removeClass("hello");
    // $("Instruments").removeClass("hello");
  }





  onGenerate(formvalue: any, status: any) {
    debugger

    if (this.serviceForm.valid) {
      document?.getElementById('status')?.classList.remove("hello")
      } else {
      if (this.serviceForm.controls['status'].invalid ) {
        document?.getElementById('status')?.classList.add("hello")
      }}

    setTimeout(() => {
      if (this.serviceForm.valid) {
        this.loading = true
        if (status == 'A') { 
          document?.getElementById('gloading')?.classList.add("spinner-border")
          document?.getElementById('gloading')?.classList.add("spinner-border-sm")
        } else {
          document?.getElementById('rloading')?.classList.add("spinner-border")
          document?.getElementById('rloading')?.classList.add("spinner-border-sm")
        }


        //  this.merchantId = this.merchantId || formvalue.merchantId
        //this.merchantId = formvalue.merchantId
        var merchantdata: any = {}

        merchantdata =
        {

          // "txn_id": formvalue.txn_id,
          // "amount": formvalue.amount,
          // "utr_no": formvalue.utr_no,
          // "merchant_id": formvalue.merchant_id,
          // "account_no": formvalue.account_no,
          // "createdOn": formvalue.createdOn,
          // "status": formvalue.status,
          // "isApproved": status,
          // "approvedBy": localStorage.getItem('user'),
          // "remark": formvalue.remark,
          "AuthId": formvalue.merchant_id,
          "PGTxnId": formvalue.account_no.toString(),
          "Status": formvalue.status,
          "RRN": formvalue.utr_no,
          "amt": formvalue.amount.toString(),
          "MTxnId": formvalue.txn_id,
          "MProcId": formvalue.IPAddress
        }

        this.masterservice.updateStatusReportData(merchantdata).subscribe((res: any) => {

          this.loading = false
          if (status == 'A') {
            document?.getElementById('gloading')?.classList.remove("spinner-border")
            document?.getElementById('gloading')?.classList.remove("spinner-border-sm")
          } else {
            document?.getElementById('rloading')?.classList.remove("spinner-border")
            document?.getElementById('rloading')?.classList.remove("spinner-border-sm")
          }


          if (res.Status == 'success') {
            this.alertService.successAlert(res.Reason)
            this.closeModal.emit({
              showModal: false
            });
          } else {
            this.alertService.errorAlert({ html: res?.Reason })
            this.closeModal.emit({
              showModal: false
            });
          }

        })





      }
      // this.reset();
      this.isForm1Submitted = true;
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });

      this.highlight = false;
      // this.accPan.nativeElement.focus();
      // document?.getElementById(this.findInvalidControls()[0])?.focus();
      // console.log("hhhhhh" + this.findInvalidControls()[0].toString())
      // document.getElementsByClassName('ng-invalid')?.focus();
      setTimeout(() => {
        this.highlight = true;

      }, 1000);
    }, 0);

  }

  async closeModelAction($event: Event) {
    await this.modalDeleteComponent.dismiss();
    // this.refreshGrid(this.merchantId);
  }

  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  NoDoubleSpace(event: any) {
    debugger
    var val = event.target.value
    var len = event.target.value.length

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((val.charCodeAt(len - 1) === charCode) && (len > 0) && (charCode == 32)) {
      return false
    }
    return true;
    // this.elementRef.nativeElement.querySelector('my-element')
  }



}
