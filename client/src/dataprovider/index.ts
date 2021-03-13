import { DataProvider } from "ra-core";
import { stringify } from 'qs';

const url = new URL('http://localhost:3001');

async function request(resources: string, params: any) {
    url.pathname = resources;
    url.search = stringify(params);

    const res = await fetch(url.toString());
    return res.json();
}

export const dataProvider: Partial<DataProvider> = {
    getList: request,
    getMany: request,
    getManyReference: request,
    getOne: request,
    // create: request,
    // update: request,
    // updateMany: request,
    // delete: request,
    // deleteMany: request
};