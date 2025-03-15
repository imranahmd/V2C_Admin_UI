import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReconManagementRoutingModule } from './recon-management-routing.module';
import { ReconManagementComponent } from '../recon-management/recon-management.component';
import { ReconComponent } from './recon/recon.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { NgSelectModule } from "@ng-select/ng-select";
import { AlertService } from "../../../_services/alert.service";
import {
  NgbAccordionModule, NgbAlertModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTimepickerModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { HttpInterceptorProviders } from 'src/app/_helpers/http.interceptor';
import { DatePipe } from '@angular/common';
import { ReconProgressReportComponent } from './recon-progress-report/recon-progress-report.component';
import { ReconUploadOneComponent } from './recon-upload-one/recon-upload-one.component';
import { ReconUploadTwoComponent } from './recon-upload-two/recon-upload-two.component';
import { ReconExceptionComponent } from './recon-exception/recon-exception.component';
import { ReconConfigComponent } from './recon-config/recon-config.component';
import { SideNavService } from '../../layout/sidebar/side-name.service';
import {LayoutModule} from "../../layout/layout.module";
import { ReconConfigViewComponent } from './recon-config-view/recon-config-view.component';
import { CustomCommonModule } from "../../../common/common.module";
import { ReusableGridsComponent } from './reusable-grids/reusable-grids.component';
import { ReconviewComponent } from './reconview/reconview.component';

@NgModule({
    declarations: [
        ReconManagementComponent,
        ReconComponent,
        ReconProgressReportComponent,
        ReconUploadOneComponent,
        ReconUploadTwoComponent,
        ReconExceptionComponent,
        ReconConfigComponent,
        ReconConfigViewComponent,
        ReusableGridsComponent,
        ReconviewComponent
    ],
    providers: [ApiHttpService, HttpInterceptorProviders, SideNavService, DatePipe, AlertService],
    imports: [
        CommonModule,
        ReconManagementRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        AgGridModule,
        NgbAccordionModule, NgbAlertModule,
        NgbCollapseModule,
        NgbDropdownModule,
        NgbNavModule,
        NgbPaginationModule,
        NgbTimepickerModule,
        NgbTypeaheadModule,
        NgSelectModule,
        LayoutModule,
        CustomCommonModule,
        NgbModule
    ]
})
export class ReconManagementModule { }
