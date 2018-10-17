import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController } from "ionic-angular";
import { Utils } from "../../services/utils";
import { ViewDepartmentPage } from '../view-department/view-department';

// @IonicPage({ 
//   name: 'view-employee-page',
// })
@Component({
  selector: "page-view-employee",
  templateUrl: "view-employee.html"
})
export class ViewEmployeePage {
  private loader: any;
  private employeeId: number;
  public leaves_count: number = 0;
  public payslip_count: number = 0;
  public contracts_count: number = 0;
  public trial_contracts_count: number = 0;
  public imageSrc: string;
  public name: string;
  public view_page: any = false;
  public data: Array < {
    id: number;
    code: string;
    email: string;
    mobile: string;
    phone: string;
    job: string;
    job_position: string;
    parent_id: number;
    parent: string;
    coach_id: number;
    coach: string;
    department_id: number;
    department: any;
    company: string;
    joining_date: string;
    official_joining_date: string;
    worked_years: number;
    resigned_date: string;
  } > = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public odooRpc: OdooJsonRpc,
    public utils: Utils,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.employeeId = navParams.get("id");
    this.name = navParams.get("name");
    this.presentLoading();
    this.display();
    this.dismissLoading();
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

  view_parent(item: any) {
    if (item.parent_id != 0) {
      let params = {
        id: item.parent_id,
        name: item.parent
      };
      this.navCtrl.push(ViewEmployeePage, params);
    }
  }
  view_coach(item: any) {
    if (item.coach_id != 0) {
      let params = {
        id: item.coach_id,
        name: item.coach
      };
      this.navCtrl.push(ViewEmployeePage, params);
    }
  }

  view_department(item: any) {
    if (item.department_id != 0) {
      let params = {
        id: item.department_id,
        name: item.department
      };
      this.navCtrl.push(ViewDepartmentPage, params);
    }
  }

  view_contracts() {
    let params = {
      id: this.employeeId,
    };
    this.navCtrl.push("ContractPage", params);
  }

  presentActionSheet() {
    if (this.view_page) {
      let actionSheet = this.actionSheetCtrl.create({
        title: "More Infomation",
        buttons: [{
          text: 'Leaves Left (' + this.leaves_count + ')',
          role: 'destructive',
          handler: () => {

          }
        }, {
          text: 'Payslips (' + this.payslip_count + ')',
          role: 'destructive',
          handler: () => {

          }
        }, {
          text: 'Official Contracts (' + this.contracts_count + ')',
          role: 'destructive',
          handler: () => {

          }
        }, {
          text: 'Trial Contracts (' + this.trial_contracts_count + ')',
          role: 'destructive',
          handler: () => {

          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }]
      });
      actionSheet.present();
    }
  }

  private display(): void {
    let fields = [
      "name",
      "view_page",
      "work_email",
      "code",
      "mobile_phone",
      "work_phone",
      "job_id",
      "job_position_id",
      "parent_id",
      "coach_id",
      "company_id",
      "department_id",
      "joining_date",
      "official_joining_date",
      "worked_years",
      "resigned_date",
      "image"
    ];

    this.odooRpc
      .read("hr.employee", [this.employeeId], fields)
      .then((res: any) => {
        let parse = JSON.parse(res._body);
        if (parse['error']) {
          this.odooRpc.handleOdooErrors(parse);
        } else {
          let data = parse["result"];
          for (let record in data) {
            this.imageSrc = data[record].image;
            this.name = data[record].name;
            this.view_page = data[record].view_page;
            if (this.view_page) {
              fields = [
                "leaves_count",
                "payslip_count",
                "contracts_count",
                "trial_contracts_count"
              ];
              this.odooRpc
                .read("hr.employee", [this.employeeId], fields)
                .then((res: any) => {
                  let parse2 = JSON.parse(res._body);
                  if (parse2['error']) {
                    this.view_page = false;
                  } else {
                    let data2 = parse2["result"];
                    for (let record2 in data2) {
                      this.leaves_count = data2[record2].leaves_count;
                      this.payslip_count = data2[record2].payslip_count;
                      this.contracts_count = data2[record2].contracts_count;
                      this.trial_contracts_count = data2[record2].trial_contracts_count;
                      break;
                    }
                  }
                });
            }
            this.data.push({
              id: data[record].id,
              code: data[record].code == false ? "N/A" : data[record].code,
              email: data[record].work_email == false ? "N/A" : data[record].work_email,
              mobile: data[record].mobile_phone == false ? "N/A" : data[record].mobile_phone,
              phone: data[record].work_phone == false ? "N/A" : data[record].work_phone,
              job: data[record].job_id == false ? "N/A" : data[record].job_id[1],
              job_position: data[record].job_position_id == false ? "N/A" : data[record].job_position_id[1],
              parent_id: data[record].parent_id == false ? 0 : data[record].parent_id[0],
              parent: data[record].parent_id == false ? "N/A" : data[record].parent_id[1],
              coach_id: data[record].coach_id == false ? 0 : data[record].coach_id[0],
              coach: data[record].coach_id == false ? "N/A" : data[record].coach_id[1],
              department_id: data[record].department_id == false ? 0 : data[record].department_id[0],
              department: data[record].department_id == false ? "N/A" : data[record].department_id[1],
              company: data[record].company_id == false ? "N/A" : data[record].company_id[1],
              joining_date: data[record].joining_date == false ? "N/A" : data[record].joining_date,
              official_joining_date: data[record].official_joining_date == false ? "N/A" : data[record].official_joining_date,
              worked_years: data[record].worked_years == false ? "N/A" : data[record].worked_years,
              resigned_date: data[record].resigned_date == false ? "N/A" : data[record].resigned_date,
            });
            break;
          }
        }
      });
  }
}
