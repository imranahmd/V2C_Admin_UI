import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkUploadInvoiceComponent } from './bulk-upload-invoice/bulk-upload-invoice.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { GenerateSettlementComponent } from './generate-settlement/generate-settlement.component';
import { MasterComponent } from '../master/master.component';
import { SettlementGenerationComponent } from './settlement-generation/settlement-generation.component';
import { TransactionLifeCycleComponent } from './transaction-life-cycle/transaction-life-cycle.component';
import { RoleComponent } from './role/role.component';
import { ServiceProviderComponent } from './service-provider/service-provider.component';
import { BankMappingComponent } from './bank-mapping/bank-mapping.component';
import { UserComponent } from './user/user.component';
import { InstrumentMasterComponent } from './instrument-master/instrument-master.component';
import { ServiceBankComponent } from './service-bank/service-bank.component';
import { PermissionComponent } from './permission/permission.component';
import { PayoutSettlementComponent } from './payout-settlement/payout-settlement.component';
import { MarkSettlementComponent } from './mark-settlement/mark-settlement.component';
import { UserMonitoringComponent } from './user-monitoring/user-monitoring/user-monitoring.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: { alias: 'Master Management' } },
    children: [
      { path: '', data: { breadcrumb: { alias: 'Master' } }, component: MasterComponent },
      { path: 'createinvoice', data: { breadcrumb: { alias: 'Create Invoice' } }, component: CreateInvoiceComponent },
      { path: 'bulkinvoice', data: { breadcrumb: { alias: 'Bulk Upload Invoice' } }, component: BulkUploadInvoiceComponent },
      { path: 'transactionlifecycle', data: { breadcrumb: { alias: 'Transaction Life Cycle' } }, component: TransactionLifeCycleComponent },
      { path: 'generatesettlement', data: { breadcrumb: { alias: 'Generate Settlement' } }, component: GenerateSettlementComponent },
      { path: 'settlementgeneration', data: { breadcrumb: { alias: 'Settlement Generetion' } }, component: SettlementGenerationComponent },
      { path: 'roleAdd', data: { breadcrumb: { alias: 'Role Master' } }, component: RoleComponent },
      { path: 'serviceProvider', data: { breadcrumb: { alias: 'Service   Master' } }, component: ServiceProviderComponent },
      { path: 'ConfigBank', data: { breadcrumb: { alias: 'Bank   Master' } }, component: BankMappingComponent },
      { path: 'User', data: { breadcrumb: { alias: 'User   Master' } }, component: UserComponent },
      { path: 'InstrumentMaster', data: { breadcrumb: { alias: 'Instrument   Master' } }, component: InstrumentMasterComponent },
      { path: 'serviceBank', data: { breadcrumb: { alias: 'Service Bank' } }, component: ServiceBankComponent },
      { path: 'permissionAdd', data: { breadcrumb: { alias: 'Permission  Master' } }, component: PermissionComponent },
      { path: 'payoutsettlement', data: { breadcrumb: { alias: 'Payout Settlement' } }, component: PayoutSettlementComponent },
      { path: 'marksettlement', data: { breadcrumb: { alias: 'Mark Settlement' } }, component: MarkSettlementComponent },
      { path: 'usermonitoring', data: { breadcrumb: { alias: ' User Monitoring' } }, component: UserMonitoringComponent },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
