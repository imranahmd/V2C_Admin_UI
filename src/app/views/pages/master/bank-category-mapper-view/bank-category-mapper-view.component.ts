import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bank-category-mapper-view',
  templateUrl: './bank-category-mapper-view.component.html',
  styleUrls: ['./bank-category-mapper-view.component.scss']
})
export class BankCategoryMapperViewComponent implements OnInit {
  @Input() merchantStatusConfig: any;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantAdd: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalDelete') private modalDeleteComponent: ModalComponent

  isForm1Submitted: boolean = false
  serviceForm: FormGroup
  resdata: any;
  merchantdata: any;
  intrumentdata: any;
  res: string;
  ID: any;
  highlight: boolean;
  loading: boolean;
  mdrtype: any[] = []
  servicedata: any;
  currentDate: any = new Date();
  pgdata: any;
  Resdata: any;
  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService, private datepipe: DatePipe) {
    this.serviceForm = fb.group({
      serviceProviderName: [, [Validators.required]],
      BusinessCategory: [, [Validators.required]],
      BaseRate: [, [Validators.required]],
      MinAmount: [, [Validators.required, Validators.maxLength(10)]],
      MaxAmount: [, [Validators.required, Validators.maxLength(10)]],
      MinMDRAmount: [, [Validators.required, Validators.maxLength(10)]],
      MDRType: [, [Validators.required]],
      MerchantId: [, [Validators.required]],
      Instruments: [, [Validators.required]],
      Banks: [, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.mdrtype = [{ FieldValue: '2', FieldText: 'Flat' },
    { FieldValue: '1', FieldText: 'Percentage' },]
    this.getcategoryIdList()
    this.getMerchantidList()
    this.serviceProviderDropdown()
    this.ServiceProvide()
    this.pgBank()
    this.MerchnatList()
    this.onMerchantAdd.subscribe((res: any) => {
      debugger
      this.res = ''

      this.resetForm()


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

      // this.selectinstrument(x)
      if (res) {

        this.setValues(res)

        this.serviceForm.controls['Instruments'].setValue(res.instrument_id)
        this.serviceForm.controls['Banks'].setValue(res.bank_id)
        this.serviceForm.controls['BusinessCategory'].setValue(res.category_id)
        this.serviceForm.controls['MerchantId'].setValue(res.merchant_id)



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
      MerchantId: res.merchant_id,
      BusinessCategory: res.category_id,
      BaseRate: res.base_rate,
      MinAmount: res.min_amt,
      MaxAmount: res.max_amt,
      MinMDRAmount: res.min_mdr_amount,
      MDRType: res.mdr_type
      ,
      Instruments: res.instrument_id,
      Banks: res.bank_id,



    })

  }

  resetForm() {
    debugger
    this.serviceForm.patchValue({
      // mid: res.mid,
      serviceProviderName: null,
      MerchantId: null,
      BusinessCategory: null,
      BaseRate: '',
      MinAmount: '',
      MaxAmount: '',
      MinMDRAmount: '',
      MDRType: null
      ,
      Instruments: null,
      Banks: null,

    })

    this.isForm1Submitted = false
    this.serviceForm.controls['Instruments'].clearValidators()
    this.serviceForm.controls['Instruments'].updateValueAndValidity()
    this.serviceForm.controls['Banks'].clearValidators()
    this.serviceForm.controls['Banks'].updateValueAndValidity()
    this.serviceForm.controls['MerchantId'].clearValidators()
    this.serviceForm.controls['MerchantId'].updateValueAndValidity()
    this.serviceForm.controls['serviceProviderName'].clearValidators()
    this.serviceForm.controls['serviceProviderName'].updateValueAndValidity()
    this.serviceForm.controls['BusinessCategory'].clearValidators()
    this.serviceForm.controls['BusinessCategory'].updateValueAndValidity()
    this.serviceForm.controls['MDRType'].clearValidators()
    this.serviceForm.controls['MDRType'].updateValueAndValidity()
    // document?.getElementById('Banks')?.classList.add("hi")
    document?.getElementById('Banks')?.classList.remove("hello")
    // document?.getElementById('MDRType')?.classList.remove("hello")
    // document?.getElementById('serviceProviderName')?.classList.remove("hello")
    // document?.getElementById('merchantId')?.classList.remove("hello")
    // document?.getElementById("MDRType")?.className =
    document?.getElementById("MDRType")?.className.replace(/\bhello\b/, '');
    // $("MDRType").removeClass("hello");
    // $("Instruments").removeClass("hello");
  }



  onGenerate(formvalue: any) {
    debugger
    console.log(this.currentDate)
    this.serviceForm.controls['Instruments'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Instruments'].updateValueAndValidity()
    this.serviceForm.controls['Banks'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['Banks'].updateValueAndValidity()
    this.serviceForm.controls['MerchantId'].setValidators([Validators.required, Validators.maxLength(200)])
    this.serviceForm.controls['MerchantId'].updateValueAndValidity()
    this.serviceForm.controls['serviceProviderName'].setValidators([Validators.required, Validators.maxLength(100)])
    this.serviceForm.controls['serviceProviderName'].updateValueAndValidity()
    this.serviceForm.controls['serviceProviderName'].setValidators([Validators.required, Validators.maxLength(100)])
    this.serviceForm.controls['serviceProviderName'].updateValueAndValidity()
    this.serviceForm.controls['BusinessCategory'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['BusinessCategory'].updateValueAndValidity()
    this.serviceForm.controls['MDRType'].setValidators([Validators.required, Validators.maxLength(50)])
    this.serviceForm.controls['MDRType'].updateValueAndValidity()

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
            "sp_id": formvalue.serviceProviderName.toString(),
            "mid": formvalue.MerchantId
            ,
            "bank_id": formvalue.Banks.toString() || null,
            "categoryId": formvalue.BusinessCategory?.toString(),
            "min_mdr_amt": formvalue.MinMDRAmount.toString(),
            "base_rate": formvalue.BaseRate.toString(),
            "mdr_type": formvalue.MDRType,
            "Instrument_id": formvalue.Instruments,
            "Min_amt": formvalue.MinAmount.toString(),
            "Max_amt": formvalue.MaxAmount.toString(),
            "createdOn": this.datepipe.transform(this.currentDate.toString(), "yyyy-MM-dd hh:mm:ss"),
            "CreatedBy": localStorage.getItem('user'),
            "modifiedOn": this.datepipe.transform(this.currentDate.toString(), "yyyy-MM-dd hh:mm:ss")
          }

         
          this.masterservice.InsertspBankCategoryMapping(merchantdata).subscribe((res: any) => {

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
            "id": this.ID?.toString(),
            "sp_id": formvalue.serviceProviderName.toString(),
            "mid": formvalue.MerchantId || ''
            ,
            "bank_id": formvalue.Banks || null,
            "categoryId": formvalue.BusinessCategory?.toString(),
            "min_mdr_amt": formvalue.MinMDRAmount.toString(),
            "base_rate": formvalue.BaseRate.toString(),
            "mdr_type": formvalue.MDRType,
            "instrument_id": formvalue.Instruments,
            "Min_amt": formvalue.MinAmount.toString(),
            "Max_amt": formvalue.MaxAmount.toString(),
            "createdOn": this.datepipe.transform(this.currentDate.toString(), "yyyy-MM-dd hh:mm:ss"),
            "CreatedBy": localStorage.getItem('user'),
            "modifiedOn": this.datepipe.transform(this.currentDate.toString(), "yyyy-MM-dd hh:mm:ss")
          }
        
          this.masterservice.UpdatespBankCategoryMapping(merchantdata).subscribe((res: any) => {
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
          document?.getElementById('Instrument')?.classList.add("hello")
        }

        else {
          document?.getElementById('Instrument')?.classList.remove("hello")
        }

        if (this.serviceForm.controls['Banks'].invalid) {
          document?.getElementById('Banks')?.classList.add("hello")
        }

        else {
          document?.getElementById('Banks')?.classList.remove("hello")
        }

        if (this.serviceForm.controls['MDRType'].invalid) {
          document?.getElementById('MDRType')?.classList.add("hello")
        }

        else {
          document?.getElementById('MDRType')?.classList.remove("hello")
        }

        if (this.serviceForm.controls['serviceProviderName'].invalid) {
          document?.getElementById('serviceProviderName')?.classList.add("hello")
        }

        else {
          document?.getElementById('serviceProviderName')?.classList.remove("hello")
        }


        if (this.serviceForm.controls['MerchantId'].invalid) {
          document?.getElementById('merchantId')?.classList.add("hello")
        }

        else {
          document?.getElementById('merchantId')?.classList.remove("hello")
        }


        if (this.serviceForm.controls['BusinessCategory'].invalid) {
          document?.getElementById('Category')?.classList.add("hello")
        }

        else {
          document?.getElementById('Category')?.classList.remove("hello")
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





  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  OnlyNumbersAllowed(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58) || charCode == 46;

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

  getcategoryIdList() {
    let data = {

      "admin": "admin"

    }
    this.masterservice.GetcategoryIdList(data).subscribe((res: any) => {
      this.resdata = res.data
    })

  }


  getMerchantidList() {
    let data = {

      "admin": "admin"

    }
    this.masterservice.GetMerchantidList(data).subscribe((res: any) => {
      this.merchantdata = res.data
    })

  }

  MerchnatList() {
    const merchantdata = {
      "name": ""
    };
    this.masterservice.getAllMerchantList(merchantdata).subscribe((res: any) => {
      this.Resdata = res

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

  ServiceProvide() {

    let serviceprovidedata = {
      "Type": "5",
      "Value": ""
    }
    this.masterservice.getDropDown(serviceprovidedata).subscribe((res: any) => {
      this.servicedata = res
    })
  }

  pgBank() {
    let pgBankData = {
      "Type": "48",
      "Value": ""
    }
    this.masterservice.getDropDown(pgBankData).subscribe((res: any) => {
      this.pgdata = res
    })
  }


}
