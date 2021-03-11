export interface ICars {
    id: number;
    rama: string;
    dkn: string;
    mark_name: string;
    model_name: string;
    produce_year: string;
    client_id?: any;
}

interface ICompanies {
    id: number;
    client_name: string;
    bulstat: string;
    representative: string;
    phone: string;
    mobile: string;
    region_name: string;
    municipality_name: string;
    city: string;
    postcode: string;
    street_name: string;
    street_no: string;
    blok: string;
    vhod: string;
    apartment: string;
    floor: string;
    vehicle_ids: string;
}

interface IPersons {
    id: number;
    client_name: string;
    egn: string;
    representative: string;
    phone: string;
    mobile: string;
    region_name: string;
    municipality_name: string;
    city: string;
    postcode: string;
    street_name: string;
    street_no: string;
    blok: string;
    vhod: string;
    apartment: string;
    floor: string;
    vehicle_ids: string;
}