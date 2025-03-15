import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayoutSettlementRoutingModule } from './payout-settlement-routing.module';
import { PayoutSettlementComponent } from '../payout-settlement/payout-settlement.component';
import { HDFCPayoutComponent } from './hdfcpayout/hdfcpayout.component';
import { YesBankPayoutComponent } from './yes-bank-payout/yes-bank-payout.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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



@NgModule({
  declarations: [
    PayoutSettlementComponent,
    HDFCPayoutComponent,
    YesBankPayoutComponent,
    GeneratePayoutOneComponent,
    GeneratePayoutTwoComponent,
    SettlementFileOneComponent,
    SettlementFileTwoComponent,
    BankAccountDetailsComponent,
    BankClaimComponent,
    BfRnsInwardComponent,
    BfRnsOutwardComponent,
    AfRnsOutwardComponent,
    AfRnsInwardComponent,
    RnsTransactionComponent,
   
  ],
  imports: [
    CommonModule,
    PayoutSettlementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PayoutSettlementModule { }
