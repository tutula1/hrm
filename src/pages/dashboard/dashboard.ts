import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../services/utils";
import { MenuMainPage } from '../menu-main/menu-main';
import { EmployeePage } from '../employee/employee';
import { ProfilePage } from "../profile/profile";
import { LoginPage } from "../login/login";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
	tab1: any;
  	tab2: any;
  	tab3: any;

  constructor(
    public navCtrl: NavController, 
    public appCtrl: App, 
    public navParams: NavParams,
    public utils: Utils,
    ) {
    this.getUser();
  	this.tab1 = MenuMainPage;
  	this.tab2 = EmployeePage;//mail/client_action
  	this.tab3 = ProfilePage;
  }

  public getUser(p:any=true){
    let user = this.utils.getUser(p);
    if(!user){
      // this.appCtrl.getRootNav().setRoot(LoginPage);
      return false;
    }
    return user;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
  }

}
