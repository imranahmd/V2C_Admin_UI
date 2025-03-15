import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';

@Component({
  selector: 'app-back-add-mapper-view',
  templateUrl: './back-add-mapper-view.component.html',
  styleUrls: ['./back-add-mapper-view.component.scss']
})
export class BackAddMapperViewComponent implements OnInit {
  @Input() merchantStatusConfig: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantAdd: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalDelete') private modalDeleteComponent: ModalComponent

  serviceForm: FormGroup

  isForm1Submitted: boolean = false
  mdrtype: { FieldValue: string; FieldText: string; }[];
  resdata: any;
  intrumentdata: any;
  servicedata: any;
  Preference: any
  Channeldata: any;
  highlight: boolean;
  loading: boolean;
  res: any;
  ID: any;
  constructor(private masterservice: MasterService, private fb: FormBuilder, private alertService: AlertService) {
    this.serviceForm = fb.group({
      serviceProviderName: [[Validators.required]],
      Instruments: [[Validators.required]],
      Banks: [[Validators.required]],
      BankID: ['', [Validators.required]],
      MinAmount: ['', [Validators.required]],
      MaxAmount: ['', [Validators.required]],
      BaseRate: ['', [Validators.required]],
      MDRType: [, [Validators.required]],
      Channel: [, [Validators.required]],
      Preference: [, [Validators.required]]

    })
  }

  ngOnInit(): void {
    this.mdrtype = [{ FieldValue: '2', FieldText: 'Flat' },
    { FieldValue: '1', FieldText: 'Percentage' },]

    this.Preference = [{ FieldValue: '0', FieldText: '0' },
    { FieldValue: '1', FieldText: '1' },
    { FieldValue: '2', FieldText: '2' },
    { FieldValue: '3', FieldText: '3' },
    { FieldValue: '4', FieldText: '4' },
    { FieldValue: '5', FieldText: '5' },
    ]


    this.Channel()
    this.getcategoryIdList()
    this.ServiceProvide()
    this.serviceProviderDropdown()

    this.onMerchantAdd.subscribe((res: any) => {
      debugger
      this.res = ''

      this.resetForm()


    })
    this.onMerchantMId.subscribe((res: any) => {
      debugger
      this.res = res

      // var e = {
      //   "target": { 'value': "" }
      // }
      // var x = {
      //   "target": { 'value': "" }
      // }
      this.serviceProviderDropdown()

      // this.selectinstrument(x)
      if (res) {
        this.setValues(res)

        this.serviceForm.controls['Instruments'].setValue(res.instrument_id)
        this.serviceForm.controls['Banks'].setValue(res.bank_name)
        this.serviceForm.controls['BusinessCategory'].setValue(res.category_id)

      }

    })

  }



  setValues(res: any) {
    debugger
    debugger
    this.ID = res.id
    this.serviceForm.patchValue({
      // mid: res.mid,
      serviceProviderName: res.sp_id,
      Instruments: res.instrument_id,
      Banks: res.bankId,
      BankID: res.sp_bank_id,
      MinAmount: res.min_amt,
      MaxAmount: res.max_amt,
      BaseRate: res.base_rate,
      MDRType: res.mdr_type,
      Channel: res.channel_id,
      Preference: res.preference






    })

  }

  resetForm() {
    debugger
    this.serviceForm.patchValue({
      serviceProviderName: null,
      Instruments: null,
      Banks: null,
      BankID: '',
      MinAmount: '',
      MaxAmount: '',
      BaseRate: '',
      MDRType: null,
      Channel: null,
      Preference: null
    })

    this.isForm1Submitted = false
    this.serviceForm.controls['Instruments'].clearValidators()
    this.serviceForm.controls['Instruments'].updateValueAndValidity()
    this.serviceForm.controls['Banks'].clearValidators()
    this.serviceForm.controls['Banks'].updateValueAndValidity()
    this.serviceForm.controls['serviceProviderName'].clearValidators()
    this.serviceForm.controls['serviceProviderName'].updateValueAndValidity()
    this.serviceForm.controls['Channel'].clearValidators()
    this.serviceForm.controls['Channel'].updateValueAndValidity()
    this.serviceForm.controls['Preference'].clearValidators()
    this.serviceForm.controls['Preference'].updateValueAndValidity()
    this.serviceForm.controls['MDRType'].clearValidators()
    this.serviceForm.controls['MDRType'].updateValueAndValidity()
    // document?.getElementById('Banks')?.classList.add("hi")
    // document?.getElementById('Instruments')?.classList.add("hi")
    // $("Banks").removeClass("hello");
    // $("Instruments").removeClass("hello");
  }



