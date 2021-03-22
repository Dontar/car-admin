import express, { RequestHandler } from 'express';
import { AddressInfo } from 'net';
import cors from 'cors';
import morgan from 'morgan';
import { config as envConfig } from 'dotenv';
import { getCompanies } from './companies/companies';
import { getPersons } from './people/people';
import { getCars } from './cars/cars';
import { isMaster, fork, workers, worker } from 'cluster';
import { cpus } from 'os';
import { getDB } from './connection';

envConfig();

if (isMaster) {

    onExit(cleanUpWorkers);

    // const db = await getDB();
    // console.info('Performing DB migrations...');
    // await db.migrate({
    //     migrationsPath: join(__dirname, '..', 'migrations')
    // });

    const cpuCount = Number(process.env.WORKERS ?? cpus().length);
    console.info(`Starting ${cpuCount} workers...`);
    for (let i = 0; i < cpuCount; i++) {
        fork();
    }

} else {

    onExit(cleanUpDatabase);

    const app = express();

    app.use(cors({
        origin: process.env.CORS_ORIGIN
    })).use(morgan('common'));

    app.get('/cars', catchAsyncErrors(async (req, res) => {
        const data = getCars(req.query);
        data.pipe(res.type('application/json'));
    }));

    app.get('/companies', catchAsyncErrors(async (req, res) => {
        const data = getCompanies(req.query);
        data.pipe(res.type('application/json'));
    }));

    app.get('/people', catchAsyncErrors(async (req, res) => {
        const data = getPersons(req.query);
        data.pipe(res.type('application/json'));
    }));

    const port = Number(process.env.SERVER_PORT);
    const host = process.env.SERVER_HOST ?? 'localhost';

    const server = app.listen(port, host, () => {
        const { address, port } = server.address() as AddressInfo;
        console.info(`${worker.id} Listening on ${address}:${port}`);
    });
}

function catchAsyncErrors(handler: (...params: Parameters<RequestHandler>) => Promise<void>): RequestHandler {
    return function (req, res, next) {
        handler(req, res, next).catch(next);
    };
}

function cleanUpWorkers() {
    for (const [, worker] of Object.entries(workers)) {
        worker?.kill();
    }
}

function cleanUpDatabase() {
    getDB().close();
}

function onExit(cb: (...args: unknown[]) => void) {
    const exitEvents = ['exit', 'SIGHUP', 'SIGINT', 'SIGINT', 'SIGTERM'];
    exitEvents.forEach(e => process.on(e, cb));
}
