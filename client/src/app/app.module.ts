import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog/';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewComponent } from './view/view.component';
import { SocketService } from './service/socket-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeckInputComponent } from './components/deck-input/deck-input.component';
import { RoomComponent } from './components/room/room.component';
import { RoomInfoService } from './service/room-info-service.service';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    DeckInputComponent,
    RoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    SocketService,
    RoomInfoService,
  ],
  entryComponents: [
    DeckInputComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
