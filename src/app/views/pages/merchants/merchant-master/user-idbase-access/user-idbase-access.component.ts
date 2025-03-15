import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {ApiHttpService} from "../../../../../_services/api-http.service";
import { environment } from 'src/environments/environment';
 import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MerchantService } from '../merchant.service';
import { AlertService } from 'src/app/_services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenusService } from 'src/app/_services/menu.service';
import {DatePipe, Location} from "@angular/common";
import { LoaderService } from 'src/app/_services/loader.service';

const {API_URL} = environment;
@Component({
  selector: 'app-user-idbase-access',
  templateUrl: './user-idbase-access.component.html',
  styleUrls: ['./user-idbase-access.component.scss']
})
export class UserIDBaseAccessComponent implements OnInit {
  
  @Input() merchantId: string;
  @Input() onMerchantChange: EventEmitter<any> = new EventEmitter<any>();
  userForm: FormGroup
  Status: any = [];
  loading: boolean = false;
  response: any
  menuData: any;
  array: never[];
  items!: FormArray;
  roleID: any = "2";
  FinalPermissions: any[] = [];
  MenuValues: any = [];
  resdata: any;
  private queryParams: any = {};
  public permissions: any;
  isDisable: boolean = false;
  constructor(private fb: FormBuilder, private merchantService: MerchantService, private alertService: AlertService ,private route: ActivatedRoute, private router: Router, private menuService: MenusService, private location: Location,private loaderService: LoaderService ) {
    this.userForm = fb.group({

      merchantId: [, []],
      menuName: this.fb.array([],),
      menuMainName: [this.fb.array([],)]
    })
  }

  ngOnInit(): void {
    this.loaderService.showLoader();

    // this.onMerchantMId.subscribe((res: any) => {
    //   debugger


    //   var e = {
    //     "target": { 'value': "" }
    //   }
    //   var x = {
    //     "target": { 'value': "" }
    //   }
    //   this.roleID = res.ROLEID
    //   this.userForm.controls['Status'].disable()

    //   if (res) { this.setValues(res) }
    //   this.getrolemenu()
    //   while (this.formArray.length !== 0) {
    //     this.formArray.removeAt(0)
    //   }

    // })
    const path = this.location.prepareExternalUrl(this.location.path());
    this.permissions = this.menuService.getPermissions(path);

    // if (this.merchantId) {
    //   this.isDisable = !this.isDisable;
    // }
    this.route.queryParams
      .subscribe(params => {
          this.queryParams = params;
          this.merchantId = params?.mid || null;
          this.isDisable = true;
          this.userForm.get('merchantId')?.setValue(this.merchantId);
          this.userForm.get('merchantId')?.disable();
          this.onMerchantChange.emit(this.merchantId);
          // this.onMerchantChange.emit(this.merchantId);
        }
      );

    // this.isForm1Submitted = false;
    // @ts-ignore
    this.onMerchantChange.subscribe((data) => {
      this.merchantId = data;
      // <FormControl><unknown>this.accountform.get('merchantId')?.patchValue(data);
      // this.refreshGrid(this.merchantId);
    })

    this.MerchnatList()
    this.getrolemenu()
  }
  ngAfterViewInit() {
     this.loaderService.hideLoader(); 
  }

