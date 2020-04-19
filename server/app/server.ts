import 'reflect-metadata';
import { injectable, inject } from "inversify";
import { Application } from "./app";
import { SocketIo } from './SocketIo';
import * as http from 'http';
import Types from './types';

@injectable()
export class Server {
    private readonly port = process.env.PORT || 3000;

    server: http.Server;

    constructor(
        @inject(Types.Application) private application: Application,
        @inject(Types.SocketIo) private io: SocketIo,
    ) { }

    init(): void {
        this.server = http.createServer(this.application.app);
        this.server.listen(this.port);
        this.io.init(this.server);
        this.bindServerEvents();
    }

    bindServerEvents(): void {
        this.server.on('error', (error) => console.error(error));

        this.server.on('listening', () => console.log(`listening on ${this.port}`));
    }
}