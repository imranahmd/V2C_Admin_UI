import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReconManagementComponent } from '../recon-management/recon-management.component';
import { ReconProgressReportComponent } from './recon-progress-report/recon-progress-report.component';
import { ReconComponent } from './recon/recon.component';
import { ReconUploadOneComponent } from './recon-upload-one/recon-upload-one.component';
import { ReconUploadTwoComponent } from './recon-upload-two/recon-upload-two.component';
import { ReconExceptionComponent } from './recon-exception/recon-exception.component';
import { ReconConfigComponent } from './recon-config/recon-config.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: {alias: 'Recon Management'} },
    children: [
      {path: '', data: { breadcrumb: {alias: 'Recon Management'} }, component: ReconManagementComponent},
      {path: 'recon', data: { breadcrumb: {alias: 'Recon Upload'} }, component: ReconComponent},
      {path: 'ReconProgressReport', data: { breadcrumb: {alias: 'Recon Progress Report'} }, component: ReconProgressReportComponent},
     {path: 'ReconUploadOne', data: { breadcrumb: {alias: 'Recon Upload One'} }, component: ReconUploadOneComponent},
      {path: 'ReconUploadTwo', data: { breadcrumb: {alias: 'Recon Upload Two'} }, component: ReconUploadTwoComponent},
      {path: 'ReconException', data: { breadcrumb: {alias: 'Recon Exception'} }, component: ReconExceptionComponent},
      {path: 'ReconConfig', data: { breadcrumb: {alias: 'Recon Config'} }, component: ReconConfigComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconManagementRoutingModule { }
