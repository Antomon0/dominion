import { Component, OnInit } from '@angular/core';
import { SocketService } from '../service/socket-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeckInputComponent } from '../components/deck-input/deck-input.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  messages: string[];
  openedDialog: MatDialogRef<DeckInputComponent>;

  constructor(
    public io: SocketService,
    private dialogOpener: MatDialog,
  ) {
    this.messages = [];
  }

  ngOnInit(): void {
    this.io.joinSuccess().subscribe((joinMsg: string) => {
      this.messages.push(joinMsg);
    });
    this.io.startGame().subscribe((life: number) => {
      this.openedDialog = this.dialogOpener.open(DeckInputComponent, { height: '90%' });
      this.openedDialog.afterClosed().subscribe(() => {
        // do stuff when closes
      });
    });
  }

  joinRoom(username: string): void {
    this.io.joinRoom('room1', username);
  }

}
