import { config as envConfig } from 'dotenv';
import { getCars } from '../cars/cars';
import { getCompanies } from '../companies/companies';
import { getPersons } from '../people/people';
import { streamToString } from './test-utils';

envConfig();

type TestParams = Array<[string, Parameters<typeof getCars>[0]]>;
type TestFunctions = Array<[string, typeof getCars, TestParams]>;

const testsParams: TestFunctions = [
    ['cars', getCars, [
        ['with id', { id: 4601 }],
        ['with ids', { ids: [4601, 4602] }],
        ['with pagination', { pagination: { page: 1, perPage: 2 } }],
        ['with pagination and sorting', {
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        }],
        ['with filter, pagination and sorting', {
            filter: { dkn: 'са' },
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' }
        }]
    ]],
    ['companies', getCompanies, [
        ['with id', { id: 9351 }],
        ['with ids', { ids: [9351, 9851] }],
        ['with pagination', { pagination: { page: 1, perPage: 2 } }],
        ['with pagination and sorting', {
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        }],
        ['with filter, pagination and sorting', {
            filter: { dkn: 'са' },
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'id', order: 'ASC' }
        }]
    ]],
    ['people', getPersons, [
        ['with id', { id: 9219 }],
        ['with ids', { ids: [9219, 9451] }],
        ['with pagination', { pagination: { page: 1, perPage: 2 } }],
        ['with pagination and sorting', {
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        }],
    ]]
];

describe.only.each(testsParams)('Test %s data retrieval', (_label, dbFunc, testParams) => {

    it.each(testParams)(`should get ${_label} from db %s`, async (_test, params) => {
        const data = dbFunc(params);
        expect(data).toBeDefined();
        const jsonPreview = await streamToString(data);
        const dataPreview = JSON.parse(jsonPreview);
        expect(dataPreview.data).toBeDefined();
        expect(dataPreview.data).not.toBeNull();

        if (Array.isArray(dataPreview.data)) {
            expect(dataPreview.data.length).toBeGreaterThan(0);
        }

        expect(dataPreview).toMatchSnapshot();
    });

});
