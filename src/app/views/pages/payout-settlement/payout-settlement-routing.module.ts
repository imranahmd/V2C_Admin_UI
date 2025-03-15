import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HDFCPayoutComponent } from './hdfcpayout/hdfcpayout.component';
import { PayoutSettlementComponent } from '../payout-settlement/payout-settlement.component';
import { YesBankPayoutComponent } from './yes-bank-payout/yes-bank-payout.component';
import { GeneratePayoutOneComponent } from './generate-payout-one/generate-payout-one.component';
import { GeneratePayoutTwoComponent } from './generate-payout-two/generate-payout-two.component';
import { SettlementFileOneComponent } from './settlement-file-one/settlement-file-one.component';
import { SettlementFileTwoComponent } from './settlement-file-two/settlement-file-two.component';
import { BankAccountDetailsComponent } from './bank-account-details/bank-account-details.component';
import { BankClaimComponent } from './bank-claim/bank-claim.component';
import { BfRnsInwardComponent } from './bf-rns-inward/bf-rns-inward.component';
import { BfRnsOutwardComponent } from './bf-rns-outward/bf-rns-outward.component';
import { AfRnsOutwardComponent } from './af-rns-outward/af-rns-outward.component';
import { AfRnsInwardComponent } from './af-rns-inward/af-rns-inward.component';
import { RnsTransactionComponent } from './rns-transaction/rns-transaction.component';



const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: {alias: 'Payout & Settlement'} },
    children: [
      {path: '', data: { breadcrumb: {alias: 'Payout & Settlement'} }, component: PayoutSettlementComponent},
      {path: 'hdfcpayout', data: { breadcrumb: {alias: 'HDFC payout'} }, component: HDFCPayoutComponent},
      {path: 'yesbankpayout', data: { breadcrumb: {alias: 'YesBank Payout'} }, component: YesBankPayoutComponent},
      {path: 'GeneratePayoutOne', data: { breadcrumb: {alias: 'Generate Payout One'} }, component:  GeneratePayoutOneComponent},
      {path: 'GeneratePayoutTwo', data: { breadcrumb: {alias: 'Generate Payout Two '} }, component: GeneratePayoutTwoComponent },
      {path: 'SettlementFileOne', data: { breadcrumb: {alias: 'Settlement File One'} }, component:  SettlementFileOneComponent},
      {path: ' SettlementFileTwo', data: { breadcrumb: {alias: ' Settlement File Two'} }, component: SettlementFileTwoComponent},
      {path: 'BankAccountDetails', data: { breadcrumb: {alias: 'Bank Account Details'} }, component:  BankAccountDetailsComponent},
      {path: 'BankClaim', data: { breadcrumb: {alias: 'Bank Claim '} }, component: BankClaimComponent},
      {path: 'BfRnsInward', data: { breadcrumb: {alias: 'BF RNS Inward '} }, component: BfRnsInwardComponent},
      {path: 'BfRnsOutward', data: { breadcrumb: {alias: 'BF RNS Outward'} }, component: BfRnsOutwardComponent},
      {path: 'AfRnsOutward', data: { breadcrumb: {alias: 'AF RNS Outward'} }, component: AfRnsOutwardComponent },
      {path: 'AfRnsInward', data: { breadcrumb: {alias: 'AF RNS Inward'} }, component: AfRnsInwardComponent },
      {path: 'RnsTransaction', data: { breadcrumb: {alias: 'RNS Transaction'} }, component: RnsTransactionComponent}

    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayoutSettlementRoutingModule { }
