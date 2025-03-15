import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../auth.service";
import {StorageService} from "../../../../_services/storage.service";
import * as CryptoJS from 'crypto-js';
import Swal from "sweetalert2";
import {MenusService} from "../../../../_services/menu.service";
import {AlertService} from "../../../../_services/alert.service";
import {environment} from "../../../../../environments/environment";
import { LoaderService } from 'src/app/_services/loader.service';

const {API_URL} = environment

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  focus:any;
  focus1:any;
  returnUrl: any;
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  checked: boolean = false;
  images: any;
  dataArray:any;
  dataSliderTextArray:any;
  activeSlide = 0;

  constructor(private menuService: MenusService,private loaderService: LoaderService, private alertService: AlertService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private storageService: StorageService) {
    localStorage.setItem("mode","1")
    this.images = ["/assets/images/image1.svg", "/assets/images/image2.svg", "/assets/images/image3.svg"];
    this.dataArray = ["Integrate payment systems effortlessly to"  + `<br /> `+ "drive business growth", "Strengthen transaction security for"  + `<br /> `+ "heightened protection and customer trust", "Expand globally and expand diverse" + `<br /> `+ " payment for different customer"];
    this.dataSliderTextArray  = ["Smooth Integration", "Fortified Security", "Global Transaction"];
  }

  getCookie(name: any): any {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts;
  }

  Remember(event: any) {

    //  this.checked = event.checked

    function setCookie(key: any, value: any) {
      document.cookie = key + "=" + escape(value) +
        ";domain=" + window.location.hostname +
        ";path=/";
    }

    // delete cookie
    function deleteCookie(name: any) {
      // setCookie(name, "");
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // var remember_me_check_box = $("#authCheck")
    // handle click and add & delete cookie

    if (this.checked) {
      deleteCookie('authCheck');
      // localStorage.removeItem('authCheck');
      //  localStorage.removeItem('authCheck');
      var username = this.form.username
      var password = this.form.password
      var data = {[username]: password}
      var dataString = JSON.stringify(data)
      var encData = btoa(dataString)
      setCookie('authCheck', encData);
      //   localStorage.setItem('authCheck', btoa(this.f.username.value+","+ this.f.password.value));
      //   localStorage.setItem('authCheck', btoa(this.f.username.value+","+ this.f.password.value));

    }
    // else {
    //   deleteCookie('authCheck');
    //   localStorage.removeItem('authCheck');
    //   localStorage.removeItem('authCheck');

    //   setCookie('authCheck', 'no');
    //   localStorage.setItem('authCheck', 'no');
    //   localStorage.setItem('authCheck', 'no');
    // }
  }

  toggle(event: any) {

    this.checked = event.target.checked
  }

  ngOnInit(): void {


    if (this.getCookie('authCheck')) {
      var w = this.getCookie('authCheck')[1]
      var x = atob(decodeURIComponent(w))
      var y = JSON.parse(x)

      if (y) {

        var user = Object.keys(y)[0]
        var pass = Object.values(y)[0]
        //y[1].split(',')[1]
        this.form.username = user
        this.form.password = pass

      }
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.router.navigate([this.returnUrl]);
    }
    this.loaderService.hideLoader();
  }

  // onLoggedin(e: Event) {
  //   e.preventDefault();
  //   localStorage.setItem('isLoggedin', 'true');
  //   if (localStorage.getItem('isLoggedin')) {
  //     this.router.navigate([this.returnUrl]);
  //   }
  // }

  onLoggedin(e: Event, f: any): void {
    e.preventDefault();

    if (f.form.status == 'VALID') {
      var {username, password} = this.form;

      var key = CryptoJS.enc.Base64.parse('QmFyMTIzNDVCYXIxMjM0NQ==');
      var initVector = CryptoJS.enc.Base64.parse('UmFuZG9tSW5pdFZlY3Rvcg==');

      //alert($("#password").val());

    var encryptedPassword = CryptoJS.AES.encrypt(password, key,
      {
        iv: initVector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    var encryptedPasswordString = encryptedPassword.ciphertext.toString(CryptoJS.enc.Base64);
    var button = document.getElementById('password') as HTMLElement;

    button.setAttribute('value', encryptedPasswordString);
    //$("#password").val(encryptedPasswordString)
    password = encryptedPasswordString
    this.authService.login(username, password).subscribe({
      next: data => {debugger
        if (data==undefined || data.error) {
          this.alertService.toastErrorMessageAlert({
            title: 'Invalid Username or Password!',
          })
          return
        }
        this.Remember(''),
          this.alertService.toastSuccessMessageAlert({
            title: 'Login successfully',
            html: '<b>Welcome...</b>'
          })
        this.storageService.saveUser(data);
        this.authService.getProfile().subscribe({
          next: data => {
            localStorage.setItem('date', data.currentDate);
            const {Menu} = data;
            const menuData = this.menuService.structuredMenu(Menu)
            localStorage.setItem('menuItemsFormatted', JSON.stringify(menuData));
            if (menuData.finalMenus[0].ROLENAME =="Reseller"||menuData.finalMenus[0].ROLENAME =="Merchant" ){
              this.alertService.errorAlert({
                title: "NO Access! Contact Administrator",
                backdrop: true,
                toast: true,
                timer: 1800,
                position:'top-end'
              })
              this.authService.logout();


            }
          }
        })
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        if (this.storageService.isLoggedIn()) {
          this.router.navigate([this.returnUrl])
          // .then(() => {
          //   this.router.navigate(['/merchants/merchant-master']);
          //   });
          // console.log("==========>", this.returnUrl)
          this.router.navigate(['/']);
        }
        // this.reloadPage();
        this.router.navigate(['/']);
      },
      error: err => {
        this.alertService.toastErrorMessageAlert({
          title: 'Something went wrong!',
        })

        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: 'Something went wrong!',
        //   // footer: '<a href>Why do I have this issue?</a>'
        // })
        console.log("err====>", err);
        this.errorMessage = err.error?.message;
        this.isLoginFailed = true;
      }
    });

}
f.submitted=true
// f.form.status=='INVALID'

  }

  onSlideChange(event: any) {
    this.activeSlide = +event.current;
  }

  reloadPage(): void {
    window.location.reload();
  }
}
