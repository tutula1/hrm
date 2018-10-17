import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Utils } from "../../services/utils";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { ViewEmployeePage } from "../view-employee/view-employee";

/**
 * Generated class for the ViewDepartmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-department',
  templateUrl: 'view-department.html',
})
export class ViewDepartmentPage {
  private departmentId: number;
  public name: string;
  public data: Array < {
    id: number;
    parent_id: number;
    parent: string;
    manager_id: number;
    manager: string;
    company: string;
  } > = [];
  showSearch: any = false;
  searchQuery: string = '';
  limit: number = 20;
  offset: number = 0;
  page: number = 0;
  total: number = 0;

  private items: Array < {
    id: number;
    imageUrl: string;
    name: string;
    email: string;
    code: string;
  } > = [];

  private employeeArray: Array < {
    id: number;
    imageUrl: string;
    name: string;
    email: string;
    code: string;
  } > = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public odooRpc: OdooJsonRpc,
    public utils: Utils,
  ) {
    this.departmentId = navParams.get("id");
    this.name = navParams.get("name");
    this.utils.presentLoading('');
    this.display();
    this.display_employees();
    this.utils.dismissLoading();
  }

  view_manager(item: any) {
    if (item.manager_id != 0) {
      let params = {
        id: item.manager_id,
        name: item.manager
      };
      this.navCtrl.push(ViewEmployeePage, params);
    }
  }
  view_department(item: any) {
    if (item.parent_id != 0) {
      let params = {
        id: item.parent_id,
        name: item.parent
      };
      this.navCtrl.push(ViewDepartmentPage, params);
    }
  }

  actionShowSearch() {
    this.showSearch = !this.showSearch;
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if ((this.employeeArray.length) >= this.total) {
        infiniteScroll.enable(false);
      } else {
        this.display_employees();
      }
      infiniteScroll.complete();
    }, 500);
  }

  private view(idx: number): void {
    let params = {
      id: this.employeeArray[idx].id,
      name: this.employeeArray[idx].name
    };
    this.navCtrl.push(ViewEmployeePage, params);
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

  private display(): void {
    let fields = [
      "name",
      "parent_id",
      "manager_id",
      "company_id",
    ];

    this.odooRpc
      .read("hr.department", [this.departmentId], fields)
      .then((res: any) => {
        let parse = JSON.parse(res._body);
        if (parse['error']) {
          this.odooRpc.handleOdooErrors(parse);
        } else {
          let data = parse["result"];
          for (let record in data) {
            this.name = data[record].name;
            this.data.push({
              id: data[record].id,
              parent_id: data[record].parent_id == false ? 0 : data[record].parent_id[0],
              parent: data[record].parent_id == false ? "N/A" : data[record].parent_id[1],
              manager_id: data[record].manager_id == false ? 0 : data[record].manager_id[0],
              manager: data[record].manager_id == false ? "N/A" : data[record].manager_id[1],
              company: data[record].company_id == false ? "N/A" : data[record].company_id[1],
            });
            break;
          }
        }
      });
  }

  private display_employees(): void {
    this.offset = this.page * this.limit
    this.page += 1
    this.odooRpc
      .searchRead("hr.employee", [["department_id", "=", this.departmentId]], ["id", "name", "image_small", "work_email", "code"], this.limit, this.offset, "")
      .then((employee: any) => {
        this.fillEmployees(employee);
      });
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewDepartmentPage');
  }

}
