import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { IonContent, IonModal, NavController } from '@ionic/angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../components/modal/modal.component';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { NgZone } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit {
  public deviceList: any = [];
  public unPeiredList: any = [];
  public showDropDown: boolean = false;
  public messages: { text: string; sent: boolean }[] = [];
  public newMessage: string = '';
  public deviceIndex: any = null;
  items: string[] = [];
  public isAlertOpen: boolean = false;
  public selectedDeviceValue: any = [];
  public selectedDevice: any = '';
  @ViewChildren('messageElement') messageElements!: QueryList<ElementRef>;
  @ViewChild(IonContent, { static: false }) myContent!: IonContent;
  @ViewChild('messageElement', { static: false }) messageElement!: IonContent;
  @ViewChild('modal') modal!: IonModal;
  @Output() activeHome = new EventEmitter<boolean>();
  private unsubscribe$ = new Subject<void>();
  info: string = '';
  isLoading: boolean = false;
  isMenuTitle: any = 'Devices';
  isReadOnly = true;
  alertButtons = ['Okay'];
  public alertMsg = '';
  public _debug: string = '';
  public getCmds: string[] = [
    'GET DEVINFO',
    'GET SYSPARAM',
    'GET SYS',
    'GET STAT',
    'GET REPORT',
    'GET DT',
    'GET PINFO',
    'GET URID',
    'GET DEVID',
    'GET LOC',
    'GET SIM1APN',
    'GET SIM2APN',
    'GET APNMODE',
    'GET,COMPORT',
    'GET IP 1',
    'GET IP 2',
    'GET PT 1',
    'GET PT 2',
    'GET URL 1',
    'GET URL 2',
    'GET MQTTHOST',
    'GET MQTTPORT',
    'GET MQTTUSER',
    'GET MQTTPASS',
    'GET CLIENTID',
    'GET MQTTSSL',
    'GET MQTTCERT',
    'GET FLHOST',
    'GET FLMQTTPORT',
    'GET FLMQTTUSER',
    'GET FLMQTTPASS',
    'GET FLCLIENTID',
    'GET FLPUBTOPIC',
    'GET FLSUBTOPIC',
    'GET FLHTTPORT',
    'GET FLHTTPURL',
    'GET FLHTTPTOKEN',
    'GET HBPUB',
    'GET DATAPUB',
    'GET OTPSUB',
    'GET INFOSUB',
    'GET ONDEMANDSUB',
    'GET ONDEMANDPUB',
    'GET CONFIGSUB',
    'GET CONFIGPUB',
    'GET TIMEINT',
    'GET DHEAD',
    'GET CORDHEAD',
    'GET LOGSEND 0',
    'GET LOGSEND 1',
    'GET LOGSAVE 0',
    'GET LOGSAVE 1',
    'GET LOGCNT 0',
    'GET LOGCNT 1',
    'GET LOG 0',
    'GET LOG 1',
    'GET PUMPDET',
    'GET PUMPPARAM',
    'GET FLASHDET',
    'GET SIMDET',
    'GET SDDET',
    'GET GPSLOCK',
    'GET LOC',
    'GET RTCSTAT',
    'GET GPSLOCK',
    'GET CONTYPE',
    'GET PCNTRMODE',
    'GET IMEI',
    'GET SPCLPREFFREQ1',
    'GET PDCVOC1',
    'GET PMAXDCV1',
    'GET PMAXDCI1',
    'GET PDCISC',
    'GET PHEAD',
    'GET PFREQHSP1',
    'GET PFREQLSP1',
    'GET PMAXFREQ1',
    'GET FCODE',
    'GET POWER0',
    'GET POWER1',
    'GET POWER2',
    'GET POWER3',
    'GET POWER4',
    'GET POWER5',
    'GET FLOW1',
    'GET FLOW2',
    'GET FLOW3',
    'GET FLOW4',
    'GET PMAXFLW1',
    'GET HBINTERVAL',
  ];
  public setCmds: string[] = [
    'SET DT',
    'SET PINFO',
    'SET URID',
    'SET LOC',
    'SET SIM1APN',
    'SET SIM2APN',
    'SET APNMODE 0',
    'SET APNMODE 1',
    'SET,APNMODE',
    'SET IP 1',
    'SET IP 2',
    'SET PT 1',
    'SET PT 2',
    'SET URL 1',
    'SET URL 2',
    'SET MQTTHOST',
    'SET MQTTPORT',
    'SET MQTTUSER',
    'SET MQTTPASS',
    'SET CLIENTID',
    'SET MQTTSSL',
    'SET MQTTCERT',
    'SET FLHOST',
    'SET FLMQTTPORT',
    'SET FLMQTTUSER',
    'SET FLMQTTPASS',
    'SET FLCLIENTID',
    'SET FLPUBTOPIC',
    'SET FLSUBTOPIC',
    'SET FLHTTPORT',
    'SET FLHTTPURL',
    'SET FLHTTPTOKEN',
    'SET HBPUB',
    'SET DATAPUB',
    'SET OTPSUB',
    'SET INFOSUB',
    'SET ONDEMANDSUB',
    'SET ONDEMANDPUB',
    'SET CONFIGSUB',
    'SET CONFIGPUB',
    'SET TIMEINT',
    'SET TCPZERO',
    'SET DHEAD 0',
    'SET DHEAD 1',
    'SET DHEAD 0',
    'SET DHEAD 1',
    'SET LOGSEND 0 0',
    'SET LOGSEND 0 1',
    'SET LOGSEND 1 0',
    'SET LOGSEND 1 1',
    'SET LOGSAVE 0 0',
    'SET LOGSAVE 0 1',
    'SET LOGSAVE 1 0',
    'SET LOGSAVE 1 1',
    'SET LOG',
    'SET PUMPON 0',
    'SET PUMPON 1',
    'SET PUMPON',
    'SET PCNTRMODE',
    'SET SPCLPREFFREQ1',
    'SET PDCVOC1',
    'SET PMAXDCV1',
    'SET PMAXDCI1',
    'SET PDCISC',
    'SET PHEAD',
    'SET PFREQHSP1',
    'SET PFREQLSP1',
    'SET PMAXFREQ1',
    'SET FCODE',
    'SET POWER0',
    'SET POWER1',
    'SET POWER2',
    'SET POWER3',
    'SET POWER4',
    'SET POWER5',
    'SET FLOW1',
    'SET FLOW2',
    'SET FLOW3',
    'SET FLOW4',
    'SET PMAXFLW1',
    'SET HBINTERVAL',
  ];
  public otherCmds: string[] = [
    'DEL LOG',
    'DEFLOG 0',
    'DEFLOG 1',
    'DEFSYS',
    'FORMAT 1',
    'FORMAT 2',
    'RST',
    'DBG',
    'APPDBG',
    'GSMDBG',
    'PUMPDBG',
    'GPSDBG',
    'BTON',
    'BTON',
    'BTON',
    'SENDSMS',
  ];
  constructor(
    private loadingController: LoadingController,
    private navCtrl: Router,
    private spinner: NgxSpinnerService,
    private bluetoothPort: BluetoothSerial,
    private el: ElementRef,
    private androidPermissions: AndroidPermissions,
    private ngZone: NgZone,
    private modalCtrl: ModalController
  ) {}
  modalDismiss(event: any) {
    console.log(event);
    event.target.isOpen = false;
  }
  checkBLE() {
    this.bluetoothPort.isEnabled().then(
      (success) => {
        console.log(success);
      },
      (error) => {
        this.bluetoothPort.enable().then(
          (enable) => {
            console.log(enable);
            this.dataList();
          },
          (error) => {
            console.log(error);
          }
        );
      }
    );
  }
  ngOnInit() {
    this.spinner.show();

    this.checkBLE();
    this.dataList();
    console.log(localStorage.getItem('accessToken'));
    const token = localStorage.getItem('jwtToken');
    // if (!token) {
    //   this.isAlertOpen = true;
    //   this.alertMsg = 'You have to login first';
    // }
    // this.openWebView();
    this.androidPermissions
      .checkPermission(this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT)
      .then(
        (result) => {
          if (result.hasPermission) {
            //Do nothing and proceed permission exists already
          } else {
            //Request for all the permissions in the array
            this.androidPermissions
              .requestPermissions([
                this.androidPermissions.PERMISSION.BLUETOOTH,
                this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
                this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
                this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
                this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
              ])
              .then((data) => {
                this.dataList();
              });
          }
        },
        (err) =>
          this.androidPermissions.requestPermissions([
            this.androidPermissions.PERMISSION.BLUETOOTH,
            this.androidPermissions.PERMISSION.BLUETOOTH_ADMIN,
            this.androidPermissions.PERMISSION.BLUETOOTH_CONNECT,
            this.androidPermissions.PERMISSION.BLUETOOTH_SCAN,
            this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
          ])
      );
    this.items = this.getCmds;
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'custom-loading',
      message: 'Loading...',
      spinner: 'circles',
    });

    await loading.present();

    // The loading component will be automatically dismissed after 3 seconds.
    // You can remove the following line if you want to close it manually.
    setTimeout(() => {
      this.dismissLoading(loading);
    }, 3000);
  }

  async dismissLoading(loading: HTMLIonLoadingElement) {
    await loading.dismiss();
  }
  setOpen(flag: boolean) {
    console.log(flag);

    this.isAlertOpen = flag;
    if (!flag) {
      if (this.isMenuTitle === 'Terminal') {
        this.isMenuTitle = 'Devices';
      } else {
        this.activeHome.emit(true);
      }
    }
  }
  async dataList() {
    this.showDropDown = true;
    await this.bluetoothPort.list().then((data) => {
      console.log(data);

      this.deviceList = data;
    });
  }

  async unPairedDevices() {
    await this.bluetoothPort.discoverUnpaired().then(
      (device) => {
        console.log(device);

        this.bluetoothPort.setDeviceDiscoveredListener().subscribe((device) => {
          this.unPeiredList = [device];

          console.log(this.unPeiredList);
        });
      },
      (error) => {
        console.log('could not find unparied devices ' + error);
      }
    );
  }
  ionViewDidEnter(): void {
    this.scrollToBottom();
  }
  async openModal() {
    if (!this.newMessage) {
      const modal = await this.modalCtrl.create({
        component: ModalComponent,
        showBackdrop: true,
        componentProps: {
          // Pass your data here
          items: this.items,
        },
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
        this.ngZone.run(() => {
          this.isReadOnly = false;
        });
        console.log('data', data);
        this.newMessage = data;
      }
    }
  }
  scrollToBottom() {
    if (this.messageElement) {
      this.messageElement.scrollToBottom(300);
    }
  }

  scrollToLastMessage() {
    const messageElementsArray = this.messageElements.toArray();
    if (messageElementsArray.length > 0) {
      const lastMessageElement =
        messageElementsArray[messageElementsArray.length - 1].nativeElement;
      lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  handleBlurEvent(event: any) {
    const clickedOutside = !event.target.closest('ion-input');

    if (!clickedOutside) {
      this.showDropDown = false;
      console.log('Clicked outside ion-input');
    }
  }

  goBack() {
    this.navCtrl.navigateByUrl('home');
  }

  async sendMessage() {
    if (this.newMessage.trim() === '') {
      return;
    }

    this.messages.push({
      text: this.newMessage,
      sent: true,
    });

    this.bluetoothPort.write(this.newMessage).then(
      async (writeData) => {
        console.log('Write successful:', writeData);
        this.newMessage = '';
        let datas = '';
        await this.bluetoothPort.subscribeRawData().subscribe(
          (receivedData) => {
            this.bluetoothPort.read().then((dd) => {
              this.onDataReceive(dd);
              console.log(dd);
              this.ngZone.run(() => {
                this.messages.push({
                  text: dd,
                  sent: false,
                });
              });
            });
          },
          (subscribeError) => {
            console.error('Error subscribing to data:', subscribeError);
          }
        );
      },
      (writeError) => {
        console.error('Error writing data:', writeError);
      }
    );
  }
  onDataReceive(dd: any) {
    console.log(this._debug);
  }
  connectToDevice(value: any, i: any) {
    this.isLoading = true;
    this.deviceIndex = i;
    this.showDropDown = false;
    console.log(value);
    this.selectedDeviceValue = value;
    this.selectedDevice = value.name;
    if (!this.info) {
      setTimeout(() => {
        this.isLoading = false;
        this.info = 'Try again';
      }, 3000);
    }
    this.bluetoothPort.connect(value.id).subscribe(
      (connectData) => {
        console.log('Connected successfully:', connectData);
        this.ngZone.run(() => {
          this.info = 'Connected';
          setTimeout(() => {
            this.isMenuTitle = 'Terminal';
          }, 1000);
          this.isLoading = false;
        });
      },
      (connectError) => {
        console.error('Error connecting to device:', connectError);
        this.ngZone.run(() => {
          this.info = 'Try again';
          this.isLoading = false;
        });
      }
    );
  }
  selectedCmd(value: any): void {
    console.log(value);
    this.newMessage = '';
    if (value.detail.value === '1') {
      this.items = this.getCmds;
      // this.openModal(this.getCmds);
    } else if (value.detail.value === '2') {
      this.items = this.setCmds;
      // this.openModal(this.setCmds);
    } else {
      this.items = this.otherCmds;
      // this.openModal(this.otherCmds);
    }
  }
  // OnDestroy lifecycle hook
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onMessageChange(event: any) {
    // You can perform actions as the user types, if needed
  }

  clickMenu(menu: any) {
    this.isMenuTitle = menu;
    if (menu === 'Terminal' && this.info === 'Connected') {
    } else if (menu === 'Terminal' && this.info !== 'Connected') {
      this.alertMsg = 'You have to connect the device first';
      console.log(this.isAlertOpen);

      this.isAlertOpen = true;
    }
  }
}
