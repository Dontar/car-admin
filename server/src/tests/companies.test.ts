import { config } from 'dotenv';
import { getCompanies } from "../companies/companies";
config();

describe('Test companies data retrieval', () => {

    it('should get a company from db', async () => {
        const data = await getCompanies({
            id: 9351
        });
        expect(data).toBeDefined();
        expect(data).toMatchSnapshot();
    });

    it('should get 2 companies from db', async () => {
        const data = await getCompanies({
            ids: [9351, 9851]
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get companies from db with pagination', async () => {
        const data = await getCompanies({
            pagination: { page: 1, perPage: 2 }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get companies from db with sorting', async () => {
        const data = await getCompanies({
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });
});
