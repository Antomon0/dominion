import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/service/socket-service.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DeckInputComponent } from '../deck-input/deck-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomInfoService } from 'src/app/service/room-info-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnDestroy {

  title: string;
  openedDialog: MatDialogRef<DeckInputComponent>;
  subscriptions: Subscription[];

  constructor(
    private route: ActivatedRoute,
    private io: SocketService,
    private router: Router,
    private dialogOpener: MatDialog,
    public roomInfo: RoomInfoService,
  ) {
    this.title = this.route.snapshot.paramMap.get('id');
    this.subscriptions = [];
    this.subscriptions.push(
      this.io.startGame().subscribe(() => {
        this.openedDialog = this.dialogOpener.open(DeckInputComponent, { height: '90%' });
        this.openedDialog.afterClosed().subscribe(() => {
          this.cancelGame();
        });
      }));
  }

  startGame(): void {

  }

  cancelGame(): void {

  }

  leaveRoom(): void {
    this.io.leaveRoom();
    this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    this.leaveRoom();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
