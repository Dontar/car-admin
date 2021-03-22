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
