import { Component } from '@angular/core';
import { SocketService } from '../service/socket-service.service';
import { Router } from '@angular/router';
import { RoomInfoService } from '../service/room-info-service.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {

  constructor(
    private io: SocketService,
    private router: Router,
    public roomInfo: RoomInfoService,
  ) {
    this.io.joinSuccess().subscribe((room: string) => {
      this.router.navigate(['room/', room]);
    });
  }


  joinRoom(roomName: string, username: string): void {
    this.io.joinRoom(roomName, username);
  }

}
