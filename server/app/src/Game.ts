import * as socketio from 'socket.io';
import { Player } from './Player';
import { injectable } from 'inversify';

@injectable()
export class Game {

    private io: socketio.Server;

    private players: Player[];

    constructor(io: socketio.Server) {
        this.io = io;
        this.players = [];
        setInterval(() => this.canStartGame(), 1000 / 60);
    }

    addPlayer(player: Player): void {
        this.players.push(player);
        player.deck.sendDeckInfo();
    }

    removePlayer(player: Player): void {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }

    cancelGame(): void {

    }

    canStartGame(): void {
        if (this.io) {
            const canStart = this.players.findIndex((player) => !player.ready()) === -1;
            this.players.forEach((player) => {
                this.io.to(player.sid).emit('canStartGame', canStart);
            });
        }
    }

}