import express from 'express';
import { AddressInfo } from 'net';
import { getCars, getCompanies, getPersons } from './data-retrieval';

const app = express();

app.get('/cars', async (_req, res) => {
    const data = await getCars();
    res.json({
        data,
        total: data.length
    });
});

app.get('/companies', async (_req, res) => {
    const data = await getCompanies();
    res.json({
        data,
        total: data.length
    });
});

app.get('/persons', async (_req, res) => {
    const data = await getPersons();
    res.json({
        data,
        total: data.length
    });
});

const server = app.listen(3000, () => {
    const { address, port } = server.address() as AddressInfo;
    console.info(`Listening on ${address}:${port}`);
});
