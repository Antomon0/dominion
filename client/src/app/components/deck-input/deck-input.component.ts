import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/service/socket-service.service';

@Component({
  selector: 'app-deck-input',
  templateUrl: './deck-input.component.html',
  styleUrls: ['./deck-input.component.css']
})
export class DeckInputComponent {

  constructor(
    private socket: SocketService,
  ) { }

  sendDeck(deck: string) {
    this.socket.sendDeck(deck);
  }

}
