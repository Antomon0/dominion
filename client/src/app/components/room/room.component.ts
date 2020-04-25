import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/service/socket-service.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DeckInputComponent } from '../deck-input/deck-input.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RoomInfoService } from 'src/app/service/room-info-service.service';
import { Subscription } from 'rxjs';
import { DeckInfo, CardInfo } from '../../../../../common/DeckInfo';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnDestroy {

  CardTypesRef: typeof CardTypes = CardTypes;

  cannotChangeDeck: boolean;
  title: string;

  infoToDisplay: [string, CardInfo[]][];
  commanders: CardInfo[];

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
    this.infoToDisplay = [];
    this.commanders = [];
    for (const type in CardTypes) {
      if (isNaN(Number(type))) {
        this.infoToDisplay.push([type, []]);
      }
    }

    this.cannotChangeDeck = false;
    this.subscriptions = [];

    this.subscriptions.push(
      this.io.startGame().subscribe(() => {
        this.openedDialog = this.dialogOpener.open(DeckInputComponent, { height: '90%' });
        this.openedDialog.afterClosed().subscribe(() => {
          this.cancelGame();
        });
      }));

    this.subscriptions.push(
      this.io.deckInfo().subscribe((deckInfo: DeckInfo) => {
        const basicLands: CardInfo[] = [];
        deckInfo.cards.forEach((card) => {
          if (card.isCommander) {
            this.commanders.push(card);
          } else {
            for (const type in CardTypes) {
              if (isNaN(Number(type))) {
                const typeLine = card.types.toLowerCase().split(' // ')[0];
                if (typeLine.includes('basic') && typeLine.includes('land')) {
                  basicLands.push(card);
                  break;
                }
                if (typeLine.includes(type.toLowerCase())) {
                  this.infoToDisplay[CardTypes[type]][1].push(card);
                  break;
                }
              }
            }
          }
        });
        this.infoToDisplay[CardTypes.Land][1] = this.infoToDisplay[CardTypes.Land][1].concat(basicLands);
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

  changeDeck(): void {
    this.openedDialog = this.dialogOpener.open(DeckInputComponent, { height: '90%' });
  }

  ngOnDestroy(): void {
    this.leaveRoom();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

enum CardTypes {
  Creature = 0,
  Instant = 1,
  Sorcery = 2,
  Artifact = 3,
  Enchantment = 4,
  Planeswalker = 5,
  Land = 6,
}
