export interface ICar {
    id: number;
    rama: string;
    dkn: string;
    mark_name: string;
    model_name: string;
    produce_year: string;
    company_id?: number;
    person_id?: number;
}

export interface ICompany {
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
    car_ids: string | number[];
}

export interface IPerson extends Omit<ICompany, 'bulstat'> {
    egn: string;
}

type Identifier = string | number;
interface RecordType {
    id: Identifier;
}

export type GetParams = GetListParams & GetManyParams & GetManyReferenceParams;
export type GetResult<T> = Partial<GetListResult<T> & GetManyResult<T> & GetManyReferenceResult<T>>;

export interface GetListParams {
    pagination: {
        page: number;
        perPage: number;
    };
    sort: {
        field: string;
        order: string;
    };
    filter: Record<string, unknown>;
}

export interface GetListResult<T> {
    data: (RecordType & T)[];
    total: number;
    validUntil?: Date;
}
export interface GetOneParams {
    id: Identifier;
}
export interface GetOneResult<T> {
    data: RecordType & T;
    validUntil?: Date;
}
export interface GetManyParams {
    ids: Identifier[];
}
export interface GetManyResult<T> {
    data: (RecordType & T)[];
    validUntil?: Date;
}
export interface GetManyReferenceParams extends GetListParams{
    target: string;
    id: Identifier;
}
export interface GetManyReferenceResult<T> {
    data: (RecordType & T)[];
    total: number;
    validUntil?: Date;
}
export interface UpdateParams<T = unknown> {
    id: Identifier;
    data: T;
    previousData: RecordType;
}
export interface UpdateResult {
    data: RecordType;
    validUntil?: Date;
}
export interface UpdateManyParams<T = unknown> {
    ids: Identifier[];
    data: T;
}
export interface UpdateManyResult {
    data?: Identifier[];
    validUntil?: Date;
}
export interface CreateParams<T = unknown> {
    data: T;
}
export interface CreateResult {
    data: RecordType;
    validUntil?: Date;
}
export interface DeleteParams {
    id: Identifier;
    previousData: Record;
}
export interface DeleteResult {
    data?: RecordType;
}
export interface DeleteManyParams {
    ids: Identifier[];
}
export interface DeleteManyResult {
    data?: Identifier[];
}
