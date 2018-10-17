import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { MenuEmployeePage } from '../menu-employee/menu-employee';
import { MenuHolidaysPage } from '../menu-holidays/menu-holidays';
import { CreateHolidaysPage } from '../create-holidays/create-holidays';

/**
 * Generated class for the MenuMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu-main',
  templateUrl: 'menu-main.html',
})
export class MenuMainPage {

  title: string = 'Home'
  searchQuery: string = '';
  showSearch: any = false;
  items: any[];

  constructor(
    public navCtrl: NavController, 
    public appCtrl: App, 
    public navParams: NavParams) {
    this.initializeItems();
  }

  actionShowSearch() {
    this.showSearch = !this.showSearch;
  }

  initializeItems() {
      this.items = [{
          page: MenuEmployeePage,
          params: {},
          display: 'Employee',
          image: 'assets/imgs/menu/employee.png'
        },
        {
          page: MenuHolidaysPage,
          params: {type: 'remove', title: 'Leaves Request'},
          display: 'Holidays',
          image: 'assets/imgs/menu/holidays.png'
        },
        {
          page: 'MenuAttendancePage',
          params: {},
          display: 'Attendance',
          image: 'assets/imgs/menu/attendance.png'
        },
        {
          page: 'MenuPayrollPage',
          params: {},
          display: 'Payroll',
          image: 'assets/imgs/menu/payroll.png'
        }
      ];
  }

  quickFab(type: string, fab: FabContainer){
  	fab.close();
  	if(type=='leave'){
  		this.navCtrl.push(CreateHolidaysPage, { 
        selectedDay: (new Date()).toISOString(), 
        type: 'remove', 
        title: 'Leaves Request' 
      })
  	}
  }

  itemSelected(item: any) {
    this.appCtrl.getRootNav().setRoot(item.page, item.params);
  	// this.navCtrl.push(item.page);
  }

  getItems() {
    this.initializeItems();
    if (this.searchQuery && this.searchQuery.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.display.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1);
      })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuMainPage');
  }

}
