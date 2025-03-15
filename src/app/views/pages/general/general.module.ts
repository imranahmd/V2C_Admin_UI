import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FeatherIconModule} from '../../../core/feather-icon/feather-icon.module';

import {NgbAccordionModule, NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {GeneralComponent} from './general.component';
import {BlankComponent} from './blank/blank.component';
import {ProfileComponent} from './profile/profile.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';
// Ng-ApexCharts
import {NgApexchartsModule} from "ng-apexcharts";
import { UpiComponent } from './upi/upi.component';
import { PayoutComponent } from './payout/payout.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: BlankComponent,
        data: { breadcrumb: {alias: 'Home'} },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { breadcrumb: {alias: 'Profile'} },
      },
    ]
  }
]

@NgModule({
  declarations: [GeneralComponent, BlankComponent, ProfileComponent, PayoutComponent, UpiComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FeatherIconModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbTooltipModule,
    FormsModule,
    NgSelectModule,
    FeatherIconModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgApexchartsModule,
    NgxDatatableModule,
    NgxDaterangepickerMd.forRoot()

  ],
  providers:[DatePipe]


})
export class GeneralModule {
}
