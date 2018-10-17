import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from "../../services/utils";
import { LoginPage } from '../login/login';
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import * as moment from 'moment';

/**
 * Generated class for the CreateHolidaysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-create-holidays',
  templateUrl: 'create-holidays.html',
})
export class CreateHolidaysPage {
  user: any;
  title: string = '';
  type: any;

  state: any;
  state_html: any;
  name: any;
  holiday_status_id: any;
  holiday_status: any;
  holiday_type: any;
  employee_id: any;
  department_id: any;
  department: any;
  date_from: any;
  date_to: any;
  number_of_days_temp: any;
  number_of_days_temp_allocation: any;
  hours: any;
  hours_html: any;
  reason: any;
  reason_id: any;
  regulations: any;
  regulations_html: any;

  holiday_status_ids: Array < {
    id: number;
    name: string;
  } > = [];

  reason_ids: Array < {
    id: number;
    name: string;
  } > = [];

  employee_ids: Array < {
    id: number;
    name: string;
  } > = [];
  states = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appCtrl: App,
    public odooRpc: OdooJsonRpc,
    public utils: Utils,
    public viewCtrl: ViewController
  ) {
    this.utils.presentLoading('');
    this.user = this.getUser();

    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.type = this.navParams.get('type');
    this.title = this.navParams.get('title');
    this.states = {
      draft: 'Draft',
      confirm: 'To Approve',
      validate1: 'First Approved',
      validate2: 'Second Approved',
      validate: 'Final Approved',
      refuse: 'Refused',
    }
    this.state = 'draft';
    this.state_html = this.states[this.state];
    this.name = '';
    this.reason = false;
    this.reason_id = false;
    this.holiday_status_id = false;
    this.holiday_type = 'employee';
    this.employee_id = false;
    this.department_id = false;
    this.department = '';
    let date_from = new Date(preselectedDate)
    date_from.setHours(8);
    date_from.setMinutes(30);
    date_from.setSeconds(0);
    this.date_from = this.calculateTime(date_from, "+7");
    let date_to = new Date(preselectedDate)
    date_to.setHours(17);
    date_to.setMinutes(45);
    date_to.setSeconds(0);
    this.date_to = this.calculateTime(date_to, "+7");
    this.number_of_days_temp = 0;
    this.number_of_days_temp_allocation = 0;
    this.hours = 0;
    this.hours_html = this.transform(this.hours, 60);
    this.regulations = '';
    this.regulations_html = '';
    this.default_data();
    this.utils.dismissLoading();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  transform(value: number, args: number = 1): string {
    value *= args;
    const hours: number = Math.floor(value / 60);
    const minutes: number = (value - hours * 60);

    if (hours < 10 && minutes < 10) {
      return '0' + hours + ':0' + (value - hours * 60);
    }
    if (hours > 10 && minutes > 10) {
      return '0' + hours + ':' + (value - hours * 60);
    }
    if (hours > 10 && minutes < 10) {
      return hours + ':0' + (value - hours * 60);
    }
    if (minutes > 10) {
      return '0' + hours + ':' + (value - hours * 60);
    }
  }

  calculateTime(d: any, offset: any, format: any = false, isDate: any = false) {
    let nd = new Date(d.getTime() + (3600000 * offset));
    if (format) {
      let year = nd.getUTCFullYear();
      let month = nd.getUTCMonth() > 8 ? (nd.getUTCMonth() + 1) : ("0" + (nd.getUTCMonth() + 1));
      let day = nd.getUTCDate();
      let hour = nd.getUTCHours() > 9 ? nd.getUTCHours() : ("0" + nd.getUTCHours());
      let minute = nd.getUTCMinutes() > 9 ? nd.getUTCMinutes() : ("0" + nd.getUTCMinutes());
      let second = nd.getUTCSeconds() > 9 ? nd.getUTCSeconds() : ("0" + nd.getUTCSeconds());
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    } else {
      if (isDate) {
        return nd;
      } else {
        return nd.toISOString();
      }
    }
  }

  // selectEmployee(id: any) {
  //   this.employee_id = parseInt(id);
  // }

  onChangeReason(id: any) {
    this.reason_id = parseInt(id);
  }
  onChangeLeaveType(id: any) {
    this.odooRpc.load("hr.holidays.status", parseInt(id)).then((res) => {
      let parse2 = JSON.parse(res._body);
      if (parse2['error']) {
        this.holiday_status = {};
        this.regulations = '';
        this.odooRpc.handleOdooErrors(parse2);
      } else {
        this.holiday_status = parse2["result"].value;
        this.reason = this.holiday_status.reason;
        if (this.reason) {
          this.odooRpc.read("hr.holidays.reason", this.holiday_status.reason_ids, ["name"]).then((res) => {
            let parse = JSON.parse(res._body);
            if (parse['error']) {
              this.odooRpc.handleOdooErrors(parse);
            } else {
              this.reason_id = false;
              this.reason_ids = []
              let data = parse["result"];
              for (let record in data) {
                this.reason_ids.push({
                  id: data[record].id,
                  name: data[record].name,
                })
              }
            }
          });
        }
        this.regulations = this.holiday_status.regulations == false ? '' : this.holiday_status.regulations;
        this.regulations_html = this.holiday_status.regulations == false ? '' : this.holiday_status.regulations.replace(/\n/gi, "<br/>");
      }
    });
  }

  createLeave() {
    if (this.employee_id && this.holiday_status_id || (this.reason && this.reason_id)) {
      let model = "hr.holidays";
      let params = this.getData()
      this.odooRpc.createRecord(model, params).then((res: any) => {
        let parse2 = JSON.parse(res._body);
        if (parse2['error']) {
          this.odooRpc.handleOdooErrors(parse2);
        } else {
          this.utils.presentToast("Successfully", 1000, false, 'top')
          this.navCtrl.pop();
        }
      }).catch((err: any) => {
        alert(err)
      })
    }
  }

  public getUser(p: any = true) {
    let user = this.utils.getUser(p);
    if (!user) {
      this.appCtrl.getRootNav().setRoot(LoginPage);
      return false;
    }
    return user;
  }

  getData(type: number = 1) {
    if (type == 1) {
      return {
        name: this.name,
        employee_id: parseInt(this.employee_id),
        department_id: this.department_id == false ? false : parseInt(this.department_id),
        type: this.type,
        reason: this.reason,
        reason_id: this.reason_id,
        holiday_status_id: parseInt(this.holiday_status_id),
        number_of_days_temp: parseFloat(this.number_of_days_temp),
        number_of_days_temp_allocation: parseFloat(this.number_of_days_temp_allocation),
        hours: parseFloat(this.hours),
        regulations: this.regulations,
        date_from: this.calculateTime(new Date(this.date_from), "-7", true),
        date_to: this.calculateTime(new Date(this.date_to), "-7", true),
      }
    }
    if (type == 2) {
      return {
        name: "1",
        employee_id: "1",
        department_id: "1",
        type: "1",
        reason: "1",
        reason_id: "1",
        holiday_status_id: "1",
        number_of_days_temp: "1",
        number_of_days_temp_allocation: "1",
        hours: "1",
        regulations: "1",
        date_from: "1",
        date_to: "1",
      }
    }
    return {}
  }


  onChangeEmployee(id: any) {
    this.employee_id = parseInt(id);
    this.utils.presentLoading('');
    setTimeout(() => {
      let args = [
        [],
        this.getData(),
        "employee_id",
        this.getData(2),
      ];
      this.odooRpc.call_method("hr.holidays", "onchange", args, []).then((res: any) => {
        let parse = JSON.parse(res._body);
        if (parse['error']) {
          this.odooRpc.handleOdooErrors(parse);
        } else {
          let data = parse["result"].value;
          let domain = parse["result"].domain;
          if (domain.employee_id != undefined) {
            this.odooRpc.searchRead("hr.employee", domain.employee_id, ["name"], 0, 0, "").then((res: any) => {
              let parse2 = JSON.parse(res._body);
              if (parse2['error']) {
                this.odooRpc.handleOdooErrors(parse2);
              } else {
                this.employee_ids = [];
                let data2 = parse2["result"].records;
                for (let record3 in data2) {
                  this.employee_ids.push({
                    id: data2[record3].id,
                    name: data2[record3].name
                  });
                }
              }
            });
          }
          this.department_id = data.department_id == false ? this.department_id : data.department_id[0];
          this.department = data.department_id == false ? this.department : data.department_id[1];
          if (data.hours != undefined) {
            this.hours = data.hours;
            this.hours_html = this.transform(this.hours, 60);
          }
          if (data.number_of_days_temp != undefined) {
            this.number_of_days_temp = parseFloat(data.number_of_days_temp).toFixed(2);
          }
          if (data.date_from) {
            this.date_from = this.calculateTime(new Date(data.date_from), "+14");
          }
          if (data.date_to) {
            this.date_to = this.calculateTime(new Date(data.date_to), "+14");
          }
        }
      }).catch((err: any) => {
        alert(err)
      });
    }, 500);
    this.utils.dismissLoading();
  }

  onChangeDateFromDateTo(field) {
    if (this.employee_id) {
      this.utils.presentLoading('');
      setTimeout(() => {
        this.default_leave_type();
        let args = [
          [],
          this.getData(),
          field,
          this.getData(2),
        ];
        this.odooRpc.call_method("hr.holidays", "onchange", args, []).then((res: any) => {
          let parse2 = JSON.parse(res._body);
          if (parse2['error']) {
            this.odooRpc.handleOdooErrors(parse2);
          } else {
            let data = parse2["result"].value;
            if (data.hours != undefined) {
              this.hours = data.hours;
              this.hours_html = this.transform(this.hours, 60);
            }
            if (data.number_of_days_temp != undefined) {
              this.number_of_days_temp = parseFloat(data.number_of_days_temp).toFixed(2);
            }
            if (data.date_from) {
              this.date_from = this.calculateTime(new Date(data.date_from), "+14");
            }
            if (data.date_to) {
              this.date_to = this.calculateTime(new Date(data.date_to), "+14");
            }
          }
        }).catch((err: any) => {
          alert(err)
        });
      }, 500);
      this.utils.dismissLoading();
    }
  }

  default_leave_type() {
    if (this.employee_id) {
      let domain = [
        ["date_from", this.calculateTime(new Date(this.date_from), "-7", true)],
        ["employee_id", this.employee_id]
      ];
      if (this.type == 'add') {
        domain.push(["limit", "=", false]);
      }
      this.odooRpc.nameSearch("hr.holidays.status", "", domain).then((res: any) => {
        let parse2 = JSON.parse(res._body);
        if (parse2['error']) {
          this.odooRpc.handleOdooErrors(parse2);
        } else {
          let data2 = parse2["result"];
          this.holiday_status_ids = [];
          for (let record2 in data2) {
            this.holiday_status_ids.push({
              id: data2[record2][0],
              name: data2[record2][1]
            });
          }
        }
      });
    }
  }

  default_data() {
    let fields = [
      "name",
    ];
    this.odooRpc
      .searchRead("hr.employee", [
        ["user_id", "=", this.user.uid]
      ], fields, 0, 0, "")
      .then((res: any) => {
        let parse = JSON.parse(res._body);
        if (parse['error']) {
          this.odooRpc.handleOdooErrors(parse);
        } else {
          if (parse["result"].length > 0) {
            let data = parse["result"].records;
            for (let record in data) {
              this.employee_id = data[record].id;
              this.employee_ids.push({
                id: this.employee_id,
                name: data[record].name
              })
              this.default_leave_type();
              this.onChangeEmployee(this.employee_id);
              break;
            }
          } else {
            this.navCtrl.pop();
          }
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateHolidaysPage');
  }

}