  onGenerate(formvalue: any) {
    debugger
    this.serviceForm.controls['Instruments'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Instruments'].updateValueAndValidity()
    this.serviceForm.controls['Banks'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Banks'].updateValueAndValidity()
    this.serviceForm.controls['serviceProviderName'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['serviceProviderName'].updateValueAndValidity()

    this.serviceForm.controls['Channel'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Channel'].updateValueAndValidity()
    this.serviceForm.controls['Preference'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Preference'].updateValueAndValidity()
    this.serviceForm.controls['MDRType'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['MDRType'].updateValueAndValidity()

    setTimeout(() => {
      if (this.serviceForm.valid) {
        this.loading = true
        document?.getElementById('gloading')?.classList.add("spinner-border")
        document?.getElementById('gloading')?.classList.add("spinner-border-sm")
        //  this.merchantId = this.merchantId || formvalue.merchantId
        //this.merchantId = formvalue.merchantId
        var req: any = {}
        if (!this.res) {
          req = {
            "sp_id": formvalue.serviceProviderName.toString() || '',
            "bank_id": formvalue.Banks || '',
            "sp_bank_id": formvalue.BankID || '',
            "base_rate": formvalue.BaseRate.toString() || '',
            "mdr_type": formvalue.MDRType || '',
            "preference": formvalue.Preference || '',
            "channel_id": formvalue.Channel || '',
            "instrument_id": formvalue.Instruments || '',
            "min_amt": formvalue.MinAmount.toString() || '',
            "max_amt": formvalue.MaxAmount || ''
          }
         
          this.masterservice.InsertspBankMapping(req).subscribe((res: any) => {

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
          req = {
            "id": this.ID.toString(),
            "sp_id": formvalue.serviceProviderName.toString() || '',
            "bank_id": formvalue.Banks || '',
            "sp_bank_id": formvalue.BankID || '',
            "base_rate": formvalue.BaseRate.toString() || '',
            "mdr_type": formvalue.MDRType || '',
            "preference": formvalue.Preference || '',
            "channel_id": formvalue.Channel || '',
            "instrument_id": formvalue.Instruments || '',
            "min_amt": formvalue.MinAmount.toString() || '',
            "max_amt": formvalue.MaxAmount.toString() || ''
          }

         
          this.masterservice.UpdatespBankMapping(req).subscribe((res: any) => {
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


        if (this.serviceForm.controls['serviceProviderName'].invalid) {
          document?.getElementById('serviceProviderName')?.classList.add("hello")
        }

        else {
          document?.getElementById('serviceProviderName')?.classList.remove("hello")
        }



        if (this.serviceForm.controls['Instruments'].invalid) {
          document?.getElementById('Instrument')?.classList.add("hello")
        }

        else {
          document?.getElementById('Instrument')?.classList.remove("hello")
        }



        if (this.serviceForm.controls['MDRType'].invalid) {
          document?.getElementById('MDRType')?.classList.add("hello")
        }

        else {
          document?.getElementById('MDRType')?.classList.remove("hello")
        }


        if (this.serviceForm.controls['Channel'].invalid) {
          document?.getElementById('Channel')?.classList.add("hello")
        }

        else {
          document?.getElementById('Channel')?.classList.remove("hello")
        }


        if (this.serviceForm.controls['Preference'].invalid) {
          document?.getElementById('Preference')?.classList.add("hello")
        }

        else {
          document?.getElementById('Preference')?.classList.remove("hello")
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


  // onGenerate(formvalue: any) {

  //   let req = {
  //     "sp_id":formvalue.serviceProviderName,
  //     "bank_id":formvalue.Banks,
  //     "sp_bank_id":formvalue.BankID,
  //     "base_rate":formvalue.BaseRate,
  //     "mdr_type":formvalue.MDRType,
  //     "preference":formvalue.Preference,
  //     "channel_id":formvalue.Channel,
  //     "instrument_id":formvalue.Instruments,
  //     "min_amt":formvalue.MinAmount,
  //     "max_amt":formvalue.MaxAmount
  //   }
  //   this.masterservice.InsertspBankMapping(req).subscribe((res:any)=>{

  //   })



  // }











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

















  Channel() {
    debugger

    let data = {
      "Type": "47",
      "Value": ""
    }
    this.masterservice.getDropDown(data).subscribe((res: any) => {
      this.Channeldata = res
    })
  }

  ServiceProvide() {

    let serviceprovidedata = {
      "Type": "5",
      "Value": ""
    }
    this.masterservice.getDropDown(serviceprovidedata).subscribe((res: any) => {
      this.servicedata = res
    })
  }


  serviceProviderDropdown() {
    debugger
    let data = {

      "Type": "3",
      "Value": ""

    }
    this.masterservice.getInstrumentMaster(data).subscribe((res: any) => {
      this.intrumentdata = res
    })
  }



  getcategoryIdList() {
    let data = {

      "Type": "48",
      "Value": ""

    }
    this.masterservice.getDropDown(data).subscribe((res: any) => {
      this.resdata = res

    })


  }






  OnlyNumbersAllowed(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58) || charCode == 46;

  }





}
