import 'reflect-metadata';
import { injectable } from "inversify";
import { Game } from '../src/Game';
import socketio from 'socket.io';


@injectable()
export class GameHandler {

    games: Game[]

    io: socketio.Server;

    constructor() {
        this.games = [];
    }

    startGame(roomName: string, connectedSockets: socketio.Room) {
        this.games.push(new Game(this.io, roomName, Object.keys(connectedSockets.sockets)));
    }

    cancelGame(roomName: string, connectedSockets: socketio.Room) {
        const indexOfGame = this.games.findIndex((game) => {
            game.roomName === roomName;
        });
        this.games.splice(indexOfGame);
    }

}