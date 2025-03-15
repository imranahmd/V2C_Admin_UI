import {EventEmitter, Injectable, Output, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {ApiHttpService} from "../../../_services/api-http.service";
import { StorageService } from '../../../_services/storage.service';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/common/modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

const {API_URL} = environment;
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @ViewChild('modal') private modalContent: TemplateRef<ModalComponent>
  constructor(private apiHttpService: ApiHttpService, private storageService: StorageService, private router: Router,
    private modalService: NgbModal,private location: Location) {
  }

  login(username: string, password: string): Observable<any> {
    return this.apiHttpService.post(
      API_URL + '/token',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  forgotPassword(username: string): Observable<any>{
    return this.apiHttpService.post(
      API_URL + '/forgetPassword',
      {
        userId: username,
      },
      httpOptions
    );
  }

  resetPassword(token: string, password: string): Observable<any>{
    return this.apiHttpService.post(
      API_URL + '/reset-password',
      {
        token,
        password
      },
      httpOptions
    );
  }

  resetPasswordLogin(currentPassword: string, newPassword: string): Observable<any>{
    return this.apiHttpService.post(
      API_URL + '/reset-password-internal',
      {
        "oldpassword":currentPassword,
        "newpassword":newPassword
      },
      httpOptions
    );
  }

  getProfile(): Observable<any>{
    return this.apiHttpService.get(
      // API_URL + '/GetDetails',
      API_URL + '/GetDetailsApi',
      httpOptions
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.apiHttpService.post(
      API_URL + 'auth/register',
      {
        username,
        email,
        password,
      },
      httpOptions
    );
  }

  reloadPage() {
    window.location.reload();
  }

  logout(){debugger
    // e.preventDefault();
    this.storageService.clean() 
    // this.modalService.dismissAll()   
  

    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/auth/login'])
      .then(() => {
        window.location.reload();
        
      });
      // this.reloadPage();
    }
    // return this.apiHttpService.post(API_URL + 'auth/signout', {}, httpOptions);
  }
}
