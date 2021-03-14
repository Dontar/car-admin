import express from 'express';
import { AddressInfo } from 'net';
import cors from 'cors';
import morgan from 'morgan';
import { getCars, getCompanies, getPersons } from './data-retrieval';
import { config } from 'dotenv';

config();
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
})).use(morgan('common'));

app.get('/cars', async (req, res) => {
    const data = await getCars(req.query);
    res.json(data);
});

app.get('/companies', async (req, res) => {
    const data = await getCompanies(req.query);
    res.json(data);
});

app.get('/people', async (req, res) => {
    const data = await getPersons(req.query);
    res.json(data);
});

const server = app.listen(3001, () => {
    const { address, port } = server.address() as AddressInfo;
    console.info(`Listening on ${address}:${port}`);
});
