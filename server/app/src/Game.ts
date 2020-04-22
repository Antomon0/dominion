import socketio from 'socket.io';
import { Player } from './Player';
import { inject } from 'inversify';
import { ScryfallApiService } from '../services/ScryfallApiService';
import types from '../config/types';

export class Game {

    private io: socketio.Server;

    roomName: string;

    private players: Map<string, Player>;

    constructor(
        @inject(types.Scryfall) private api: ScryfallApiService,
        io: socketio.Server,
        room: string,
        sids: string[]
    ) {
        this.io = io;
        this.roomName = room;
        this.players = new Map<string, Player>();
        sids.forEach((sid) => {
            const player = new Player(this.api);
            this.players.set(sid, player);
            this.io.to(sid).emit('startGame');

            player.finishedAssemblingDeck.subscribe((urls: string[]) => {
                this.io.sockets.sockets[sid].emit('finishedDeck', urls);
            });

            this.io.sockets.sockets[sid].on('deck', (deck: string[]) => {
                player.assembleDeck(deck);
            });
        });
    }



}