  getCheckedMenus(MenuData: any) {
    debugger
    let data = {
      // "MerchantId": this.userForm.controls['merchantId'].value
      "MerchantId":this.merchantId
    }
    this.merchantService.checkvalue(data).subscribe((res) => {
      let val = ''
      this.MenuValues = res.data
      this.MenuValues.forEach((element: any) => {
        debugger
        val = element.Submenu.split('_')[1]
        document.getElementById(val)?.setAttribute('checked', 'true')
        MenuData.forEach((row: any) => {
          row.SubMenu.forEach((col: any) => {
            console.log(element.Submenu.split('_')[1], col[this.getKeys(col)['key'][0]][0].SubMenuId
            , "::::::\n")
            if (element.Submenu.split('_')[1] == col[this.getKeys(col)['key'][0]][0].SubMenuId
            ) {
              console.log(element.Submenu.split('_')[1], col[this.getKeys(col)['key'][0]][0].SubMenuId
                , "::::::\n")
              this.updateChkbxArray(col[this.getKeys(col)['key'][0]][0],
                row.MenuId, row.MenuName,
                { "checked": true }, 'menuName')
            }
          })

        });
      });
    })
  }
  setValues(res: any) {
    debugger

    // this.ID = res.sp_id
    this.userForm.patchValue({
      // mid: res.mid,
      RoleName: res.ROLENAME,
      RoleDescription: res.ROLEDESCRIPTION,
      Status: res.Status



    })

  }
  updateRole(val: any) {
    let data = {
      "Rolename": val.RoleName,
      "RoleDescriptionId": val.RoleDescription,
      "RoleId": this.roleID
    }
    this.merchantService.updateRole(data).subscribe((res: any) => {
      if (res.Status == 'success') {
        this.alertService.successAlert(res.Reason);
        // this.closeModal.emit({
        //   showModal: false
        // });
      } else {
        this.alertService.errorAlert({ html: res.Reason })
        // this.closeModal.emit({
        //   showModal: false
        // });
      }
    })
  }
  updateMenu(value: any) {
    debugger
    // this.updateRole(value)
    var FinalPermissions: any = []
    var menuId: any[] = []
    var SubMenuId
      : any[] = []
    value.menuName.forEach((element: any) => {
      // delete element["PermissionAction"]
      // delete element["SubMenuName"]
      // delete element["SubMenuId"]
      if (!menuId.includes(element.MenuId)) {
        FinalPermissions.push({
          // "permissionID": "5",
          // "MenuId": element.MenuId,
          // "roleId": element.roleId,
          // "SubmenuId": element.MenuId
          "MerchantId": this.userForm.controls['merchantId'].value,
          "RoleId": element.roleId,
          "MenuId": element.MenuId,
          "MenuName": element.MenuName,
          "SubMenuName": element.SubMenuName,
          "SubMenuId": element.MenuId,
          "AddedBy": localStorage.getItem('user'),
          "Is_Delete": "N"

        },
        )
      }
      if (!SubMenuId
        .includes(element.SubMenuId
        )) {
        FinalPermissions.push(
          {
            "MerchantId": this.userForm.controls['merchantId'].value,
          "RoleId": element.roleId,
          "MenuId": element.MenuId,
          "MenuName": element.MenuName,
          "SubMenuName": element.SubMenuName,
          "SubMenuId":  element.SubMenuId,
          "AddedBy": localStorage.getItem('user'),
          "Is_Delete": "N"
          }
        )
      }
      SubMenuId
        .push(element.SubMenuId
        )
      menuId.push(element.MenuId)
    });

    let data = {
      data: FinalPermissions
    }
    if (data.data.length <= 0) {
      this.alertService.errorAlert({
        text: "Select atleast one checkbox"
      })



     
      this.loading = false
      return
    }
    this.loading = true
    document?.getElementById('loading')?.classList.add("spinner-border")
    document?.getElementById('loading')?.classList.add("spinner-border-sm")
    this.merchantService.insertmerchantmenu(data).subscribe((res: any) => {
      this.loading = false
      document?.getElementById('loading')?.classList.remove("spinner-border")
      document?.getElementById('loading')?.classList.remove("spinner-border-sm")
      if (res.Status == 'success') {
        this.alertService.successAlert(res.Reason);
        // this.closeModal.emit({
        //   showModal: false
        // });
      } else {
        this.alertService.errorAlert({ html: res.Reason })
        // this.closeModal.emit({
        //   showModal: false
        // });
      }
      this.userForm.controls['menuName'].setValue(this.fb.array([]))

    })
  }
  DeletePreviousChkbox(key: any) {
    debugger

    const chkArray: FormArray = this.userForm.get(key) as FormArray;

    let i: number = 0;
    while (chkArray.length !== 0) {
      chkArray.controls.forEach((item: any) => {
        debugger
        // if (item.value.id == chk.menuId) {

        chkArray.removeAt(chkArray.length - 1);
        return;

        i++;
      });
    }
  }
  updateChkbxArray(chk: any, value: any, menuName: any, isChecked: any, key: any) {
    debugger
    isChecked = isChecked.checked
    const chkArray: FormArray = this.userForm.get(key) as FormArray;
    chk['MenuId'] = value.toString();
    chk['roleId'] = this.roleID.toString();
    chk["MenuName"] = menuName
    chk["SubmenuId"] = chk.SubMenuId
    // submenuName
    // delete chk[0]["PermissionAction"]
    // delete chk[0]["SubMenuName"]
    if (isChecked) {
      debugger
      chkArray.push(new FormControl(chk))
      // if (chkArray.controls.findIndex(x => x.value == chk.menuId) == -1)
      // chkArray.push(new FormControl({ submenuId: chk.menuId, submenuName: chk.menu }));

    } else {
      debugger

      // let i: number = 0;
      chkArray.controls.forEach((item: any, i: any) => {
        debugger
        if (item.value.SubMenuId
          == chk.SubMenuId
        ) {
          // if (item.value == chk.menuId) {
          // chkArray.removeAt(chkArray.length - 1);
          chkArray.removeAt(i);
          return;
          // }
          // i++
        }
      });
    }
  }
  updateMenuChkbxArray(chk: any, value: any, submenuName: any, isChecked: any, key: any) {
    debugger
    isChecked = isChecked.checked
    const chkArray: FormArray = this.userForm.get(key) as FormArray;
    chk['MenuId'] = value.toString();
    chk['roleId'] = this.roleID.toString();
    // chk["SubMenuName"] = submenuName
    chk["SubmenuId"] = chk.SubMenuId
    // submenuName
    // delete chk[0]["PermissionAction"]
    // delete chk[0]["SubMenuName"]
    if (isChecked) {
      debugger
      chkArray.push(new FormControl(chk))
      // if (chkArray.controls.findIndex(x => x.value == chk.menuId) == -1)
      // chkArray.push(new FormControl({ submenuId: chk.menuId, submenuName: chk.menu }));

    } else {
      debugger

      let i: number = 0;
      chkArray.controls.forEach((item: any) => {
        debugger
        // if (item.value.id == chk.menuId) {
        // if (item.value == chk.menuId) {
        // chkArray.removeAt(chkArray.length - 1);
        // return;
        // }
        // i++;
      });
    }
  }
  updateAlreadyChkbox(chk: any, isChecked: any, key: any) {
    debugger

    const chkArray: FormArray = this.userForm.get(key) as FormArray;

    if (isChecked) {
      debugger

      if (chkArray.controls.findIndex(x => x.value == chk.menuId) == -1)
        // chkArray.push(new FormControl({ submenuId: chk.menuId, submenuName: chk.menu }));
        chkArray.push(new FormControl(chk.menuId))
    } else {
      debugger

      let i: number = 0;
      chkArray.controls.forEach((item: any) => {
        debugger
        // if (item.value.id == chk.menuId) {
        if (item.value == chk.menuId) {
          chkArray.removeAt(chkArray.length - 1);
          return;
        }
        i++;
      });
    }
  }
  getKeys(param: any) {

    return { "key": Object.keys(param), "length": Object.keys(param).length }
  }
  filter(chars: any): any {
    chars.filter((element: any, index: any) => {
      return (chars.indexOf(element) === index) || []
    });
  }
  get formArray() {
    // Typecast, because: reasons
    // https://github.com/angular/angular-cli/issues/6099
    return <FormArray>this.userForm.controls['menuName'];
  }
  getrolemenu() {
    debugger
    this.array = []
    let data = {
      "roleId": "2"

    }
    this.merchantService.getMerchantaccess(data).subscribe((res: any) => {
      debugger
      // this.menuData = JSON.parse(res.data)
      //  this.rolepermissionForm.controls['menuName']
      while (this.formArray.length !== 0) {
        this.formArray.removeAt(0)
      }
      this.menuData = res

      // this.menuData = this.response
      let controls: any = {}
      let validationsArray: any = []
      this.getCheckedMenus(this.menuData)
      // for(let row of this.menuData){
      //   for(let element of row.SubMenu){
      //     controls[element.SubMenuName] = new FormControl(null, validationsArray);
      //     controls[element.permissionID] = new FormControl(null, validationsArray);
      //   }
      // }
      // this.rolepermissionForm.patchValue({
      //   ...controls 
      //   // formControlName2: myValue2
      // });
      // controls[res.id] = new FormControl(null, validationsArray);
      // var menuData = this.menuData
      // var uniqueArray = menuData.subItems.filter(function (item: any, pos: any) {
      //   return menuData.subItems.indexOf(item) == pos;
      // })
      // this.menuData.forEach((element: any) => {
      //   Object.values(element.subItems)
      // });
      // this.menuData = this.menuData.map((m: any) => {debugger
      //   m['SubMenu'] = this.menuData.filter((ml:any) =>{ ml.SubMenuName === m.SubMenuName}).map((m:any) => {debugger
      //     return {
      //       PermissionAction: m.PermissionAction,
      //       permissionID: m.permissionID,
      //     }
      //   });
      //   return m;
      // });
    })
  }

  MerchnatList() {


    var merchantdata = {
      "name": ""
    }
    this.merchantService.GetmerchantList(merchantdata).subscribe((res: any) => {
      this.resdata = res

    })


  }


 


 
}
