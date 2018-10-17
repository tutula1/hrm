import { AddCustomerPage } from '../pages/add-customer/add-customer';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MenuMainPage } from '../pages/menu-main/menu-main';
import { MenuEmployeePage } from '../pages/menu-employee/menu-employee';
import { MenuHolidaysPage } from '../pages/menu-holidays/menu-holidays';
import { CreateHolidaysPage } from '../pages/create-holidays/create-holidays';
import { ViewHolidaysPage } from '../pages/view-holidays/view-holidays';
import { HolidaysPage } from '../pages/holidays/holidays';
import { HolidaysDayPage } from '../pages/holidays-day/holidays-day';
import { ViewHolidaysDayPage } from '../pages/view-holidays-day/view-holidays-day';
import { EmployeePage } from '../pages/employee/employee';
import { DepartmentPage } from '../pages/department/department';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'ngx-moment';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
import { MyApp } from './app.component';
import { Network } from '@ionic-native/network';
import { OdooJsonRpc } from '../services/odoojsonrpc';
import { Utils } from '../services/utils';
import { ParallaxDirective } from '../directives/parallax/parallax';
import { ProfilePage } from '../pages/profile/profile';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ViewEmployeePage } from '../pages/view-employee/view-employee';
import { ViewDepartmentPage } from '../pages/view-department/view-department';

import { NgCalendarModule  } from 'ionic2-calendar';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

@NgModule({
  declarations: [
    MyApp,
    DashboardPage,
    MenuEmployeePage,
    MenuHolidaysPage,
    MenuMainPage,
    EmployeePage,
    CreateHolidaysPage,
    ViewHolidaysPage,
    HolidaysPage,
    HolidaysDayPage,
    ViewHolidaysDayPage,
    DepartmentPage,
    LoginPage,
    ViewEmployeePage,
    ViewDepartmentPage,
    ProfilePage,
    ParallaxDirective,
    AddCustomerPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MomentModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DashboardPage,
    MenuEmployeePage,
    MenuHolidaysPage,
    MenuMainPage,
    EmployeePage,
    CreateHolidaysPage,
    ViewHolidaysPage,
    HolidaysPage,
    HolidaysDayPage,
    ViewHolidaysDayPage,
    DepartmentPage,
    LoginPage,
    ViewEmployeePage,
    ViewDepartmentPage,
    ProfilePage,
    AddCustomerPage
  ],
  providers: [
    Network,
    StatusBar,
    SplashScreen,
    OdooJsonRpc,
    Utils,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FingerprintAIO
  ]
})
export class AppModule {}
