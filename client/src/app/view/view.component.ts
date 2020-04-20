import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeckInputComponent } from '../components/deck-input/deck-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  roomInfo: [string, number][];

  constructor(
    private io: SocketService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.io.roomInfo().subscribe((roomInfo) => {
      this.roomInfo = roomInfo;
    });

    this.io.joinSuccess().subscribe((joinMsg: string) => {
      this.router.navigateByUrl('/room');
    });
  }

  joinRoom(roomName: string, username: string): void {
    this.io.joinRoom(roomName, username);
  }

}
