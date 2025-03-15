import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormControlOptions, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MasterService } from '../master.service';
import { AlertService } from 'src/app/_services/alert.service';
@Component({
  selector: 'app-role-view',
  templateUrl: './role-view.component.html',
  styleUrls: ['./role-view.component.scss']
})
export class RoleViewComponent implements OnInit {
  rolepermissionForm: FormGroup

  @Input() merchantStatusConfig: any;
  @Input() onMerchantAdd: EventEmitter<any> = new EventEmitter<any>();
  @Input() onMerchantMId: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  Status: any = [];
  menuData: any;
  array: never[];
  items!: FormArray;
  roleID: any;
  FinalPermissions: any[] = [];
  MenuValues: any = [];
  submit1: boolean = false
  constructor(private fb: FormBuilder, private masterservice: MasterService, private alertService: AlertService) {
    this.rolepermissionForm = fb.group({
      RoleName: [, [Validators.required]],
      RoleDescription: [, [Validators.required]],
      Status: [, [Validators.required]],
      menuName: this.fb.array([],),
      menuMainName: [this.fb.array([],)]
    })

    this.Status = [{ FieldValue: '1', FieldText: 'Active' },
    { FieldValue: '2', FieldText: 'Inactive' },]
  }

  ngOnInit(): void {
    this.onMerchantMId.subscribe((res: any) => {
      debugger


      var e = {
        "target": { 'value': "" }
      }
      var x = {
        "target": { 'value': "" }
      }
      this.roleID = res.ROLEID
      // this.rolepermissionForm.controls['Status'].disable()
      //this.serviceProviderDropdown()
      //this.getBankList()
      // this.selectinstrument(x)
      if (res) { this.setValues(res) }
      this.getrolemenu()
      while (this.formArray.length !== 0) {
        this.formArray.removeAt(0)
      }
      this.submit1 = false

    })
  }
  getCheckedMenus(Role: any, MenuData: any) {
    let data = {
      "role": Role.toString()
    }
    this.masterservice.Getroledata(data).subscribe((res) => {
      let val = ''
      this.MenuValues = res.data
      this.MenuValues.forEach((element: any) => {
        debugger
        val = element.PermissionName_Id.split('_')[1]
        document.getElementById(val)?.setAttribute('checked', 'true')
        MenuData.forEach((row: any) => {
          row.SubMenu.forEach((col: any) => {
            if (element.PermissionName_Id.split('_')[1] == col[this.getKeys(col)['key'][0]][0].permissionID) {
              console.log(element.PermissionName_Id.split('_')[1], col[this.getKeys(col)['key'][0]][0].permissionID, "::::::\n")
              this.updateChkbxArray(col[this.getKeys(col)['key'][0]][0],
                row.MenuId, this.getKeys(col)['key'][0],
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
    this.rolepermissionForm.patchValue({
      // mid: res.mid,
      RoleName: res.ROLENAME,
      RoleDescription: res.ROLEDESCRIPTION,
      Status: res.StatusId



    })

  }
  updateRole(val: any) {debugger
    let data = {
      "Rolename": val.RoleName,
      "RoleDescriptionId": val.RoleDescription,
      "RoleId": this.roleID.toString(),
      "Status":val.Status

    }
    this.masterservice.updateRole(data).subscribe((res: any) => {
      if (res.Status == 'success') {
        this.alertService.successAlert(res.Reason);
        this.closeModal.emit({
          showModal: false
        });
      } else {
        this.alertService.errorAlert({ html: res.Reason })
        this.closeModal.emit({
          showModal: false
        });
      }
    })
  }
  updateMenu(value: any) {
    debugger
    this.updateRole(value)
    var FinalPermissions: any = []
    var menuId: any[] = []
    var permissionID: any[] = []
    value.menuName.forEach((element: any) => {
      delete element["PermissionAction"]
      delete element["SubMenuName"]
      delete element["SubMenuId"]
      if (!menuId.includes(element.MenuId)) {
        FinalPermissions.push({
          "permissionID": "0",
          "MenuId": element.MenuId,
          "roleId": element.roleId,
          "SubmenuId": element.MenuId
        },
        )
      }
      if (!permissionID.includes(element.permissionID)) {
        FinalPermissions.push(element)
      }
      permissionID.push(element.permissionID)
      menuId.push(element.MenuId)
    });

    let data = {
      data: FinalPermissions
    }
    if (Object.keys(data.data).length <= 0) {
      data = {
        data:
          [
            { "permissionID": "0", "MenuId": "92", "roleId":  this.roleID.toString(), "SubmenuId": "92" },
            { "permissionID": "70", "MenuId": "92", "roleId":  this.roleID.toString(), "SubmenuId": "93" }
          ]
      }
    }
    this.masterservice.Insertrolemenu(data).subscribe((res: any) => {
      if (res.Status == 'success') {
        // this.alertService.successAlert(res.Reason);
        this.closeModal.emit({
          showModal: false
        });
      } else {
        this.alertService.errorAlert({ html: res.Reason })
        this.closeModal.emit({
          showModal: false
        });
      }
      this.rolepermissionForm.controls['menuName'].setValue(this.fb.array([]))
      this.submit1 = false

    })
    this.submit1 = true
  }
  DeletePreviousChkbox(key: any) {
    debugger

    const chkArray: FormArray = this.rolepermissionForm.get(key) as FormArray;

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
  updateChkbxArray(chk: any, value: any, submenuName: any, isChecked: any, key: any) {
    debugger
    isChecked = isChecked.checked
    const chkArray: FormArray = this.rolepermissionForm.get(key) as FormArray;
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

      // let i: number = 0;
      chkArray.controls.forEach((item: any, i: any) => {
        debugger
        if (item.value.permissionID == chk.permissionID) {
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
    const chkArray: FormArray = this.rolepermissionForm.get(key) as FormArray;
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

    const chkArray: FormArray = this.rolepermissionForm.get(key) as FormArray;

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
    return <FormArray>this.rolepermissionForm.controls['menuName'];
  }
  getrolemenu() {
    debugger
    this.array = []
    let data = {
      "admin": "admin"
    }
    this.masterservice.Getrolemenu(data).subscribe((res: any) => {
      debugger
      // this.menuData = JSON.parse(res.data)
      //  this.rolepermissionForm.controls['menuName']
      while (this.formArray.length !== 0) {
        this.formArray.removeAt(0)
      }
      this.menuData = res
      let controls: any = {}
      let validationsArray: any = []
      this.getCheckedMenus(this.roleID, this.menuData)
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

}
