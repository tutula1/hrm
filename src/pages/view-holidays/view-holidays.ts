import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { Utils } from "../../services/utils";
import { OdooJsonRpc } from "../../services/odoojsonrpc";
/**
 * Generated class for the ViewHolidaysPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-holidays',
  templateUrl: 'view-holidays.html',
})
export class ViewHolidaysPage {
  id: any = 0;
  title: any = '';
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public odooRpc: OdooJsonRpc,
    public utils: Utils
  ) {
    this.id = this.navParams.get("id");
    this.title = this.navParams.get("title");
    if(!this.id){
    	this.cancel();
    } else {
    	this.display();
    }
  }

  display(){

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewHolidaysPage');
  }

}
