import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket-service.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  messages: string[];

  constructor(
    public io: SocketService,
  ) {
    this.messages = [];
  }

  ngOnInit(): void {
    this.io.joinSuccess().subscribe((joinMsg: string) => {
      this.messages.push(joinMsg);
    });
    this.io.startGame().subscribe((life: number) => {
      this.messages.push(life.toFixed(0));
    });
  }

  joinRoom(username: string): void {
    this.io.joinRoom('room1', username);
  }

}
