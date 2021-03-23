-- clients definition

CREATE TABLE clients (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    client_type         INTEGER,
    client_name         TEXT,
    egn                 TEXT,
    representative      TEXT,
    phone               TEXT,
    mobile              TEXT,
    driving_practice    INTEGER,
    region_name         TEXT,
    minucipality_name   TEXT,
    city                TEXT,
    postcode            INTEGER,
    street_name         TEXT,
    street_no           TEXT,
    blok                TEXT,
    vhod                TEXT,
    apartment           INTEGER,
    floor               INTEGER
);

CREATE INDEX clients_1_idx ON clients (client_name ASC);
CREATE INDEX clients_2_idx ON clients (egn ASC);
CREATE INDEX clients_3_idx ON clients (phone ASC);
CREATE INDEX clients_4_idx ON clients (mobile ASC);


-- colours definition

CREATE TABLE colours (
    id              INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name            TEXT,
    gf_colour_code  INTEGER
);

CREATE INDEX colours_name_idx ON colours (name ASC);


-- coupe definition

CREATE TABLE coupe (
    id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name  TEXT
);

CREATE INDEX coupe_name_idx ON coupe (name ASC);


-- fuel definition

CREATE TABLE fuel (
    id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name  TEXT
);

CREATE INDEX fuel_name_idx ON fuel (name ASC);


-- vehicle_hp definition

CREATE TABLE vehicle_hp (
    id    INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name  TEXT
);

CREATE INDEX vehicle_hp_name_idx ON vehicle_hp (name ASC);


-- vehicle_mark definition

CREATE TABLE vehicle_mark (
    ID  INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name  TEXT
);

CREATE INDEX vehicle_mark_name_idx ON vehicle_mark (name ASC);


-- vehicle_model definition

CREATE TABLE vehicle_model (
    id          INTEGER  PRIMARY KEY AUTOINCREMENT NOT NULL,
    name        TEXT,
    mark_id     INTEGER,
    model_order INTEGER,
    FOREIGN KEY (mark_id) REFERENCES vehicle_mark (id)
);

CREATE INDEX vehicle_model_name_idx ON vehicle_model (name ASC);


-- vehicles definition

CREATE TABLE vehicles (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    rama                    TEXT,
    dkn                     TEXT,
    mark_id                 INTEGER,
    model_id                INTEGER,
    engine_size             INTEGER,
    vehicle_hp              INTEGER,
    hp                      INTEGER,
    colour_id               INTEGER,
    produce_year            INTEGER,
    fuel_id                 INTEGER,
    coupe_id                INTEGER,
    alarm                   INTEGER,
    vehicle_load            INTEGER,
    doors                   INTEGER,
    engine_no               TEXT,
    seats                   INTEGER,
    first_registration_date TEXT,
    FOREIGN KEY (mark_id) REFERENCES vehicle_mark (id),
    FOREIGN KEY (model_id) REFERENCES vehicle_model (id),
    FOREIGN KEY (vehicle_hp) REFERENCES vehicle_hp (id),
    FOREIGN KEY (colour_id) REFERENCES colours (id),
    FOREIGN KEY (fuel_id) REFERENCES fuel (id),
    FOREIGN KEY (coupe_id) REFERENCES coupe (id)
);

CREATE INDEX vehicles_1_idx ON vehicles (rama);
CREATE INDEX vehicles_2_idx ON vehicles (dkn ASC);
CREATE INDEX vehicles_3_idx ON vehicles (model_id ASC);


-- vc definition

CREATE TABLE vc (
    client_id   INTEGER,
    vehicle_id  INTEGER,
    FOREIGN KEY (client_id) REFERENCES clients (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

CREATE INDEX vc_client_1_idx ON vc (client_id ASC);
CREATE INDEX vc_client_2_idx ON vc (vehicle_id ASC);

-- cars source

CREATE VIEW cars AS
SELECT
    v.id as id,
    upper(v.rama) as rama,
    v.dkn as dkn,
    vm.name as mark_name,
    vmd.name as model_name,
    v.produce_year as produce_year,
    max(vc.client_id) as company_id,
    max(vc.client_id) as person_id
from
    vehicles v
join vehicle_mark vm on
    (vm.id = v.mark_id)
join vehicle_model vmd on
    (vmd.id = v.model_id)
left join vc on
    (vc.vehicle_id = v.id)
group by
    v.id;


-- companies source

CREATE VIEW companies AS
select
    c.id as id,
    c.client_name as client_name,
    c.egn as bulstat,
    c.representative as representative,
    c.phone as phone,
    c.mobile as mobile,
    c.region_name as region_name,
    c.minucipality_name as municipality_name,
    c.city as city,
    c.postcode as postcode,
    c.street_name as street_name,
    c.street_no as street_no,
    c.blok as blok,
    c.vhod as vhod,
    c.apartment as apartment,
    c.floor as "floor",
    json_group_array(vc.vehicle_id) as car_ids
from
    clients c
left join vc on	(vc.client_id = c.id)
where (c.client_type = 2)
group by c.id;


-- people source

CREATE VIEW people AS
select
    c.id as id,
    c.client_name as client_name,
    c.egn as egn,
    c.representative as representative,
    c.phone as phone,
    c.mobile as mobile,
    c.region_name as region_name,
    c.minucipality_name as municipality_name,
    c.city as city,
    c.postcode as postcode,
    c.street_name as street_name,
    c.street_no as street_no,
    c.blok as blok,
    c.vhod as vhod,
    c.apartment as apartment,
    c.floor as "floor",
    json_group_array(vc.vehicle_id) as car_ids
from
    clients c
left join vc on	(vc.client_id = c.id)
where (c.client_type = 1)
group by c.id;
