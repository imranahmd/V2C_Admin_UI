import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ChargeBackRoutingModule } from './charge-back-routing.module';
import { ChargeBackComponent } from './../charge-back/charge-back.component';
import { RaiseChargeBackComponent } from './raise-charge-back/raise-charge-back.component';
import { ChargeBackProcessingComponent } from './charge-back-processing/charge-back-processing.component';
import { NgbAccordionModule, NgbAlertModule,NgbTooltipModule, NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTimepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AgGridModule } from 'ag-grid-angular';
import { ArchwizardModule } from 'angular-archwizard';
import { CustomCommonModule } from 'src/app/common/common.module';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { LayoutModule } from '../../layout/layout.module';
import { DownloadChargeBackDocsComponent } from './download-charge-back-docs/download-charge-back-docs.component';
import { RaiseChargeBackViewComponent } from './raise-charge-back-view/raise-charge-back-view.component';
import { TotalValue } from './charge-back-processing/total-value.component';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { HttpInterceptorProviders } from 'src/app/_helpers/http.interceptor';
import { SideNavService } from '../../layout/sidebar/side-name.service';
import { AlertService } from 'src/app/_services/alert.service';
import { DownloadViewComponent } from './download-view/download-view.component';
import { ChatComponent } from './chat/chat.component';
 
import { Routes, RouterModule } from '@angular/router';
 

import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

 import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde'
 

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])
@NgModule({
  declarations: [
    ChargeBackComponent,
    RaiseChargeBackComponent,
    ChargeBackProcessingComponent,
    DownloadChargeBackDocsComponent,
    RaiseChargeBackViewComponent,
    TotalValue,
    DownloadViewComponent,
    ChatComponent
  ],
  providers: [ApiHttpService, HttpInterceptorProviders, SideNavService, DatePipe, AlertService,{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }],
  imports: [
    CommonModule,
    ChargeBackRoutingModule,
    NgxDatatableModule,
    NgxDatatableModule,
    NgSelectModule,
    FormsModule,
    NgbDropdownModule,
    NgbTypeaheadModule,
    AgGridModule,
    NgbPaginationModule,
    CustomCommonModule,
    ArchwizardModule,
    ReactiveFormsModule,
    FeatherIconModule,
    NgbTimepickerModule,
    NgbDatepickerModule,
    // RiskmanagementModule,
    NgbNavModule,
    NgbCollapseModule,
    LayoutModule,
    NgbAccordionModule,
    NgbAlertModule,
    NgbModule,
 
    FullCalendarModule, // import the FullCalendar module! will make the FullCalendar component available
    PerfectScrollbarModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbNavModule,
    NgbCollapseModule,
    NgSelectModule,
    // SimplemdeModule.forRoot({
    //   provide: SIMPLEMDE_CONFIG,
    //   useValue: {}
    // })
  ]
  
})
export class ChargeBackModule { }
