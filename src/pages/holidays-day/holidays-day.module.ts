import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HolidaysDayPage } from './holidays-day';

@NgModule({
  declarations: [
    HolidaysDayPage,
  ],
  imports: [
    IonicPageModule.forChild(HolidaysDayPage),
  ],
})
export class HolidaysDayPageModule {}
