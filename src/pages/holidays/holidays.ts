import { ViewChild, Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { CreateHolidaysPage } from '../create-holidays/create-holidays';
import * as moment from 'moment';
import { Utils } from "../../services/utils";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { ViewHolidaysPage } from '../view-holidays/view-holidays';
import { CalendarComponent } from "ionic2-calendar/calendar";
/**
 * Generated class for the HolidaysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-holidays',
  templateUrl: 'holidays.html',
})
export class HolidaysPage {
  @ViewChild("CalendarComponent") myCalendar: CalendarComponent;
  type: any;
  holidaysArray: Array < {
    id: number;
    name: any;
    title: any;
    state: any;
    startTime: any;
    endTime: any;
    employee_id: any;
    number_of_days_temp: any;
    holiday_status_id: any;
    allDay: any;
    isRefuse: boolean;
    isConfirm: boolean;
    is1stApprove: boolean;
    is2ndApprove: boolean;
    isFinalApprove: boolean;
  } > = [];
  viewTitle: string;
  title: string;
  selectedDay = new Date();



  calendar = {
    mode: 'month',
    showEventDetail: true,
    currentDate: new Date(),
    startTime: (new Date()).toISOString(),
    endTime: (new Date()).toISOString(),
  };
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private utils: Utils,
    private odooRpc: OdooJsonRpc,
  ) {
    this.type = this.navParams.get('type');
    this.title = this.navParams.get('title');
    this.calendar.startTime = "";
    this.calendar.endTime = "";
    this.holidaysArray = [];
    if (this.type == 'add') {
      this.display();
    }
  }

  onRangeChanged(event) {
    if (this.calendar.startTime != event.startTime || this.calendar.endTime != event.endTime) {
      this.calendar.startTime = event.startTime;
      this.calendar.endTime = event.endTime;
      this.display();
    } else {
      this.calendar.startTime = event.startTime;
      this.calendar.endTime = event.endTime;
    }
  }

  private display(): void {
    this.utils.presentLoading('');
    let domain = [
      ["type", "=", this.type],
      ["state", "!=", "refuse"],
      ["holiday_status_id.active", "=", true]
    ];
    if (this.type == 'remove' && this.calendar.startTime != "") {
      domain.push(["holiday_type", "=", "employee"])
      domain.push(["date_from", ">=", this.calculateTime(new Date(this.calendar.startTime), "-7", true)])
      domain.push(["date_from", "<=", this.calculateTime(new Date(this.calendar.endTime), "-7", true)])
    }
    this.odooRpc
      .searchRead("hr.holidays", domain, ["id", "name", "display_name", "state", "date_from", "date_to", "employee_id", "number_of_days_temp", "holiday_status_id"], 0, 0, "create_date DESC")
      .then((holidays: any) => {
        this.fillHolidays(holidays);

      });
    this.utils.dismissLoading();
  }

  private fillHolidays(holidays: any): void {
    let json = JSON.parse(holidays._body);
    if (!json.error) {
      let query = json["result"].records;
      this.holidaysArray = [];
      for (let i in query) {
        this.holidaysArray.push({
          id: query[i].id,
          name: query[i].name,
          title: query[i].display_name,
          state: query[i].state,
          startTime: this.calculateTime(new Date(query[i].date_from), "+7", false, true),
          endTime: this.calculateTime(new Date(query[i].date_to), "+7", false, true),
          employee_id: query[i].employee_id,
          number_of_days_temp: query[i].number_of_days_temp,
          holiday_status_id: query[i].holiday_status_id,
          allDay: false,
          isRefuse: query[i].state == 'draft' ? true : false,
          isConfirm: query[i].state == 'draft' ? true : false,
          is1stApprove: false,
          is2ndApprove: false,
          isFinalApprove: false,
        });
      }
      if (this.type == 'remove') {
        this.myCalendar.loadEvents();
      }
    } else {
      this.odooRpc.handleOdooErrors(json);
    }
  }

  refuse(item) {
    this.odooRpc.call_button("hr.holidays", "action_refuse", [item.id]).then((res) => {
      let json = JSON.parse(res._body);
      if (!json.error) {
        item.state = 'refuse';
      } else {
        this.odooRpc.handleOdooErrors(json);
      }
    });
  }

  confirm(item) {
    this.odooRpc.call_button("hr.holidays", "action_confirm", [item.id]).then((res) => {
      let json = JSON.parse(res._body);
      if (!json.error) {
        item.state = 'confirm';
      } else {
        this.odooRpc.handleOdooErrors(json);
      }
    });
  }

  approve1st(item) {
    this.odooRpc.call_button("hr.holidays", "action_first_validate", [item.id]).then((res) => {
      let json = JSON.parse(res._body);
      if (!json.error) {
        item.state = 'validate1';
      } else {
        this.odooRpc.handleOdooErrors(json);
      }
    });
  }

  approve2nd(item) {
    this.odooRpc.call_button("hr.holidays", "action_second_validate", [item.id]).then((res) => {
      let json = JSON.parse(res._body);
      if (!json.error) {
        item.state = 'validate2';
      } else {
        this.odooRpc.handleOdooErrors(json);
      }
    });
  }

  approveFinal(item) {
    this.odooRpc.call_button("hr.holidays", "action_validate", [item.id]).then((res) => {
      let json = JSON.parse(res._body);
      if (!json.error) {
        item.state = 'validate';
      } else {
        this.odooRpc.handleOdooErrors(json);
      }
    });
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

  viewLeave(item) {
    let modal = this.modalCtrl.create(ViewHolidaysPage, {
      id: item.id,
      title: item.title,
    });
    modal.present();

  }
  addLeave() {
    this.navCtrl.push(CreateHolidaysPage, { selectedDay: this.selectedDay, type: this.type, title: this.title });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HolidaysPage');
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }


  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    let modal = this.modalCtrl.create(ViewHolidaysPage, {
      id: event.id,
      title: event.title,
    });
    modal.present();
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

}
