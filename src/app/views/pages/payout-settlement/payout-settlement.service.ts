import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { environment } from 'src/environments/environment';
const {API_URL} = environment;

@Injectable({
  providedIn: 'root'
})
export class PayoutSettlementService {
  dailysettlement: any;

  constructor(private apiHttpService: ApiHttpService) { 

   
  }
 generatepayout(data:any)
  {
    return this.apiHttpService
    .post(
      `${API_URL}/payoutGenerate`,data

    )
  }

  Downloadpayout(data:any)
  {debugger
    return this.apiHttpService
    .get(
      `${API_URL}/downloadFilePayoutGenerate?name=`+data, {
        responseType: 'blob'
      }

    )
  }
  Settlementfile(data:any)
  {debugger
    return this.apiHttpService
    .post(
      `${API_URL}/payoutSettlementUTR`,data

    )

  }
 

}
