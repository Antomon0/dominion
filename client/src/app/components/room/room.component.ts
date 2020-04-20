import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/service/socket-service.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DeckInputComponent } from '../deck-input/deck-input.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnDestroy {

  openedDialog: MatDialogRef<DeckInputComponent>;
  messages: string[];

  constructor(
    private io: SocketService,
    private router: Router,
    private dialogOpener: MatDialog,
  ) {
    this.io.startGame().subscribe((life: number) => {
      this.openedDialog = this.dialogOpener.open(DeckInputComponent, { height: '90%' });
      this.openedDialog.afterClosed().subscribe(() => {
        // do stuff when closes
      });
    });
  }

  leaveRoom(): void {
    this.io.leaveRoom();
    this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    this.leaveRoom();
  }
}
