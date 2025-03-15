import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {StorageService} from "../../../_services/storage.service";
import {UserService} from 'src/app/_services/user.service';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/views/pages/auth/auth.service';
import { MenusService } from 'src/app/_services/menu.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  profileData: any;
  Name: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private router: Router,
    private storageService: StorageService,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private menuService: MenusService
  ) {
  }

  ngOnInit(): void {
    this.userService.getUserProfileNew().subscribe((data) => {
      this.profileData = data;
      var a = this.profileData?.fullName.split(' ')[0]
      var b = this.profileData?.fullName.split(' ')[1]
      this.Name =   (this.profileData?.fullName.split(' ')[1])?(a.substring(0, 1)+b.substring(0, 1)).toUpperCase():a.substring(0, 2).toUpperCase()
      localStorage.setItem( "user",this.profileData?.USERID)
      const {Menu} = data;
      const menuData = this.menuService.structuredMenu(Menu)
      if (menuData.finalMenus[0].ROLENAME =="Reseller"||menuData.finalMenus[0].ROLENAME =="Merchant" ) {
        this.alertService.errorAlert({
          title: "No Access! Contact Administrator",
          backdrop: true,
          toast: true,
          timer: 1800,
          position:'top-end'
        })
        this.authService.logout();


      }
    })
    // Object.defineProperty(String.prototype, 'capitalize', {
    //   value: function() {
    //     return this.charAt(0).toUpperCase() + this.slice(1);
    //   },
    //   enumerable: false
    // });

    // this.userService.getUserProfile().subscribe((data)=>{
    //   this.profileData = data;
    //   this.profileName = this.profileData.fullName.capitalize()
    // })
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    this.storageService.clean()

    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
    }
  }

  onChangePassword(e: Event) {
    e.preventDefault();
    this.router.navigate(['/change-password']);
  }

}
