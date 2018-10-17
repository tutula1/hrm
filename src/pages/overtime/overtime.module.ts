import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OvertimePage } from './overtime';

@NgModule({
  declarations: [
    OvertimePage,
  ],
  imports: [
    IonicPageModule.forChild(OvertimePage),
  ],
})
export class OvertimePageModule {}
