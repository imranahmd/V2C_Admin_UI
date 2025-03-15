import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { environment } from 'src/environments/environment';
const { API_URL } = environment;


@Injectable({
  providedIn: 'root'
})

export class MasterService {


  constructor(private apiHttpService: ApiHttpService) { }


  getinvoicestatus(data: any) {

    return this.apiHttpService
      .post(
        `${API_URL}/CreateInvoice`, data

      )
  }

  // getAudittrailList(data:any) {

  //   return this.apiHttpService
  //     .post(
  //       `${API_URL}/audittrail-List`,data

  //     )
  // }

  getRole(data: any) {

    return this.apiHttpService
      .post(
        `${API_URL}/Getrole1list`, data

      )
  }

  createRole(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/createrole1`, data

      )
  }

  DeleteRole1(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/DeleteRole1`, data

      )
  }

  Getpermissionlist(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getpermissionlist`, data

      )
  }


  GetMenu(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetMenu`, data

      )
  }

  insertPermission(data: any) {

    return this.apiHttpService
      .post(
        `${API_URL}/insertPermission`, data

      )
  }

  GetSubmenu(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetSubmenu`, data

      )
  }

  updatePermission(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/UpdatePermission`, data

      )
  }


  DeletePermission(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/DeletePermission`, data

      )
  }


  Getsplist(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getsplist`, data

      )
  }

  getInstrumentMaster(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, data

      )
  }

  Insertsp(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Insertsp`, data

      )
  }

  Updatesp(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Updatesp`, data

      )
  }

  Getbank(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getbank`, data

      )
  }

  Getbankspmlist(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getbankspmlist`, data

      )
  }

  uploadRefundFile(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/uploadRefundFile`, data

      )
  }

  GetHolidayList(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetHolidayList`, data

      )
  }


  DeleteHoliday(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/DeleteHoliday`, data

      )
  }

  Getbankcategoryspmlist(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getbankcategoryspmlist`, data

      )
  }

  GetcategoryIdList(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetcategoryIdList`, data

      )
  }

  GetMerchantidList(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetMerchantidList`, data

      )
  }


  UpdatespBankCategoryMapping(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/UpdatespBankCategoryMapping`, data

      )
  }

  InsertspBankCategoryMapping(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/InsertspBankCategoryMapping`, data

      )
  }

  getDropDown(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, data

      )
  }


  Deletespmbankcategory(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Deletespmbankcategory`, data

      )
  }


  Insertrolemenu(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/insertrolemenu`, data
      )

  }


  updateRole(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Updaterole1`, data
      )
  }
  Getroledata(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getroledata`, data
      )

  }

  Getrolemenu(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Getrolemenu`, data

      )

  }

  GetmerchantList(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetMerchant`, data

      )
  }

  getMerchantaccess
    (data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/getMerchantaccess
      `, data

      )
  }


  insertmerchantmenu(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/insertmerchantmenu`, data
      )

  }

  checkvalue(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/checkvalue`, data
      )

  }

  getuserlist(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/getuserlist`, data
      )

  }

  insertuser(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/insertuser`, data
      )

  }

  Updateuser(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/Updateuser`, data
      )

  }

  deleteUser(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/deleteUser`, data
      )

  }


  getroledorpdown(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/getroledorpdown`, data
      )

  }


  createUpdateBank(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/createUpdateBank`, data
      )
  }


  getBankList() {
    return this.apiHttpService
      .get(
        `${API_URL}/getBankList`
      )
  }

  deleteBankDetails(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/deleteBankDetails`, data
      )
  }


  getInstrumentList() {
    return this.apiHttpService
      .get(
        `${API_URL}/getInstrumentList`
      )
  }


  deleteInstrumentDetails(data:any) 
    {
    return this.apiHttpService
      .post(
        `${API_URL}/deleteInstrumentDetails
        `, data
      )
  }


  createUpdateInstrument(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/createUpdateInstrument`,data
      )
  }

  InsertspBankMapping(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/InsertspBankMapping`,data
    )
  }


  UpdatespBankMapping(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/UpdatespBankMapping`,data
    )
  }


  getAllMerchantList(data:any)
  {  return this.apiHttpService
    .post(
      `${API_URL}/GetMerchant/`,data
    )

  }



  Deletespbankmapping(data:any)
  {  return this.apiHttpService
    .post(
      `${API_URL}/Deletespbankmapping/`,data
    )

  }

  getPayoutSttlementList(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, data

      )
  }

  PayoutRaised(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/PayoutRaised`, data

    )
  }

  getMarkSttlementList(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, data

      )
  }

  MarkRaised(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/Settlement`, data

    )
  }

  GetUser(data: any) {
    return this.apiHttpService
      .post(
        `${API_URL}/GetDropdown`, data

      )
  }

}
