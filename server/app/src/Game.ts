import socketio from 'socket.io';
import { Player } from './Player';
import { container } from '../config/inversify.config';
import types from '../config/types';

export class Game {

    private io: socketio.Server;

    roomName: string;

    private players: Map<string, Player>;

    constructor(io: socketio.Server, room: string, sids: string[]) {
        this.io = io;
        this.roomName = room;
        this.players = new Map<string, Player>();
        sids.forEach((sid) => {
            const player = container.get<Player>(types.Player);
            this.players.set(sid, player);
            this.io.to(sid).emit('startGame');

            player.deck.finishedAssemblingDeck.subscribe((urls: string[]) => {
                this.io.sockets.sockets[sid].emit('finishedDeck', urls);
            });

            this.io.sockets.sockets[sid].on('deck', (deck: string[]) => {
                player.deck.resetDeck();
                player.deck.assembleDeck(deck);
            });
        });
    }



}