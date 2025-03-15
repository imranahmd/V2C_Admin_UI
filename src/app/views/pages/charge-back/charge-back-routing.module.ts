import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChargeBackProcessingComponent } from './charge-back-processing/charge-back-processing.component';
import { ChargeBackComponent } from '../charge-back/charge-back.component';
import { RaiseChargeBackComponent } from './raise-charge-back/raise-charge-back.component';
import { DownloadChargeBackDocsComponent } from './download-charge-back-docs/download-charge-back-docs.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [{
  path: '',
  data: { breadcrumb: {alias: 'Chargeback'} },
  children: [
    {path: '', data: { breadcrumb: {alias: 'Chargeback'} }, component: ChargeBackComponent},
    {path: 'chargeBackRaise', data: { breadcrumb: {alias: 'charge Back Raise'} }, component: RaiseChargeBackComponent},
    {path: 'chargeBackProcess', data: { breadcrumb: {alias: 'Refund List'} }, component: ChargeBackProcessingComponent},
    {path: 'chargeBackDocDetails', data: { breadcrumb: {alias: 'Download ChargeBack'} }, component: DownloadChargeBackDocsComponent},
    {path: 'chargeBackProcessing', data: { breadcrumb: {alias: 'Chargeback Processing'} }, component: ChargeBackProcessingComponent},
    {path: 'chat', data: { breadcrumb: {alias: 'Chat'} }, component: ChatComponent},
    // {path: 'bulkrefund', data: { breadcrumb: {alias: 'Bulk Refund'} }, component: BulkRefundComponent}
   

  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargeBackRoutingModule { }
