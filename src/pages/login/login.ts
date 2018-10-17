import { DashboardPage } from "../dashboard/dashboard";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
import { Component } from "@angular/core";
import { App, AlertController, LoadingController, NavController, NavParams } from "ionic-angular";
import { Utils } from "../../services/utils";
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';


@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  private listForProtocol: Array < {
    protocol: string;
  } > = [];
  public perfectUrl: boolean = false;
  public odooUrl;
  public selectedProtocol;
  private dbList: Array < {
    dbName: string;
  } > = [];
  private selectedDatabase;
  private email;
  private password;
  private isFinger: boolean = true;

  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public navParams: NavParams,
    private odooRpc: OdooJsonRpc,
    private utils: Utils,
    private faio: FingerprintAIO
  ) {
    this.listForProtocol.push({
      protocol: "http"
    });
    this.listForProtocol.push({
      protocol: "https"
    });
    this.selectedProtocol = 'http';
    this.odooUrl = 'hrm.besco.vn';
    this.selectedDatabase = 'besco_test_hrm';
    this.email = 'admin';
    this.password = 'hrm.besco.vn';
    if (localStorage.getItem("token")) {
      let response = localStorage.getItem("token");

      let jsonData = JSON.parse(response);
      let username = jsonData["username"];
      let pass = jsonData["password"];
      let url = jsonData["web.base.url"];
      let db = jsonData["db"];

      this.email = username;
      this.password = "";
      this.selectedDatabase = db;
      this.faio.isAvailable().then(result => {
        if (result === "finger" || result === "face") {
          this.isFinger = true;
        }
      });
      this.perfectUrl = true;

    } else {
      this.checkUrl();
    }
  }

  finger() {
    this.faio.show({
        clientId: 'BESCO HRM',
        clientSecret: 'Login', //Only necessary for Android
        disableBackup: true, //Only for Android(optional)
        localizedFallbackTitle: 'Use Pin', //Only for iOS
        localizedReason: 'Please Authenticate' //Only for iOS
      })
      .then((result: any) => {
        this.navCtrl.setRoot(DashboardPage);
      })
      .catch((error: any) => {});
  }

  public checkUrl() {
    this.utils.presentLoading("Please Wait");
    this.isFinger = false;
    this.perfectUrl = false;
    this.odooRpc.init({
      odoo_server: this.selectedProtocol + "://" + this.odooUrl,
      http_auth: "username:password" // optional
    });

    this.odooRpc
      .getDbList()
      .then((dbList: any) => {
        this.perfectUrl = true;
        this.utils.dismissLoading();
        this.fillData(dbList);
      })
      .catch((err: any) => {
        this.utils.presentAlert("Error.", err, [{
          text: "Ok"
        }]);
        this.utils.dismissLoading();
      });
  }

  public fillData(res: any) {
    let body = JSON.parse(res._body);
    if (body['error']) {
      this.odooRpc.handleOdooErrors(body);
    } else {
      let json = body["result"];
      this.dbList = [];
      for (var key in json) {
        this.selectedDatabase = json[key];
        this.dbList.push({ dbName: json[key] });
      }
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

  private login() {
    this.utils.presentLoading("Please wait", 0, true);
    this.odooRpc
      .login(this.selectedDatabase, this.email, this.password)
      .then((res: any) => {
        let parse = JSON.parse(res._body);
        if (parse['error']) {
          this.odooRpc.handleOdooErrors(parse);
        } else {
          let logiData: any = parse["result"];
          logiData.password = this.password;
          localStorage.setItem("token", JSON.stringify(logiData));
          this.navCtrl.setRoot(DashboardPage);
        }
      })
      .catch(err => {
        this.utils.dismissLoading();
        this.utils.presentAlert(
          "Error",
          "Username or password must be incorrect",
          [{
            text: "Ok"
          }]
        );
      });
  }
}
