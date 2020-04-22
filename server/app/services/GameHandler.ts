import 'reflect-metadata';
import { injectable, inject } from "inversify";
import { Game } from '../src/Game';
import socketio from 'socket.io';
import { ScryfallApiService } from './ScryfallApiService';
import types from '../config/types';


@injectable()
export class GameHandler {

    games: Game[]

    io: socketio.Server;

    constructor(
        @inject(types.Scryfall) private api: ScryfallApiService,
    ) {
        this.games = [];
    }

    startGame(roomName: string, connectedSockets: socketio.Room) {
        this.games.push(new Game(this.api, this.io, roomName, Object.keys(connectedSockets.sockets)));
    }

    cancelGame(roomName: string, connectedSockets: socketio.Room) {
        const indexOfGame = this.games.findIndex((game) => {
            game.roomName === roomName;
        });
        this.games.splice(indexOfGame);
    }

}