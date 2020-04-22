import 'reflect-metadata';
import { injectable, inject } from "inversify";
import * as socketio from 'socket.io';
import * as http from 'http';
import types from './config/types';
import { RoomHandler } from './services/RoomHandler';
import { GameHandler } from './services/GameHandler';


@injectable()
export class SocketIo {

    io: socketio.Server;

    constructor(
        @inject(types.RoomHandler) private roomHandler: RoomHandler,
        @inject(types.GameHandler) private gameHandler: GameHandler,
    ) { }

    init(server: http.Server) {
        this.io = socketio(server);
        this.roomHandler.io = this.io;
        this.gameHandler.io = this.io;
        this.bindIoEvents();
    }

    bindIoEvents(): void {
        this.io.on('connection', (socket: socketio.Socket) => {
            console.log(`Connected with ${socket.id} \n`);

            socket.on('join', (roomName: string, username: string) => {
                this.roomHandler.joinRoom(socket, roomName, username);
            });

            socket.on('leave', () => {
                this.roomHandler.leaveRoom(socket);
            })

            socket.on('disconnect', () => {
                console.log(`Disconnected : ${socket.id} \n`);
            });
        });
    }
}