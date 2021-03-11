import { getCars, getCompanies, getPersons } from "../data-retrieval";

describe('Test data retrival', () => {

    it('should get cars from db', async () => {
        const rows = await getCars();
        expect(rows.length).toBeGreaterThan(0);
        expect(rows[0]).toMatchSnapshot();
    });

    it('should get companies from db', async () => {
        const rows = await getCompanies();
        expect(rows.length).toBeGreaterThan(0);
        expect(rows[0]).toMatchSnapshot();
    });

    it('should get persons from db', async () => {
        const rows = await getPersons();
        expect(rows.length).toBeGreaterThan(0);
        expect(rows[0]).toMatchSnapshot();
    });
});