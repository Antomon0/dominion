import { SocketService } from './socket-service.service';
import { Injectable } from '@angular/core';

@Injectable()
export class RoomInfoService {

    readonly MAX_PLAYER_PER_ROOM = 2;

    roomInfo: [string, number][];

    constructor(
        private io: SocketService,
    ) {
        this.io.roomInfo().subscribe((roomInfo) => {
            this.roomInfo = roomInfo;
        });
    }

    getNumberOfPlayers(roomName: string): number {
        if (this.roomInfo) {
            const room = this.roomInfo.find((info) => info[0] === roomName);
            return room[1];
        }
        return 0;
    }

    getRoomStatus(roomName: string): string {
        if (this.roomInfo) {
            const room = this.roomInfo.find((info) => info[0] === roomName);
            return `${room[0]} : ${room[1]} / ${this.MAX_PLAYER_PER_ROOM}`;
        }
        return 'No rooms available';
    }
}
