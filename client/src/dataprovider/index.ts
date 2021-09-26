import { DataProvider } from "ra-core";
import { stringify } from 'qs';

function partition(arr: any[], n: number): any[][] {
    return arr.length ? [arr.splice(0, n)].concat(partition(arr, n)) : [];
}

function request(url: URL) {
    return async function request(resources: string, params: any) {
        url.pathname = resources;

        if (params.ids && params.ids.length > 10) {
            let completeData = { data: [] };
            const idSets = partition(params.ids, 10);
            for (const ids of idSets) {
                url.search = stringify({ ids });
                const data = await fetch(url.toString()).then(res => res.json());
                completeData.data.concat(data.data);
            }
            return completeData;
        } else {
            url.search = stringify(params);

            const res = await fetch(url.toString());
            return res.json();
        }
    }
}

export function myDataProvider(url: string): Partial<DataProvider> {
    const urlObj = new URL(url);
    return {
        getList: request(urlObj),
        getMany: request(urlObj),
        getManyReference: request(urlObj),
        getOne: request(urlObj),
        // create: request,
        // update: request,
        // updateMany: request,
        // delete: request,
        // deleteMany: request
    };
}
