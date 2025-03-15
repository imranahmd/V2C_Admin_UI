import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { MasterComponent } from '../master/master.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { BulkUploadInvoiceComponent } from './bulk-upload-invoice/bulk-upload-invoice.component';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { AlertService } from 'src/app/_services/alert.service';
import { ApiHttpService } from 'src/app/_services/api-http.service';
import { HttpInterceptorProviders } from 'src/app/_helpers/http.interceptor';
import { MasterService } from './master.service';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import { TransactionLifeCycleComponent } from './transaction-life-cycle/transaction-life-cycle.component';
import { ReusablecycleComponent } from './reusablecycle/reusablecycle.component';
import { SideNavService } from '../../layout/sidebar/side-name.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbDropdownModule, NgbModule, NgbNavModule, NgbPaginationModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { CustomCommonModule } from 'src/app/common/common.module';
import { ArchwizardModule } from 'angular-archwizard';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { LayoutModule } from '../../layout/layout.module';
import { TransactionViewComponent } from './transaction-view/transaction-view.component';
import { LifeCycleBulkUploadComponent } from './life-cycle-bulk-upload/life-cycle-bulk-upload.component';
import { LifeCycleSummaryComponent } from './life-cycle-summary/life-cycle-summary.component';
import { GenerateSettlementComponent } from './generate-settlement/generate-settlement.component';
import { SettlementGenerationComponent } from './settlement-generation/settlement-generation.component';
import { ReconConfigMasterComponent } from './recon-config-master/recon-config-master.component';
import { RmsConfigurationComponent } from './rms-configuration/rms-configuration.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { BankMappingComponent } from './bank-mapping/bank-mapping.component';
import { WebFontComponent } from './web-font/web-font.component';
import { KitsDownloadComponent } from './kits-download/kits-download.component';
import { MerchantPasswordResetComponent } from './merchant-password-reset/merchant-password-reset.component';
import { BulkMdrUpdateComponent } from './bulk-mdr-update/bulk-mdr-update.component';
import { HolidayCalendarComponent } from './holiday-calendar/holiday-calendar.component';
import { PermissionComponent } from './permission/permission.component';
import { ServiceViewComponent } from './service-view/service-view.component';
import { RoleViewComponent } from './role-view/role-view.component';
import { InstrumentMasterComponent } from './instrument-master/instrument-master.component';
import { BankCategoryMapperComponent } from './bank-category-mapper/bank-category-mapper.component';
import { ServiceBankComponent } from './service-bank/service-bank.component';
import { BankCategoryMapperViewComponent } from './bank-category-mapper-view/bank-category-mapper-view.component';
import { ServiceProviderMappingComponent } from './service-provider-mapping/service-provider-mapping.component';
import { BackAddMapperComponent } from './back-add-mapper/back-add-mapper.component';
import { BackAddMapperViewComponent } from './back-add-mapper-view/back-add-mapper-view.component';
import { PayoutSettlementComponent } from './payout-settlement/payout-settlement.component';
import { MarkSettlementComponent } from './mark-settlement/mark-settlement.component';
import { UserMonitoringComponent } from './user-monitoring/user-monitoring/user-monitoring.component';

@NgModule({
  declarations: [
    MasterComponent,
    CreateInvoiceComponent,
    BulkUploadInvoiceComponent,
    TransactionLifeCycleComponent,
    ReusablecycleComponent,
    TransactionViewComponent,
    LifeCycleBulkUploadComponent,
    LifeCycleSummaryComponent,
    GenerateSettlementComponent,
    SettlementGenerationComponent,
    ReconConfigMasterComponent,
    RmsConfigurationComponent,
    UserComponent,
    RoleComponent,
    ServiceProviderComponent,
    BankMappingComponent,
    WebFontComponent,
    KitsDownloadComponent,
    MerchantPasswordResetComponent,
    BulkMdrUpdateComponent,
    HolidayCalendarComponent,
    PermissionComponent,
    ServiceViewComponent,
    RoleViewComponent,
    InstrumentMasterComponent,
    BankCategoryMapperComponent,
    ServiceBankComponent,
    BankCategoryMapperViewComponent,
    ServiceProviderMappingComponent,
    BackAddMapperComponent,
    BackAddMapperViewComponent,
    PayoutSettlementComponent,
    MarkSettlementComponent,
    UserMonitoringComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    FormsModule,
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
    // RiskmanagementModule,
    NgbNavModule,
    NgbCollapseModule,
    LayoutModule,
    NgbAccordionModule,
    NgbAlertModule,
    NgbModule,
    NgbTooltipModule
    // RefundManagementRoutingModule
  ],
  providers: [ApiHttpService, HttpInterceptorProviders,DatePipe, AlertService,SideNavService,MasterService, DatePipe, AlertService]
  // providers: [ApiHttpService, HttpInterceptorProviders, RefundManagementService,  DatePipe, AlertService]

 
})

export class MasterModule { }
