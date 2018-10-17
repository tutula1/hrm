import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewAttendancePage } from './view-attendance';

@NgModule({
  declarations: [
    ViewAttendancePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewAttendancePage),
  ],
})
export class ViewAttendancePageModule {}
