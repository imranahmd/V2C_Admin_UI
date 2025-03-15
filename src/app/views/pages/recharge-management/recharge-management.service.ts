import { Injectable } from '@angular/core';
import {ApiHttpService} from "../../../_services/api-http.service";
import { environment } from 'src/environments/environment';
const {API_URL} = environment;
@Injectable({
  providedIn: 'root'
})
export class RechargeManagementService {

  constructor(private apiHttpService:ApiHttpService) { }
  getMerchant(id: any) {
    return this.apiHttpService
      .post(`${API_URL}/MerchantCreationDetails`,
        {
          "Mid": id
        })
  }
  sendApproval(appObject: any) {
    return this.apiHttpService.post(`${API_URL}/ChangeMerchantStatus`, appObject)
  }
  Getsplist(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/Getsplist`,data

    )
  }
  AddedList(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getRList`,data

    )
  }
  DeleteData(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getRechargeDeleted`,data

    )
  }
  RechargeAdd(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getRechargeReq`,data

    )
  }
  Approve(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getApproval`,data

    )
  }
  getDropDown(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/GetDropdown`,data
     
    )
  }

  getBankStatementData(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getBankAccountStatement`,data
     
    )
  }

}
