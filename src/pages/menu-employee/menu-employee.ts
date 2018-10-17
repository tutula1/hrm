import { ViewChild, Component } from '@angular/core';
import { App, NavController, NavParams, MenuController } from 'ionic-angular';
import { EmployeePage } from '../employee/employee';
import { DepartmentPage } from "../department/department";
import { DashboardPage } from "../dashboard/dashboard";

/**
 * Generated class for the MenuEmployeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-employee',
  templateUrl: 'menu-employee.html',
})
export class MenuEmployeePage {

  @ViewChild('employeeMenuRoot') employeeMenuRoot: NavController;


  rootPage: any = EmployeePage;
  params: any = {};
  employeePage: any = EmployeePage;
  departmentPage: any = DepartmentPage;
  constructor(
    public navCtrl: NavController, 
    public appCtrl: App, 
    public navParams: NavParams, 
    menu: MenuController) {
    menu.enable(true);
    this.params = this.navParams.data;
  }

  popToRoot(){
    this.appCtrl.getRootNav().setRoot(DashboardPage);
  }

  openPage(page, params) {
  	this.employeeMenuRoot.setRoot(page, params);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuEmployeePage');
  }

}
