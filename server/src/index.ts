import express, { RequestHandler } from 'express';
import { AddressInfo } from 'net';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { getCompanies } from "./companies/companies";
import { getPersons } from "./people/people";
import { getCars } from "./cars/cars";
import { getDB } from './connection';
import { join } from 'path';

config();
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN
})).use(morgan('common'));

function catchAsyncErrors(handler: (...params: Parameters<RequestHandler>) => Promise<void>): RequestHandler {
    return function (req, res, next) {
        handler(req, res, next).catch(next);
    }
}

app.get('/cars', catchAsyncErrors(async (req, res) => {
    const data = await getCars(req.query);
    res.json(data);
}));

app.get('/companies', catchAsyncErrors(async (req, res) => {
    const data = await getCompanies(req.query);
    res.json(data);
}));

app.get('/people', catchAsyncErrors(async (req, res) => {
    const data = await getPersons(req.query);
    res.json(data);
}));

const port: number = Number(process.env.SERVER_PORT);
const host: string = process.env.SERVER_HOST!;

(async () => {
    const db = await getDB();
    await db.migrate({
        migrationsPath: join(__dirname, '..', 'migrations')
    });

    const server = app.listen(port, host, () => {
        const { address, port } = server.address() as AddressInfo;
        console.info(`Listening on ${address}:${port}`);
    });
})().catch(console.error);
