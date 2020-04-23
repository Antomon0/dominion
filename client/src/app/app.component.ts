import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NotificationService } from './service/notification-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('notificationPanel') private panel: ElementRef;

  constructor(
    public notification: NotificationService,
  ) { }

  ngAfterViewInit(): void {
    this.notification.setNotificationPanel(this.panel);
  }

}
