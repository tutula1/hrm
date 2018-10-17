import { AddCustomerPage } from "../add-customer/add-customer";
import { Utils } from "../../services/utils";
import { ViewEmployeePage } from "../view-employee/view-employee";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { IonicPage, NavController, AlertController, LoadingController } from "ionic-angular";
import { Network } from "@ionic-native/network";


@Component({
  selector: "page-employee",
  templateUrl: "employee.html"
})
export class EmployeePage {
  // splash = true; 

  private loader: any;
  showSearch: any = false;
  searchQuery: string = '';
  limit: number = 20;
  offset: number = 0;
  page: number = 0;
  total: number = 0;

  private employeeArray: Array < {
    id: number;
    imageUrl: string;
    name: string;
    email: string;
    code: string;
  } > = [];

  private items: Array < {
    id: number;
    imageUrl: string;
    name: string;
    email: string;
    code: string;
  } > = [];

  private employee = "hr.employee";

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
      .searchRead(this.employee, [], ["id", "name", "image_small", "work_email", "code"], this.limit, this.offset, "")
      .then((employee: any) => {
        this.fillEmployees(employee);
      });
    this.dismissLoading()
  }

  private fillEmployees(employees: any): void {
    let json = JSON.parse(employees._body);
    if (!json.error) {
      this.total = json["result"].length;
      let query = json["result"].records;

      for (let i in query) {
        this.employeeArray.push({
          id: query[i].id,
          imageUrl: "data:image/*;base64," + query[i].image_small,
          name: query[i].name == false ? "" : query[i].name,
          email: query[i].work_email == false ? "" : query[i].work_email,
          code: query[i].code == false ? "" : query[i].code
        });
      }
      this.items = this.employeeArray;
    } else {
      this.odooRpc.handleOdooErrors(json);
    }
  }

  private view(idx: number): void {
    let params = {
      id: this.employeeArray[idx].id,
      name: this.employeeArray[idx].name
    };
    this.navCtrl.push(ViewEmployeePage, params);
  }


  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if ((this.employeeArray.length) >= this.total) {
        infiniteScroll.enable(false);
      } else {
        this.display();
      }
      infiniteScroll.complete();
    }, 500);
  }

  initializeItems(): void {
    this.employeeArray = this.items;
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

    this.employeeArray = this.employeeArray.filter(v => {
      if (v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        if (v.email.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        if (v.code.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });

    console.log(q, this.items.length);
  }

}
