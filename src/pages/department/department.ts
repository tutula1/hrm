import { AddCustomerPage } from "../add-customer/add-customer";
import { Utils } from "../../services/utils";
import { ViewDepartmentPage } from '../view-department/view-department';
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { IonicPage, NavController, AlertController, LoadingController } from "ionic-angular";
import { Network } from "@ionic-native/network";


@Component({
  selector: "page-department",
  templateUrl: "department.html"
})
export class DepartmentPage {
  // splash = true;

  private loader: any;
  showSearch: any = false;
  searchQuery: string = '';
  limit: number = 20;
  offset: number = 0;
  page: number = 0;
  total: number = 0;

  private departmentArray: Array < {
    id: number;
    name: string;
  } > = [];

  private items: Array < {
    id: number;
    name: string;
  } > = [];

  private department = "hr.department";

  constructor(
    private navCtrl: NavController,
    private odooRpc: OdooJsonRpc,
    private alertCtrl: AlertController,
    private network: Network,
    private alert: AlertController,
    private utils: Utils,
    public loadingCtrl: LoadingController
  ) {
    this.display();
  }

  actionShowSearch() {
    this.showSearch = !this.showSearch;
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    this.loader.present();
  }

  dismissLoading() {
    this.loader.dismiss();
  }

  private display(): void {
    this.presentLoading();
    this.offset = this.page * this.limit
    this.page += 1
    this.odooRpc
      .searchRead(this.department, [], ["id", "name"], this.limit, this.offset, "")
      .then((department: any) => {
        this.fillDepartments(department);
      });
    this.dismissLoading()
  }

  private fillDepartments(departments: any): void {
    let json = JSON.parse(departments._body);
    if (!json.error) {
      this.total = json["result"].length;
      let query = json["result"].records;

      for (let i in query) {
        this.departmentArray.push({
          id: query[i].id,
          name: query[i].name == false ? "N/A" : query[i].name,
        });
      }
      this.items = this.departmentArray;
    } else {
      this.odooRpc.handleOdooErrors(json);
    }
  }

  private view(idx: number): void {
    let params = {
      id: this.departmentArray[idx].id,
      name: this.departmentArray[idx].name
    };
    this.navCtrl.push(ViewDepartmentPage, params);
  }


  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if (this.departmentArray.length >= this.total) {
        infiniteScroll.enable(false);
      } else {
        this.display();
      }
      infiniteScroll.complete();
    }, 500);
  }

  initializeItems(): void {
    this.departmentArray = this.items;
  }

  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = this.searchQuery

    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    this.departmentArray = this.departmentArray.filter(v => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

}
