import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import * as $ from "jquery";

@Component({
  selector: 'app-service-view',
  templateUrl: './service-view.component.html',
  styleUrls: ['./service-view.component.scss']
})
export class ServiceViewComponent implements OnInit {
  @Input() merchantStatusConfig:any;
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
  ID: any;
  getbankdata: any;
  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService,) {
    this.serviceForm = fb.group({
      serviceProviderName: ['', [Validators.required, Validators.maxLength(100),Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      serviceClassInvoker: ['', [Validators.required, Validators.maxLength(50)]],
      Instruments: [, [Validators.required, Validators.maxLength(50)]],
      Banks: [, [Validators.required, Validators.maxLength(50)]],
      MasterMID: ['', [Validators.maxLength(100)]],
      MasterTID: ['', [Validators.maxLength(100)]],
      APIKey: [, [Validators.maxLength(50)]],
      UDF1: [, [Validators.maxLength(50)]],
      UDF2: [, [Validators.maxLength(50)]],
      UDF3: [, [Validators.maxLength(50)]],
      UDF4: [, [Validators.maxLength(50)]],
      UDF5: [, [Validators.maxLength(50)]],
      RefundProcessor: [, [Validators.maxLength(100)]],
      CutOffTime: [, []]


    })
  }

  ngOnInit(): void {
    debugger
    this.serviceProviderDropdown()
    this.getBankList()
    this.onMerchantAdd.subscribe((res: any) => {
      debugger
      this.res = ''

      this.resetForm()
      // document?.getElementById('Banks')?.classList.remove("hello")
      // document?.getElementById('Instruments')?.classList.remove("hello")

    })
    this.onMerchantMId.subscribe((res: any) => {
      debugger
      this.res = res

      var e = {
        "target": { 'value': "" }
      }
      var x = {
        "target": { 'value': "" }
      }
      this.serviceProviderDropdown()
      this.getBankList()
      // this.selectinstrument(x)
      if (res) {
        this.setValues(res)

        this.serviceForm.controls['Instruments'].setValue(res.instrumentIds)
        this.serviceForm.controls['Banks'].setValue(res.bankIds)

      }

    })
  }

  setValues(res: any) {
    debugger
    debugger
    this.ID = res.sp_id
    this.serviceForm.patchValue({
      // mid: res.mid,
      serviceProviderName: res.sp_name,
      serviceClassInvoker: res.sp_class_invoker,
      Instruments: res.TEXT_SEPERATOR,
      Banks: res.api_key,
      MasterMID: res.master_mid,
      MasterTID: res.master_tid,
      APIKey: res.api_key,
      UDF1: res.udf_1,
      UDF2: res.udf_2,
      UDF3: res.udf_3,
      UDF4: res.udf_4,
      UDF5: res.udf_5,
      RefundProcessor: res.refund_processor,
      CutOffTime: res.cutoff


    })

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



  serviceProviderDropdown() {
    debugger
    let data = {

      "Type": "3",
      "Value": ""

    }
    this.masterservice.getInstrumentMaster(data).subscribe((res: any) => {
      this.resdata = res
    })
  }

  getBankList() {
    debugger
    let data = {
      "admin": "admin"
    }
    this.masterservice.Getbank(data).subscribe((res: any) => {
      this.getbankdata = res.data
    })
  }

  onGenerate(formvalue: any) {
    debugger
    this.serviceForm.controls['Instruments'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Instruments'].updateValueAndValidity()
    this.serviceForm.controls['Banks'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Banks'].updateValueAndValidity()

    setTimeout(() => {
      if (this.serviceForm.valid) {
        this.loading = true
        document?.getElementById('gloading')?.classList.add("spinner-border")
        document?.getElementById('gloading')?.classList.add("spinner-border-sm")
        //  this.merchantId = this.merchantId || formvalue.merchantId
        //this.merchantId = formvalue.merchantId
        var merchantdata: any = {}
        if (!this.res) {
          merchantdata =
          {
            "sp_name": formvalue.serviceProviderName,
            "sp_class_invoker": formvalue.serviceClassInvoker,
            "instrumentIds": formvalue.Instruments,
            "bankIds": formvalue.Banks,
            "master_mid": formvalue.MasterMID,
            "master_tid": formvalue.MasterTID,
            "api_key": formvalue.APIKey,
            "udf_1": formvalue.UDF1 || 'NA',
            "udf_2": formvalue.UDF2 || 'NA',
            "udf_3": formvalue.UDF3 || 'NA',
            "udf_4": formvalue.UDF4 || 'NA',
            "udf_5": formvalue.UDF5 || 'NA',
            "refund_processor": formvalue.RefundProcessor || 'NA',
            "cutoff": formvalue.CutOffTime || 'NA'
          }

          this.masterservice.Insertsp(merchantdata).subscribe((res: any) => {

            this.loading = false
            document?.getElementById('gloading')?.classList.remove("spinner-border")
            document?.getElementById('gloading')?.classList.remove("spinner-border-sm")
            if (res.Status == 'success') {
              this.alertService.successAlert(res.Reason)
              this.closeModal.emit({
                showModal: false
              });
            }

          })


        }
        else {
          merchantdata =
          {
            "sp_id": this.ID?.toString(),
            "sp_name": formvalue.serviceProviderName,
            "sp_class_invoker": formvalue.serviceClassInvoker,
            "instrumentIds": formvalue.Instruments,
            "bankIds": formvalue.Banks,
            "master_mid": formvalue.MasterMID,
            "master_tid": formvalue.MasterTID,
            "api_key": formvalue.APIKey,
            "udf_1": formvalue.UDF1 || 'NA',
            "udf_2": formvalue.UDF2 || 'NA',
            "udf_3": formvalue.UDF3 || 'NA',
            "udf_4": formvalue.UDF4 || 'NA',
            "udf_5": formvalue.UDF5 || 'NA',
            "refund_processor": formvalue.RefundProcessor || 'NA',
            "cutoff": formvalue.CutOffTime || 'NA'

          }

          this.masterservice.Updatesp(merchantdata).subscribe((res: any) => {
            this.loading = false
            document?.getElementById('gloading')?.classList.remove("spinner-border")
            document?.getElementById('gloading')?.classList.remove("spinner-border-sm")

            if (res.Status == 'success') {
              this.alertService.successAlert(res.Reason)
              this.closeModal.emit({
                showModal: false
              });
            }


          })


        }


      }

      else {
        if (this.serviceForm.controls['Instruments'].invalid) {
          document?.getElementById('Instruments')?.classList.add("hello")
        }

        else {
          document?.getElementById('Instruments')?.classList.remove("hello")
        }

        if (this.serviceForm.controls['Banks'].invalid) {
          document?.getElementById('Banks')?.classList.add("hello")
        }

        else {
          document?.getElementById('Banks')?.classList.remove("hello")
        }
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
