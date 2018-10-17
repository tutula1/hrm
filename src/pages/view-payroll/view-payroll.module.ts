import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewPayrollPage } from './view-payroll';

@NgModule({
  declarations: [
    ViewPayrollPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewPayrollPage),
  ],
})
export class ViewPayrollPageModule {}
