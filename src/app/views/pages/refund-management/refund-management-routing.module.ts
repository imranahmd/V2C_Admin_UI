import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtomRefundComponent } from './atom-refund/atom-refund.component';
import { BulkRefundComponent } from './bulk-refund/bulk-refund.component';
import { DownloadManualRefundComponent } from './download-manual-refund/download-manual-refund.component';
import { RefundListComponent } from './refund-list/refund-list.component';
import { RefundManagementComponent } from './refund-management.component';
import { RefundRequestStatusComponent } from './refund-request-status/refund-request-status.component';
import { UploadRefundComponent } from './upload-refund/upload-refund.component';

const routes: Routes = [  {
  path: '',
  data: { breadcrumb: {alias: 'Refund Management'} },
  children: [
    {path: '', data: { breadcrumb: {alias: 'Refund Management'} }, component: RefundManagementComponent},
    {path: 'refund', data: { breadcrumb: {alias: 'Refund'} }, component: RefundListComponent},
    {path: 'refundlist', data: { breadcrumb: {alias: 'Refund List'} }, component: RefundManagementComponent},
    {path: 'bulkrefund', data: { breadcrumb: {alias: 'Bulk Refund'} }, component: BulkRefundComponent},
    {path: 'refundRequestStatus', data: { breadcrumb: {alias: 'Refund Request Status'} }, component: RefundRequestStatusComponent},
    {path: 'refundDownload', data: { breadcrumb: {alias: 'Download Manual Refund'} }, component: DownloadManualRefundComponent},
    {path: 'atomRefund', data: { breadcrumb: {alias: 'Atom Refund'} }, component: AtomRefundComponent},
    {path: 'uploadRefund', data: { breadcrumb: {alias: 'Upload Manual Refund'} }, component: UploadRefundComponent}



   
   

  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundManagementRoutingModule { }
