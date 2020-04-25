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
    }

    addPlayer(player: Player): void {
        this.players.push(player);
    }

    removePlayer(player: Player): void {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }

    cancelGame(): void {

    }

    startGame(): void {
        this.players.forEach((player) => {
            this.io.to(player.sid).emit('startGame');
        });
    }

}