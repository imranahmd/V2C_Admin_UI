import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RechargeManagementRoutingModule } from './recharge-management-routing.module';
import { RechargeListComponent } from './recharge-list/recharge-list.component';
import { RechargeAddComponent } from './recharge-add/recharge-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AgGridModule } from 'ag-grid-angular';
import { CustomCommonModule } from 'src/app/common/common.module';
import { RechargeListViewComponent } from './recharge-list-view/recharge-list-view.component';
import { TwoDigitDecimaNumberDirective1 } from './two-digit-decima-number.directive';
import { BankStatementComponent } from './bank-statement/bank-statement.component';

import {
  NgbAccordionModule,
  NgbCollapseModule,
  NgbDropdownModule,
  NgbNavModule,

  NgbTimepickerModule,
  NgbTypeaheadModule
} from "@ng-bootstrap/ng-bootstrap";
@NgModule({
  declarations: [
    TwoDigitDecimaNumberDirective1,
    RechargeListComponent,
    RechargeAddComponent,
    RechargeListViewComponent,
    BankStatementComponent
  ],
  imports: [
    CommonModule,
    RechargeManagementRoutingModule,
    FormsModule,
    NgbAlertModule,
    NgSelectModule,
    ReactiveFormsModule,
    AgGridModule,
    NgbPaginationModule,
    CustomCommonModule,
    NgbAccordionModule,
    NgbCollapseModule,
    NgbDropdownModule,
    NgbNavModule,
  
    NgbTimepickerModule,
    NgbTypeaheadModule

  ]
})
export class RechargeManagementModule { }
