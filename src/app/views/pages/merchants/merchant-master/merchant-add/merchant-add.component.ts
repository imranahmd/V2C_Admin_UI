import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ConfigurableNavigationMode, WizardComponent as BaseWizardComponent } from 'angular-archwizard';
import { MerchantService } from "../merchant.service";
import { lastValueFrom, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { MenusService } from "../../../../../_services/menu.service";
import { AlertService } from "../../../../../_services/alert.service";
import { ProvidersService } from 'src/app/_services/providers.service';
import { getAllErrors, moreThanOneWhiteSpaceValidator } from 'src/app/common/common.validators';
import { JsonParser } from 'src/app/_helpers/http.interceptor';
import {LoaderService} from "../../../../../_services/loader.service";

// const URL_REG = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
const URL_REG = '((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?\/?$'
const URL_REG1 = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*?(?:,(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-])*$';
const PAN_REG = /^[A-Z]{5}\d{4}[A-Z]$/;

interface DropDownValues {
  FieldValue: number,
  FieldText: string
}

@Component({
  selector: 'app-merchant-add',
  templateUrl: './merchant-add.component.html',
  styleUrls: ['./merchant-add.component.scss']
})
export class MerchantAddComponent implements OnInit {
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  public businessTypeOptions: DropDownValues[];
  public merchantCategoryOptions: DropDownValues[];
  public merchantSubCategoryOptions: DropDownValues[];
  public instrumentMasterOptions: DropDownValues[];
  public resellerListOptions: DropDownValues[];
  public pgInstruments: any;
  public resellerPartner: any;
  public giveTestAccess: any;
  resellerSubscription: Subscription;
  testAccessSubscription: Subscription;
  navigationMode: any;
  isAdd: boolean = true;

  queryParams: any = {};
  validationForm1: FormGroup;
  validationForm2: FormGroup;
  validationForm3: FormGroup;
  // validationForm4: FormGroup;
  // validationForm5: FormGroup;
  // validationForm6: FormGroup;

  isForm1Submitted: Boolean;
  isForm2Submitted: Boolean;
  isForm3Submitted: Boolean;
  // isForm4Submitted: Boolean;
  // isForm5Submitted: Boolean;
  // isForm6Submitted: Boolean;
  merchantId: string;
  @ViewChild('mccSelect') mccSelect: any;
  @ViewChild('wizardForm') wizardForm: BaseWizardComponent;
  public permissions: any;
  validPAN: any = false;
  validationPAN: boolean = false;
  PANvalue: any;
  pancheck: boolean = false;
  authpancheck: boolean = false;
  validGST: any;
  validationGST: boolean;
  gstcheck: boolean;
  GSTvalue: any;
  public PANValue: string = '';
  public authPANValue: string = '';
  public GSTValue: string = '';
  GSTData: any;
  private allFields: any = {};
  currentDate: Date = new Date();
  selectedAttributes: any
  newselectedAttributes: any
  selectedAttributesdata: any
  selectedAttributesCategorydata: any;
  subCategoryData: any;
  responses: any;
  arr: any = {};
  highlight: boolean;
  subcategoryTypeOptions: any;
  isPANVerified: any = 'N';
  isCompanyPanVerify: any = 'N';
  iIsGSTVerify: any = 'N';
  iCompanyPanVerifyName: any = '';
  iGSTVerifyName: any = '';
  name_as_perpan: any = '';
  loading: boolean = false;
  additionalContact: any;
  additionalCount: any = 0;
  saleLeadData: any;
  fileType: any;
  fileInitial: any;
  inkSource: string;
  constructor(private alertService: AlertService, private KYCService: ProvidersService, private menuService: MenusService, private location: Location, private route: ActivatedRoute, private router: Router, public formBuilder: FormBuilder, private merchantService: MerchantService,private loaderService:LoaderService) {
    this.loading = false
    this.validationForm1 = this.formBuilder.group({
      contactName: ['', [Validators.required, moreThanOneWhiteSpaceValidator(), Validators.pattern("[a-zA-Z][a-zA-Z ]+"), Validators.maxLength(200)]],
      contactNumber: ['', [Validators.required, Validators.pattern("[123456789][0-9]{9}")]],
      emailId: ['', [Validators.required, moreThanOneWhiteSpaceValidator(),Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      additionalcontact:
        this.formBuilder.array([])
      // new FormArray([
      //   // this.formBuilder.group({
      //   //   Name: [''],
      //   //   phoneNumber: [],
      //   //   designation:[''],
      //   // })

      // ])

    });

    /**
     * formw value validation
     */
    this.validationForm2 = this.formBuilder.group({
      serviceprovider: ['DECENTRO'],
      authserviceprovider: ['DECENTRO'],
      gstserviceprovider: ['DECENTRO'],
      pancheck: [],
      authPersonPancheck: [],
      pan: ['', [Validators.required, Validators.pattern(PAN_REG)]],
      legalName: ['', [Validators.required, Validators.required, moreThanOneWhiteSpaceValidator(), Validators.maxLength(200), Validators.pattern("^(?!(0))[ 0-9a-zA-Z$&+,:;=?@#|'<>.^*()%!-]+$")]],
      brandName: ['', [moreThanOneWhiteSpaceValidator(), Validators.maxLength(200), Validators.pattern("^(?!(0))[ 0-9a-zA-Z$&+,:;=?@#|'<>.^*()%!-]+$")]],
      businessType: ['', Validators.required],
      dateOfIncorporation: ['', Validators.required],
      businessCategory: ['', Validators.required],
      subCategory: [''],
      businessModel: ['', [Validators.required,moreThanOneWhiteSpaceValidator(), Validators.pattern("^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 ,-./!#%^*()@&$]*)?$"), Validators.maxLength]],
      turnOverLastFinYear: ['', [Validators.required, Validators.pattern("^[1-9]\\d*(\\.\\d+)?$"), Validators.maxLength(10)]],
      expMonthlyTurnOver: ['', [Validators.required, Validators.maxLength, Validators.pattern]],
      avgAmountPerTransaction: ['', [Validators.required, Validators.maxLength, Validators.pattern]],
      authPersonPan: ['', [Validators.required, Validators.pattern(PAN_REG)]],
      authPersonPanName: ['', [Validators.required, moreThanOneWhiteSpaceValidator(), Validators.pattern("[a-zA-Z][a-zA-Z ]+")]],
      address: ['', [Validators.required, moreThanOneWhiteSpaceValidator(), Validators.maxLength, Validators.pattern("^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 ,-./!#%^*()@&$]*)?$")]],
      pincode: ['', [Validators.required, Validators.pattern("([1-9]{1}[0-9]{5}|[1-9]{1}[0-9]{3}\\s[0-9]{3})")]],
      city: ['', [Validators.required,moreThanOneWhiteSpaceValidator(), Validators.pattern("[a-zA-Z][a-zA-Z ]+"), Validators.maxLength]],
      state: ['', [Validators.required, moreThanOneWhiteSpaceValidator(),Validators.pattern("[a-zA-Z][a-zA-Z ]+"), Validators.maxLength]],
      gstin: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[a-zA-Z0-9]{1}$')]],
      websiteUrl: ['', [Validators.required, Validators.pattern(URL_REG), Validators.maxLength(500)]],
      isPANVerified: ['N'],
      isCompanyPanVerify: ['N'],
      iIsGSTVerify: ['N'],
      iCompanyPanVerifyName: [''],
      iGSTVerifyName: [''],
      name_as_perpan: [''],
      merchantReturnUrl: ['', [Validators.required, Validators.pattern(URL_REG1),Validators.maxLength(2000)]],
      file: ['', []]
    });

    this.validationForm3 = this.formBuilder.group({
      // paymentDone : ['', [Validators.required]]
      resellerPartner: ['n', [Validators.required]],
      resellerPartnerId: ['', []],
      giveTestAccess: ['y',],
      pgInstruments: ['', []],
      saleLead: [, [moreThanOneWhiteSpaceValidator()]]
    });
    // this.subCategory()
  }





  downloadFile(fileName: any, filePath: any) {
    debugger
    this.fileType = filePath.split('.').pop();
    this.fileInitial = filePath.split('.')[0].split('/').pop()
    const formData = new FormData();
    formData.append('urlfile', filePath);
    formData.append('docname', '');
    this.merchantService.downlaodimage(formData).subscribe((res: any) => {
      var response = res;
      this.inkSource = 'data:image/' + this.fileType + ';base64,' + response.Data;
      // const downloadLink = document.createElement("a");
      // const NewfileName = "Payments_" + today.getFullYear().toString() + "-" + ("0" + (today.getMonth() + 1)).slice(-2) + ("0" + today.getDate()).slice(-2) + "-" + random.toString().slice(-4) + this.fileInitial + "." + this.fileType;

      // downloadLink.href = linkSource;
      // downloadLink.download = NewfileName;
      // downloadLink.click();
    })


  }
  addContact(event: any, type: any) {
    debugger

    if (type == "Click") {
      event?.preventDefault()
    }

    if (this.additionalCount > 4) {
      this.alertService.errorAlert({
        text: "Maximum allowed additional contact reached"
      })
      return
    }
    this.additionalCount++;
    const control = <FormArray>this.validationForm1.controls['additionalcontact'];
    control.push(
      // new FormArray([
      this.formBuilder.group({
        iName: [type.iName, [moreThanOneWhiteSpaceValidator(), Validators.pattern("[a-zA-Z][a-zA-Z ]+"), Validators.maxLength]],
        contact_number: [type.contact_number, [Validators.pattern("[123456789][0-9]{9}")]],
        designation: [type.designation, [moreThanOneWhiteSpaceValidator(), Validators.pattern("[a-zA-Z][a-zA-Z ]+"), Validators.maxLength]],
        email_id: [type.email_id, [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],

      })

      // ])

    );

  }

  // removeContact(index: any) {
  //   this.additionalCount--;
  //   const control = <FormArray>this.validationForm1.controls['additionalcontact'];
  //   control.removeAt(index);
  // }

  removeContact(event: Event, index: any) {
    event.preventDefault();
    let cnfFLag = false
    const control = <FormArray>this.validationForm1.controls['additionalcontact'];
    Object.keys(control.value[index]).forEach((key)=>{
      if(control.value[index][key]){
        cnfFLag = true;
      }
    });
    // this.alertService.confirmBox()
    if(cnfFLag) {
      this.alertService.directconfirmBox(
        async () => {
          // this.loaderService.showLoader();
          this.additionalCount--;
          control.removeAt(index);
        },
        {
          title: `<h4>Are you sure to remove this addtional details?</h4>`,
          html: ``,
          text: ``,
        }
        ,
        {
          // html: "Record have been deleted successfully.!"
        },
        async () => {
          this.loaderService.hideLoader();
        },
        async (err: any) => {
          this.loaderService.hideLoader();
        },
        {
          html: "Your record is safe."
        })
    }else{
      this.additionalCount--;
      control.removeAt(index);
    }

  }

  noKeyInput($event: any) {
    return false
  }

  get form1() {
    return this.validationForm1.controls;
  }

  get form2() {
    return this.validationForm2.controls;
  }

  get form3() {
    return this.validationForm3.controls;
  }
  get userFormGroups() {
    return this.validationForm1.get('additionalcontact') as FormArray
  }
  get emailValidation(): any {
    debugger
    return this.userFormGroups.controls
  }

  async ngOnInit(): Promise<void> {debugger
    const path = this.location.prepareExternalUrl(this.location.path());
    this.permissions = this.menuService.getPermissions(path);
    this.navigationMode = new ConfigurableNavigationMode("deny", "deny")
    this.fileResponse = false
    this.fileName = false
    // this.navigationMode = new ConfigurableNavigationMode("allow", "allow")
    // this.merchantService.getBusinessType().subscribe((data) => this.businessTypeOptions = data)
    // this.merchantService.getMerchantCategory().subscribe((data) => this.merchantCategoryOptions = data)
    // this.merchantService.getInstrumentMaster().subscribe((data) => this.instrumentMasterOptions = data)
    // this.merchantService.getResellerList().subscribe((data) => this.resellerListOptions = data)
    const businessType$ = this.merchantService.getBusinessType();
    this.businessTypeOptions = await lastValueFrom(businessType$);

    // this.subcategoryTypeOptions = await lastValueFrom(subcategoryType$);
    const merchantCategory$ = this.merchantService.getMerchantCategory()
    this.merchantCategoryOptions = await lastValueFrom(merchantCategory$);
    const instrumentMaster$ = this.merchantService.getInstrumentMaster()
    this.instrumentMasterOptions = await lastValueFrom(instrumentMaster$);
    const resellerList$ = this.merchantService.getResellerList()
    this.resellerListOptions = await lastValueFrom(resellerList$);
    this.resellerListOptions = this.resellerListOptions.map((res) => {debugger
      return {
        FieldText: `${res.FieldText} (${res.FieldValue})`,
        FieldValue: res.FieldValue
      }
    });
    this.route.queryParams
      .subscribe(params => {
        this.queryParams = params;
        if (params?.mid) {
          this.navigationMode = new ConfigurableNavigationMode("allow", "allow")
          this.merchantId = params?.mid;
          this.merchantService.getMerchant(params?.mid).subscribe((res) => {
            this.setFormValues(res);
          });
        }
        if (params?.action) {
          this.isAdd = (params.action.toLowerCase() == 'add')
        }
      }
      );
    /**
     * form1 value validation
     */

    const resellerPartnerCtrl = <FormControl>this.validationForm3.get('resellerPartner');
    const resellerPartnerIdCtrl = <FormControl>this.validationForm3.get('resellerPartnerId');
    const testAccessCtrl = <FormControl>this.validationForm3.get('giveTestAccess');
    const pgInstrumentsCtrl = <FormControl>this.validationForm3.get('pgInstruments');

    this.resellerSubscription = resellerPartnerCtrl.valueChanges.subscribe(value => {
      if (value == 'y') {
        resellerPartnerIdCtrl.setValidators([Validators.required,])
      } else {
        resellerPartnerIdCtrl.setValidators(null);
      }

      resellerPartnerIdCtrl.updateValueAndValidity();
    });

    this.testAccessSubscription = testAccessCtrl.valueChanges.subscribe(value => {
      // if (value == 'y') {
      //   pgInstrumentsCtrl.setValidators([Validators.required])
      // } else {
      //   pgInstrumentsCtrl.setValidators(null);
      // }

      pgInstrumentsCtrl.updateValueAndValidity();
    });

    this.isForm1Submitted = false;
    this.isForm2Submitted = false;
    this.isForm3Submitted = false;
    // this.isForm4Submitted = false;
    // this.isForm5Submitted = false;
    // this.isForm6Submitted = false;
    // this.validationForm3.controls['pgInstruments'].disable();
    if (!(this.permissions.includes('Add New') || this.permissions.includes('Edit'))) {
      this.validationForm1.disable()
      this.validationForm2.disable()
      this.validationForm3.disable()
    }
    // this.removeContact(0)
    // var length = this.additionalContact.length
    // for (let i = 0; i < length; i++) {
    //   this.addContact("","Onload");
    // }
    this.saleLeadList()
  }
  disableInputs() {
    (<FormArray>this.validationForm1.get('additionalcontact'))
      .controls
      .forEach(control => {
        control.disable();
      })
  }
  async setFormValues(data: any) {
    debugger


    const valueObj = Array.isArray(data) ? data[0] : data || {};
    const merchantSubCategory$ = this.merchantService.getMerchantSubCategory(valueObj?.merchant_category_code)
    this.merchantSubCategoryOptions = await lastValueFrom(merchantSubCategory$);
    this.validationForm1.get('contactName')?.setValue(valueObj?.contact_person)
    this.validationForm1.get('contactNumber')?.setValue(valueObj?.contact_number)
    this.validationForm1.get('emailId')?.setValue(valueObj?.email_id)

    this.validationForm2.get('pan')?.setValue(valueObj?.CompanyPAN)
    this.validationForm2.get('legalName')?.setValue(valueObj?.merchant_name)
    this.validationForm2.get('brandName')?.setValue(valueObj?.business_name)

    this.validationForm2.get('businessType')?.setValue(Number(valueObj?.BusinessType))
    this.validationForm2.get('dateOfIncorporation')?.setValue(valueObj?.DateofIncorporation)
    this.validationForm2.get('businessCategory')?.setValue(Number(valueObj?.merchant_category_code))
    // this.subCategory(valueObj?.merchant_category_code);
    this.validationForm2.get('subCategory')?.setValue(Number(valueObj?.merchant_sub_category))
    this.validationForm2.get('businessModel')?.setValue(valueObj?.BusinessModel)
    this.validationForm2.get('turnOverLastFinYear')?.setValue(valueObj?.TurnoverinlastFinancialYear)
    this.validationForm2.get('expMonthlyTurnOver')?.setValue(valueObj?.ExpectedMonthlyIncome)
    this.validationForm2.get('avgAmountPerTransaction')?.setValue(valueObj?.AverageAmountPerTransaction)
    this.validationForm2.get('authPersonPan')?.setValue(valueObj?.AuthorisedSignatoryPAN)
    this.validationForm2.get('authPersonPanName')?.setValue(valueObj?.NameAsPerPAN)
    this.validationForm2.get('address')?.setValue(valueObj?.RegisteredAddress)
    this.validationForm2.get('pincode')?.setValue(valueObj?.Pincode)
    this.validationForm2.get('city')?.setValue(valueObj?.City)
    this.validationForm2.get('state')?.setValue(valueObj?.State)
    this.validationForm2.get('gstin')?.setValue(valueObj?.GSTINNo)
    this.validationForm2.get('websiteUrl')?.setValue(valueObj?.website)
    this.validationForm2.get('isPANVerified')?.setValue(valueObj?.IsPANVerified)
    this.validationForm2.get('isCompanyPanVerify')?.setValue(valueObj?.IsCompanyPanVerify)
    this.validationForm2.get('iIsGSTVerify')?.setValue(valueObj?.IsGSTVerify)
    this.validationForm2.get('iCompanyPanVerifyName')?.setValue(valueObj?.CompanyPanVerifyName)
    this.validationForm2.get('iGSTVerifyName')?.setValue(valueObj?.GSTVerifyName)
    this.validationForm2.get('name_as_perpan')?.setValue(valueObj?.name_as_perpan)
    this.validationForm2.get('merchantReturnUrl')?.setValue(valueObj?.mer_return_url)
    // this.validationForm2.get('file')?.setValue(valueObj?.logoPath.split("/").pop())
    this.validationForm3.get('resellerPartner')?.setValue(valueObj?.reseller_id ? 'y' : 'n')
    this.validationForm3.get('resellerPartnerId')?.setValue(valueObj?.reseller_id)
    this.fileName = valueObj?.logoPath.split("/").pop() || ''
    this.fileResponse = valueObj?.logoPath
    // var Newdata:any = 0
    // this.saleLeadData.forEach((element:any) => {debugger
    //   if(element.FieldValue==parseInt(valueObj?.sales_lead)){
    //     Newdata = element.FieldText
    //   }
    // });
    this.validationForm3.get('saleLead')?.setValue(valueObj?.sales_lead==''?null:valueObj?.sales_lead )
    this.selectedAttributesdata = valueObj?.reseller_id;
    this.validationForm3.get('giveTestAccess')?.setValue(valueObj?.IsTestAccess)
    this.additionalContact = JSON.parse(valueObj.additional_contact) || []
    this.downloadFile("", valueObj?.logoPath);
    // this.validationForm1.get('additionalcontact')?.setValue( this.additionalContact)
    for (let i = 0; i < this.additionalContact.length; i++) {
      debugger
      this.addContact("", this.additionalContact[i]);

    }
    //additionalContact.get('additionalcontact')?.setValue(valueObj?.IsTestAccess)

    valueObj?.Instruments && valueObj?.Instruments != '' ? this.validationForm3.get('pgInstruments')?.setValue(valueObj?.Instruments?.split(',').map((val: any) => {
      return this.instrumentMasterOptions.find((inOpt: DropDownValues) => inOpt.FieldValue == val)
    })) : ''

    valueObj?.IsCompanyPanVerify == 'Y' ? this.pancheck = true : this.pancheck = false
    valueObj?.IsGSTVerify == 'Y' ? this.gstcheck = true : this.gstcheck = false
    valueObj?.IsPANVerified == 'Y' ? this.authpancheck = true : this.authpancheck = false
    valueObj?.GSTVerifyName ? this.GSTData = valueObj?.GSTVerifyName : this.GSTData = ''
    // this.ValidatePAN({ "target": { "value": this.validationForm2.controls['pan'].value } }, this.validationForm2.controls['serviceprovider'].value, this.validationForm2.controls['pan'], 'pancheck', valueObj?.merchant_name)
    // this.ValidatePAN({ "target": { "value": this.validationForm2.controls['authPersonPan'].value } }, this.validationForm2.controls['authserviceprovider'].value, this.validationForm2.controls['authPersonPan'], 'authPersonPancheck', valueObj?.NameAsPerPAN);
    // this.ValidateGST({ "target": { "value": this.validationForm2.controls['gstin'].value } }, this.validationForm2.controls['gstserviceprovider'].value, this.validationForm2.controls['gstin'], 'gstcheck');
    if (!(this.permissions.includes('Add New') || this.permissions.includes('Edit'))) {
      this.disableInputs()
      this.mccSelect.readonly = true;
      document.getElementById('deleteButton')?.setAttribute('disabled','');
    }
  }

  ngAfterViewInit(){
    if (!(this.permissions.includes('Add New') || this.permissions.includes('Edit'))) {
      // this.disableInputs()
      this.mccSelect.readonly = true;
      document.getElementById('deleteButton')?.setAttribute('disabled','');
    }
  }
  changeRadioValue() {
    this.validationForm3.controls['resellerPartnerId'].setValue('')


  }

  updateValue(event: any, f: any) {
    debugger
    // this.validationForm3.controls['saleLead'].setValue(f.FieldValue)
  }

  array: any[] = [];
  file: any;
  fileName: any = false;
  fileExtension: any;
  fileExtensionError: boolean;
  fileResponse: any = false;
  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  onFileSelect(event: any) {
    debugger

    // type = type || 'single'
    if (event.target.files[0].size < 1048576) {
      if (event.target.files.length > 0) {
        var allowedExtensions = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];
        var file = event.target.files[0];
        this.file = file
        this.fileName = file.name;
        this.fileExtension = this.fileName.split('.').pop();

        if (this.isInArray(allowedExtensions, this.fileExtension)) {
          this.fileExtensionError = false;

        }
        else {
          // this.validationForm3.controls['file'].reset();
          this.fileName = false
          this.fileResponse = false
          // alert("Only " + "Image, Document, Excel and PDF" + " files are allowed");
          this.alertService.errorAlert({
            html: "Only " + "jpg, jpeg, png" + " files are allowed"
          })
          this.fileExtensionError = true;
          
          return
        }

        // this.fileExtension
        this.fileExtensionError = false;
        if (this.fileExtensionError == false) {
          if (file) {
            const formData = new FormData();
            var AddedBy: any = localStorage.getItem("user")
            formData.append('uploadLogo', file);
            formData.append('merchantId', this.merchantId || "");
            formData.append('addedBy', AddedBy);
            this.merchantService.uploadLogo(formData)
              .subscribe((data: any) => {
                this.fileResponse = data?.Data?.DocPath || "";
                this.fileName = this.fileResponse.split("/").pop()
                this.downloadFile("", this.fileResponse)
                // this.transactionListSubmitForm.controls['file'].setValue(this.fileResponse?.Data?.DocPath)
              })

          } else {
            // this.validationForm3.controls['file'].reset()
            this.fileName = false
            this.fileResponse = false
            this.alertService.errorAlert({
              html: "Failed to load file"
            })
            
          }
        }
      }
    } else {
      // this.validationForm3.controls['file'].reset()
      this.fileName = false
      this.fileResponse = false
      this.alertService.errorAlert({
        html: "Please upload an image less than 1 MB"
      })
      
    }


  }

  finishFunction() {
    debugger
    debugger
    console.log("Error2", getAllErrors(this.validationForm1));
    console.log("Error2", getAllErrors(this.validationForm2));
    console.log("Error3", getAllErrors(this.validationForm3));
    this.isForm1Submitted = true;
    this.isForm2Submitted = true;
    this.isForm3Submitted = true;
    if (this.validationForm1.valid && this.validationForm2.valid && this.validationForm3.valid) {
      this.allFields = { ...this.allFields, ...this.validationForm1.value }
      this.allFields = { ...this.allFields, ...this.validationForm2.value }
      this.allFields = { ...this.allFields, ...this.validationForm3.value }
      const merchantObj: any = {
        "merchantid": this.merchantId || "",
        "contactperson": this.allFields.contactName || '',
        "contactNumber": this.allFields.contactNumber || '',
        "companypan": this.allFields.pan || '',
        "merchantname": this.allFields.legalName || '',
        "businessname": this.allFields.brandName || '',
        "businesstype": this.allFields.businessType || '',
        "dateOfIncorporation": this.allFields.dateOfIncorporation.toString() || '',
        "merchantcatagorycode": this.allFields.businessCategory || '',
        "merchantsubcatagory": this.allFields.subCategory || '',
        "businessmodal": this.allFields.businessModel || '',
        "turnoverfyear": this.allFields.turnOverLastFinYear || '',
        "monthlyincome": this.allFields.expMonthlyTurnOver || '',
        "avgamtpertransaction": this.allFields.avgAmountPerTransaction || '',
        "authorisedpan": this.allFields.authPersonPan || '',
        "nameaspan": this.allFields.authPersonPanName || '',
        "registeraddress": this.allFields.address || '',
        "pincode": this.allFields.pincode || '',
        "city": this.allFields.city || '',
        "state": this.allFields.state || '',
        "gstno": this.allFields.gstin || '',
        "website": this.allFields.websiteUrl || '',
        "emailId": this.allFields.emailId || '',
        "iResellerId": this.allFields.resellerPartnerId || '',
        "testaccess": this.allFields.giveTestAccess || 'y',
        "instruments": (this.allFields.pgInstruments || [])?.map((d: DropDownValues) => d.FieldValue).join(',') || '',
        "isPANVerified": this.isPANVerified,
        "isCompanyPanVerify": this.isCompanyPanVerify,
        "iIsGSTVerify": this.iIsGSTVerify,
        "iCompanyPanVerifyName": this.iCompanyPanVerifyName,
        "iGSTVerifyName": this.iGSTVerifyName,
        "name_as_perpan": this.name_as_perpan,
        "merReturnUrl": this.allFields.merchantReturnUrl,
        "source": "Admin",
        "additional_contact": this.allFields.additionalcontact,
        "sales_lead": this.allFields.saleLead||'',
        "logoPath": this.fileResponse || ""
      };
      if (this.merchantId) {
        merchantObj.merchantId = this.merchantId
      }
      this.loading = true
      document?.getElementById('loading')?.classList.add("spinner-border")
      document?.getElementById('loading')?.classList.add("spinner-border-sm")
      this.merchantService.createMerchant(merchantObj).subscribe((response: any) => {
        this.loading = false
        document?.getElementById('loading')?.classList.remove("spinner-border")
        document?.getElementById('loading')?.classList.remove("spinner-border-sm")
        if (response) {
          if (response[0]?.merchantId) {
            this.queryParams = { mid: response[0]?.merchantId, ...this.queryParams }
          }
          if (this.merchantId) {
            this.queryParams.mid = this.merchantId;
            // alert('Successfully updated merchant')
            this.alertService.successAlert("Merchant Updated Successfully.!", "")
          } else {
            // alert('Successfully added merchant')
            this.alertService.successAlert("Merchant Added Successfully.!", "")
          }


          this.router.navigate(['/merchants/merchant-creation/merchant-account'], {
            queryParams: { ...this.queryParams }
          })
          // this.closeModal.emit({
          //   showModal: false
          // })
        }
        // this.closeModal.emit({
        //   showModal: false
        // })


      })
    } else {
      this.validationForm1.markAsTouched()
      this.validationForm2.markAsTouched()
      this.validationForm3.markAsTouched()
      if (!this.validationForm1.valid) {
        this.wizardForm.canGoToStep(1)
      } else if (!this.validationForm2.valid) {
        this.wizardForm.canGoToStep(2)
      } else if (!this.validationForm3.valid) {
        this.wizardForm.canGoToStep(3)
      }
    }

  }

  /*get form4() {
    return this.validationForm4.controls;
  }
  get form5() {
    return this.validationForm5.controls;
  }
  get form6() {
    return this.validationForm6.controls;
  }*/
  resetPAN(event: any, control: any, checkcontrol: any) {
    //this.validPAN = false
    var serviceprovider = event.target.value
    var data = {
      "serviceprovider": serviceprovider,
      "pan": control.value
    }
    if (control.value?.length == 10 && control.valid) {

      this.KYCService.PANValidate(data).subscribe((res: any) => {
        console.log(res)
        this.validPAN = res
        // checkcontrol.setValue(true)

        if ((this.validPAN?.status == 'SUCCESS' && this.validPAN?.kycStatus == 'SUCCESS') || this.validPAN?.result.name) {
          this.validationPAN = true
          if (checkcontrol == 'pancheck') {
            this.pancheck = true
            let legalName = this.validationForm2.get('legalName')?.value
            this.validationForm2.controls['legalName'].setValue(this.validPAN?.kycResult?.name || this.validPAN?.result.name || legalName)
            this.isCompanyPanVerify = 'Y'
            this.iCompanyPanVerifyName = this.validPAN?.kycResult?.name || this.validPAN?.result.name || ''

          }
          if (checkcontrol == 'authPersonPancheck') {
            this.authpancheck = true
            this.validationForm2.controls['authPersonPanName'].setValue(this.validPAN?.kycResult?.name || this.validPAN?.result.name)
            this.isPANVerified = 'Y'
            this.name_as_perpan = this.validPAN?.kycResult?.name || this.validPAN?.result.name || ''

          }
          // const Validcheck = document.getElementById(checkcontrol) as HTMLElement
          // Validcheck.style.display = "block";
        } else {
          this.validationPAN = false
          if (checkcontrol == 'pancheck') {
            this.pancheck = false
            let legalName = this.validationForm2.get('legalName')?.value
            this.validationForm2.controls['legalName'].setValue(legalName || "")
            this.isCompanyPanVerify = 'N'
            this.iCompanyPanVerifyName = ''
          }
          if (checkcontrol == 'authPersonPancheck') {
            this.authpancheck = false
            this.validationForm2.controls['authPersonPanName'].setValue("")
            this.isPANVerified = 'N'
            this.name_as_perpan = ''
          }
          // const ValidcheckNone = document.getElementById(checkcontrol) as HTMLElement
          // ValidcheckNone.style.display = "none";
        }
      })
    } else {
      this.validPAN = false
      if (checkcontrol == 'pancheck') {
        this.pancheck = false
        let legalName = this.validationForm2.get('legalName')?.value
        this.validationForm2.controls['legalName'].setValue(legalName || "")
        this.isCompanyPanVerify = 'N'
        this.iCompanyPanVerifyName = ''
      }
      if (checkcontrol == 'authPersonPancheck') {
        let authPanName = this.validationForm2.get('authPersonPanName')?.value
        this.authpancheck = false
        this.validationForm2.controls['authPersonPanName'].setValue(authPanName || "")
        this.isPANVerified = 'N'
        this.name_as_perpan = ''
      }
      // this.pancheck = false
      // this.authpancheck = false
      // checkcontrol.setValue(false)
      // const ValidcheckNone = document.getElementById(checkcontrol) as HTMLElement
      // ValidcheckNone.style.display = "none";
      return
    }
  }

  ValidatePAN(event: any, serviceprovider: any, control: any, checkcontrol: any, value: any) {
    control.setValue(event.target.value.toUpperCase())
    this.PANvalue = event.target.value.toUpperCase()
    var data = {
      "serviceprovider": serviceprovider,
      "pan": this.PANvalue
    }
    if (this.PANvalue.length == 10 && control.valid) {
        this.KYCService.PANValidate(data).subscribe((res: any) => {
        this.validPAN = res

        if ((this.validPAN?.status == 'SUCCESS' && this.validPAN?.kycStatus == 'SUCCESS') || this.validPAN?.result.name) {
          this.validationPAN = true
          if (checkcontrol == 'pancheck') {
            this.pancheck = true
            let legalName = this.validationForm2.get('legalName')?.value
            this.validationForm2.controls['legalName'].setValue(value || this.validPAN?.kycResult?.name || this.validPAN?.result.name || legalName)

            this.isCompanyPanVerify = 'Y'
            this.iCompanyPanVerifyName = this.validPAN?.kycResult?.name || this.validPAN?.result.name || ''
          }
          if (checkcontrol == 'authPersonPancheck') {
            let authPanName = this.validationForm2.get('authPersonPanName')?.value
            this.authpancheck = true
            this.isPANVerified = 'Y'
            this.name_as_perpan = this.validPAN?.kycResult?.name || this.validPAN?.result.name || ''
            this.validationForm2.controls['authPersonPanName'].setValue(value || this.validPAN?.kycResult?.name || this.validPAN?.result.name || authPanName)
          }
          // const Validcheck = document.getElementById(checkcontrol) as HTMLElement
          // Validcheck.style.display = "block";
          //  checkcontrol.setValue(true)
        } else {
          this.validationPAN = false
          if (checkcontrol == 'pancheck') {
            this.pancheck = false
            let legalName = this.validationForm2.get('legalName')?.value
            this.validationForm2.controls['legalName'].setValue(legalName || "")

            this.isCompanyPanVerify = 'N'
            this.iCompanyPanVerifyName = ''
          }
          if (checkcontrol == 'authPersonPancheck') {
            let authPanName = this.validationForm2.get('authPersonPanName')?.value
            this.authpancheck = false
            this.validationForm2.controls['authPersonPanName'].setValue(authPanName || "")
            this.isPANVerified = 'N'
            this.name_as_perpan = ''

          }
          const ValidcheckNone = document.getElementById(checkcontrol) as HTMLElement
          ValidcheckNone.style.display = "none";
          // checkcontrol.setValue(false)
        }
      })
    } else {
      this.validPAN = false
      if (checkcontrol == 'pancheck') {
        this.pancheck = false
        let legalName = this.validationForm2.get('legalName')?.value
        this.validationForm2.controls['legalName'].setValue(legalName || "")
        this.isCompanyPanVerify = 'N'
        this.iCompanyPanVerifyName = ''
      }
      if (checkcontrol == 'authPersonPancheck') {
        let authPanName = this.validationForm2.get('authPersonPanName')?.value
        this.authpancheck = false
        this.validationForm2.controls['authPersonPanName'].setValue(authPanName || "")
        this.isPANVerified = 'N'
        this.name_as_perpan = ''
      }
      // const ValidcheckNone = document.getElementById(checkcontrol) as HTMLElement
      // ValidcheckNone.style.display = "none";
      return
    }
  }
  resetSubcategory() {
    this.validationForm2.controls['subCategory'].setValue(null);
    this.merchantSubCategoryOptions = [];
  }
  async subCategory(e: any) {

    // this.subCategoryData = e.target.value;
    if (e && e !== '') {
      this.resetSubcategory();
      this.subCategoryData = (e).toString();
      const merchantSubCategory$ = this.merchantService.getMerchantSubCategory(this.subCategoryData)
      this.merchantSubCategoryOptions = await lastValueFrom(merchantSubCategory$);
      document?.getElementById('businessType')?.classList.remove("hello")
      document?.getElementById('businessCategory')?.classList.remove("hello")
    } else {
      document?.getElementById('businessType')?.classList.add("hello")
      document?.getElementById('businessCategory')?.classList.add("hello")

    }

  }

  OnlyCharacterAllowed(event: { which: any; keyCode: any; }): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  OnlyCharacterNumberAllowed(event: { which: any; keyCode: any; }): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  OnlyCharacterNumberAllowedWithDot(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode == 32) || (charCode == 46)) {
      // console.log('charCode restricted is' + charCode)
      return true;
    }
    return false;
  }

  upperCase($event: Event): void {


  }

  resetGST(event: any, control: any, checkcontrol: any) {

    //this.validPAN = false
    var serviceprovider = event.target.value
    var data = {
      "serviceprovider": serviceprovider,
      "gstin": control.value
    }
    if (control.value?.length == 15 && control.valid) {

      this.KYCService.GSTValidate(data).subscribe((res: any) => {
        console.log(res)
        this.validGST = res
        if ((this.validGST?.status == 'SUCCESS' && this.validGST?.kycStatus == 'SUCCESS') || this.validGST?.result.lgnm) {
          this.validationGST = true
          if (checkcontrol == 'gstcheck') {
            this.gstcheck = true
            this.GSTData = this.validGST?.kycResult?.legalName || this.validGST?.result.lgnm
            console.log(this.GSTData)
            this.iIsGSTVerify = 'Y'
            this.iGSTVerifyName = this.validGST?.kycResult?.legalName || this.validGST?.result.lgnm
          }
        } else {
          this.validationGST = false
          if (checkcontrol == 'gstcheck') {
            this.gstcheck = false
            this.GSTData = ""
            this.iIsGSTVerify = 'N'
            this.iGSTVerifyName = ''
          }
        }
      })
    } else {
      this.validGST = false
      if (checkcontrol == 'gstcheck') {
        this.gstcheck = false
        this.GSTData = ""
        this.iIsGSTVerify = 'N'
        this.iGSTVerifyName = ''
      }
      return
    }
  }

  ValidateGST(event: any, serviceprovider: any, control: any, checkcontrol: any) {
    // this.PANValue = this.PANValue.toUpperCase();
    // this.authPANValue = this.authPANValue.toUpperCase();
    // this.GSTValue = this.GSTValue.toUpperCase();
    control.setValue(event.target.value.toUpperCase())
    this.GSTvalue = event.target.value.toUpperCase()
    var data = {
      "serviceprovider": serviceprovider,
      "gstin": this.GSTvalue
    }
    if (this.GSTvalue.length == 15 && control.valid) {

      this.KYCService.GSTValidate(data).subscribe((res: any) => {
        console.log(res)
        this.validGST = res

        if ((this.validGST?.status == 'SUCCESS' && this.validGST?.kycStatus == 'SUCCESS') || this.validGST?.result.name) {
          this.validationGST = true
          if (checkcontrol == 'gstcheck') {
            this.gstcheck = true
            this.GSTData = this.validGST?.kycResult?.legalName || this.validGST?.result.lgnm
            console.log(this.GSTData)
            this.iIsGSTVerify = 'Y'
            this.iGSTVerifyName = this.validGST?.kycResult?.legalName || this.validGST?.result.lgnm
          }
        } else {
          this.validationGST = false
          if (checkcontrol == 'gstcheck') {
            this.gstcheck = false
            this.GSTData = ""
            this.iIsGSTVerify = 'N'
            this.iGSTVerifyName = ''
          }
        }
      })
    } else {
      this.validGST = false
      if (checkcontrol == 'gstcheck') {
        this.gstcheck = false
        this.GSTData = ""
        this.iIsGSTVerify = 'N'
        this.iGSTVerifyName = ''
      }
      return
    }
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.validationForm2.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  form1Submit() {
    debugger
    if (this.validationForm1.valid) {
      this.wizardForm.goToNextStep();
    }
    this.allFields = { ...this.allFields, ...this.validationForm1.value }
    this.isForm1Submitted = true;
  }

  form2Submit() {
    setTimeout(() => {
      if (this.validationForm2.valid) {
        document?.getElementById('businessType')?.classList.remove("hello")
        document?.getElementById('businessCategory')?.classList.remove("hello")
        this.wizardForm.goToNextStep();
      } else {
        if (this.validationForm2.controls['businessType'].invalid || this.validationForm2.controls['businessCategory'].invalid) {
          document?.getElementById('businessType')?.classList.add("hello")
          document?.getElementById('businessCategory')?.classList.add("hello")
        } else {
          document?.getElementById('businessType')?.classList.remove("hello")
          document?.getElementById('businessCategory')?.classList.remove("hello")
        }
      }
      this.allFields = { ...this.allFields, ...this.validationForm2.value }
      this.isForm2Submitted = true;
      window.scroll({
        // top: 50,
        //  left: 0,
        behavior: 'smooth'
      });

      this.highlight = false;
      // this.accPan.nativeElement.focus();
      document?.getElementById(this.findInvalidControls()[0])?.focus();
      console.log("hhhhhh" + this.findInvalidControls().toString())
      // document.getElementsByClassName('ng-invalid')?.focus();
      setTimeout(() => {
        this.highlight = true;

      }, 1000);
    }, 0);


  }

  form3Submit() {
    if (this.validationForm3.valid) {
      this.wizardForm.goToNextStep();
    }
    this.allFields = { ...this.allFields, ...this.validationForm3.value }
    this.isForm3Submitted = true;
  }
  fun(id: any) {
    document?.getElementById(id)?.classList.add("hey")
  }
  funover(id: any) {
    document?.getElementById(id)?.classList.remove("hey")
  }

  saleLeadList() {
    debugger
    var data = {
      "Type": "29",
      "Value": ""
    }
    this.merchantService.getSaleLead(data).subscribe((res) => {

      this.saleLeadData = res

    })
  }


  /*form4Submit() {
    if(this.validationForm4.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm4Submitted = true;
  }
  form5Submit() {
    if(this.validationForm5.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm5Submitted = true;
  }

  form6Submit() {
    if(this.validationForm6.valid) {
      this.wizardForm.goToNextStep();
    }
    this.isForm6Submitted = true;
  }*/

  OnlyNumbersAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return (charCode > 47 && charCode < 58);

  }
  NoSpaceAllowed(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 32) {
      return false
    } else {
      return true
    }

  }
}
