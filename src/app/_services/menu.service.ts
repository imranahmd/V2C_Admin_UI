import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {MenuItem} from "../views/layout/sidebar/menu.model";
import {StorageService} from "./storage.service";
import {AuthService} from "../views/pages/auth/auth.service";
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  private menuData: MenuItem[] = [];
  private menuSource = new BehaviorSubject(this.menuData);
  currentMenus = this.menuSource.asObservable();

  constructor(private storageService: StorageService, private authService: AuthService,private alertService: AlertService,) {
  }

  changeMenus(menuData: MenuItem[]) {
    this.menuSource.next(this.BindMenuVariable(menuData));
  }

  BindMenuVariable(menuData: MenuItem[]) {
    return menuData;
  }

  structuredMenu(menuArray: any[], pMenuId?:any) {
    let finalMenus = [];
    let sidebarMenus: any = [];
    menuArray = menuArray.sort((a, b) => a?.Position && b?.Position ? a.Position - b.Position : 0)
    const level1 = menuArray.filter((m) => m.PMenuId === (pMenuId || 0))
    finalMenus.push(...level1);
    sidebarMenus.push(...level1.map((m) => {
      return {
        id: m.MenuId,
        label: m.MenuName,
        title: m.Title,
        link: m.MenuLink,
        icon: m.Icon || 'home'
      }
    }));
    sidebarMenus = sidebarMenus.map((m: any) => {
      m['subItems'] = menuArray.filter((ml) => ml.PMenuId === m.id).map((m) => {
        return {
          id: m.MenuId,
          label: m.MenuName,
          link: m.MenuLink,
          icon: m.Icon || 'circle'
        }
      });
      return m;
    });

    finalMenus = finalMenus.map((m) => {
      m['children'] = menuArray.filter((ml) => ml.PMenuId === m.MenuId);
      return m;
    });

    finalMenus = finalMenus.map((m1) => {
      m1['children'] = m1.children.map((m2: { [x: string]: any[]; MenuId: any; }) => {
        m2['children'] = menuArray.filter((ml) => ml.PMenuId === m2.MenuId);
        return m2;
      });
      return m1;
    })

    sidebarMenus = sidebarMenus.map((m1: any) => {
      m1['subItems'] = m1['subItems'].map((m2: any) => {
        m2['subItems'] = menuArray.filter((ml) => ml.PMenuId === m2.id).map((m) => {
          return {
            id: m.MenuId,
            label: m.MenuName,
            title: m.Title,
            link: m.MenuLink,
            icon: m.Icon || 'home'
          }
        });
        return m2;
      });
      return m1;
    })

    return {finalMenus, sidebarMenus, rawMenus: menuArray};
  }

  saveMenusItems(menuArray: any) {
    this.storageService.saveMenuItems(menuArray);
  }

  getMenusItems(): any {
    const menusItems = this.storageService.getMenuItems();
    if (menusItems) {
      return menusItems;
    } else {
      return this.authService.getProfile().subscribe((data) => {
        const {Menu} = data;
        const structMenu = this.structuredMenu(Menu);
        this.saveMenusItems(structMenu);
        if (structMenu.finalMenus[0].ROLENAME =="Reseller"||structMenu.finalMenus[0].ROLENAME =="Merchant" )
            {
                  this.alertService.errorAlert({
                    title: "No Access! Contact Administrator",
                    backdrop: true,
                    toast: true,
                    timer: 2000,				position:'top-end'
                  })
                this.authService.logout();


                }
        return structMenu;
      }, () => {

        return;
      })
    }


  }

  getPermissions(path: string): any {debugger
    if (path.charAt(0) === '#') {
      path = path.slice(1);
    }
    if (path.indexOf(";") > -1) {
      path = path.substr(0, path.indexOf(";"));
    }

    path = path.split('?')[0]
    const data = this.getMenusItems();
    const {rawMenus} = data;
    if (rawMenus) {
      const currentMenuDetails = rawMenus?.find((m: any) => m.MenuLink == path);
      // console.log(currentMenuDetails, "===============>");
      return currentMenuDetails?.PermissionAction || ''
    } else {
      return;
    }
  }

}
