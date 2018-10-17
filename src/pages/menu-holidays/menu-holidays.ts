import { ViewChild, Component } from '@angular/core';
import { App, NavController, NavParams, MenuController } from 'ionic-angular';
import { HolidaysPage } from '../holidays/holidays';
import { HolidaysDayPage } from "../holidays-day/holidays-day";
import { DashboardPage } from "../dashboard/dashboard";

/**
 * Generated class for the MenuHolidaysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-holidays',
  templateUrl: 'menu-holidays.html',
})
export class MenuHolidaysPage {

  @ViewChild('holidaysMenuRoot') holidaysMenuRoot: NavController;

  rootPage: any = HolidaysPage;
  holidaysPage: any = HolidaysPage;
  holidaysDayPage: any = HolidaysDayPage;
  params: any = {};

  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public navParams: NavParams,
    public menu: MenuController, ) {
    menu.enable(true);
    this.params = this.navParams.data

  }

  popToRoot() {
    this.appCtrl.getRootNav().setRoot(DashboardPage);
  }

  openPage(page, params) {
      this.holidaysMenuRoot.setRoot(page, params);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuHolidaysPage');
  }

}
