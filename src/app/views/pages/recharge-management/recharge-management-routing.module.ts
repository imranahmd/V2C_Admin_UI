import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RechargeManagementComponent } from './recharge-management.component';
import { RechargeAddComponent } from './recharge-add/recharge-add.component';
import { RechargeListComponent } from './recharge-list/recharge-list.component';
import { BankStatementComponent } from './bank-statement/bank-statement.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: {alias: 'Recharge Management'} },
    children: [
      {path: '', data: { breadcrumb: {alias: 'Recharge Management'} }, component: RechargeManagementComponent},
      {path: 'rechargeadd', data: { breadcrumb: {alias: 'Recharge Add'} }, component: RechargeAddComponent},
      {path: 'rechargelist', data: { breadcrumb: {alias: 'Recharge List'} }, component: RechargeListComponent},
      {path: 'bankStatement', data: { breadcrumb: {alias: 'Bank Statement'} }, component: BankStatementComponent},
    
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RechargeManagementRoutingModule { }
