import 'reflect-metadata';
import { injectable } from "inversify";
import * as express from 'express';
import * as cors from 'cors';

@injectable()
export class Application {

    app: express.Application;

    constructor() {
        this.app = express();

        this.setupMiddleWares();

        this.bindRoutes();
    }

    setupMiddleWares() {
        this.app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
        this.app.options('*', cors());
    }

    bindRoutes() {
        this.app.get('/', (req, res) => {
            res.send('It Works?');
        });
    }

}