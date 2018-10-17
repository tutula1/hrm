import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateOvertimePage } from './create-overtime';

@NgModule({
  declarations: [
    CreateOvertimePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateOvertimePage),
  ],
})
export class CreateOvertimePageModule {}
