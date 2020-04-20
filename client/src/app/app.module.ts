import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog/';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewComponent } from './view/view.component';
import { SocketService } from './service/socket-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeckInputComponent } from './components/deck-input/deck-input.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewComponent,
    DeckInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [
    SocketService,
  ],
  entryComponents: [
    DeckInputComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
