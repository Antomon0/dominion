import { SocketService } from './socket-service.service';
import { Injectable } from '@angular/core';

@Injectable()
export class RoomInfoService {

    private readonly MAX_PLAYER_PER_ROOM = 2;

    roomInfo: [string, number][];

    constructor(
        private io: SocketService,
    ) {
        this.io.roomInfo().subscribe((roomInfo) => {
            this.roomInfo = roomInfo;
        });
    }

    getRoomStatus(roomName: string) {
        if (this.roomInfo) {
            const room = this.roomInfo.find((info) => info[0] === roomName);
            return `${room[0]} : ${room[1]} / ${this.MAX_PLAYER_PER_ROOM}`;
        } else {
            return 'No rooms available';
        }
    }
}
