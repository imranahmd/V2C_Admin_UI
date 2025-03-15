import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { PerformanceComponent } from './performance.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { UpdateReportComponent } from './update-report/update-report.component';


@NgModule({
  declarations: [
    PerformanceComponent,
    PerformanceReportComponent,
    UpdateReportComponent
  ],
  imports: [
    CommonModule,
    PerformanceRoutingModule
  ]
})
export class PerformanceModule { }
