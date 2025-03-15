import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { environment } from 'src/environments/environment';
 const {API_URL} = environment;

@Injectable({
  providedIn: 'root'
})
export class ChargebackServiceService {

  constructor(private apiHttpService: ApiHttpService) { }


  getMerchantList(data:any) {

    return this.apiHttpService
      .post(
        `${API_URL}/GetMerchant/`,data

      )
  }


  // getMerchantList(data:any) {

  //   return this.apiHttpService
  //     .post(
  //       `${API_URL}/GetMerchant/`,data

  //     )
  // }

  getChargeBackDataForRaised(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getChargeBackDataForRaised/`,data

    )
  }

  Raisedchargebackinsert(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/Raisedchargebackinsert/`,data

    )
  }

  DownloadChargeBackDocs(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/DownloadChargeBackDocs/`,data

    )
  }

  downloadZipFile(data:any)
  {
    return this.apiHttpService
    .get(
      `${API_URL}/downloadZipFile?name=`+data, {
        responseType: 'arraybuffer'
      }
    )
  }


  chargeBackProcessinglist(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/chargeBackProcessinglist/`,data

    )
  }

  
  UpdateChargeBackData(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/UpdateChargeBackData/`,data

    )
  }

  adminActionBasedonDropDown(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/adminActionBasedonDropDown/`,data

    )
  }

  getDropDown(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/GetDropdown/`,data

    )
  }

  getComments(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/getComments/`,data

    )
  }

  
}
