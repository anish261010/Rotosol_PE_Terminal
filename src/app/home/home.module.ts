import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ConsoleComponent } from './console/console.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { ModalComponent } from './components/modal/modal.component';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    NgxSpinnerModule,
  ],
  declarations: [HomePage, ConsoleComponent, ChatBoxComponent, ModalComponent],
  providers: [ScreenOrientation, AndroidPermissions, BluetoothSerial],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
