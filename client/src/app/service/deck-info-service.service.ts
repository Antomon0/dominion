import { Injectable } from '@angular/core';
import { SocketService } from './socket-service.service';
import { DeckInfo } from '../../../../common/DeckInfo';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class DeckInfoService {

    private deckInfoSubject: Subject<any>;

    deckInfo: DeckInfo;
    deckUpdated: Observable<DeckInfo>;

    constructor(
        private io: SocketService,
    ) {
        this.deckInfoSubject = new Subject<DeckInfo>();
        this.deckUpdated = this.deckInfoSubject.asObservable();
        this.io.deckInfo().subscribe((deckInfo: DeckInfo) => {
            this.deckInfo = deckInfo;
            this.deckInfoSubject.next();
        });
    }

}
