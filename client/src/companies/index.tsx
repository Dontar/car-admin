import {
    ChipField,
    ReferenceArrayField,
    Show, ShowProps, SimpleShowLayout, SingleFieldList, TextField} from "react-admin";

// export const CompanyList = (props: ListProps) => (
//     <List {...props}>
//         <Datagrid rowClick="edit">
//             {/* <TextField source="id" /> */}
//             <TextField source="client_name" />
//             {/* <TextField source="bulstat" /> */}
//             {/* <TextField source="representative" /> */}
//             {/* <TextField source="phone" /> */}
//             {/* <TextField source="mobile" /> */}
//             {/* <TextField source="region_name" /> */}
//             {/* <TextField source="municipality_name" /> */}
//             <TextField source="city" />
//             {/* <DateField source="postcode" /> */}
//             <TextField source="street_name" />
//             <TextField source="street_no" />
//             {/* <DateField source="blok" /> */}
//             {/* <TextField source="vhod" /> */}
//             {/* <DateField source="apartment" /> */}
//             {/* <DateField source="floor" /> */}
//             <ReferenceArrayField source="car_ids" reference="cars">
//                 <TextField source="dkn" />
//             </ReferenceArrayField>
//         </Datagrid>
//     </List>
// );

export const CompanyShow = (props: ShowProps) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="client_name" />
            <TextField source="bulstat" />
            <TextField source="representative" />
            <TextField source="phone" />
            <TextField source="mobile" />
            <TextField source="region_name" />
            <TextField source="municipality_name" />
            <TextField source="city" />
            <TextField source="postcode" />
            <TextField source="street_name" />
            <TextField source="street_no" />
            <TextField source="blok" />
            <TextField source="vhod" />
            <TextField source="apartment" />
            <TextField source="floor" />
            <ReferenceArrayField source="car_ids" reference="cars">
                <SingleFieldList linkType="show">
                    <ChipField source="dkn" />
                </SingleFieldList>
            </ReferenceArrayField>
        </SimpleShowLayout>
    </Show>
);

// export const CompanyEdit = (props: EditProps) => (
//     <Edit {...props}>
//         <SimpleForm>
//             <TextInput source="id" />
//             <TextInput source="client_name" />
//             <TextInput source="bulstat" />
//             <DateInput source="representative" />
//             <TextInput source="phone" />
//             <TextInput source="mobile" />
//             <TextInput source="region_name" />
//             <TextInput source="municipality_name" />
//             <TextInput source="city" />
//             <DateInput source="postcode" />
//             <TextInput source="street_name" />
//             <DateInput source="street_no" />
//             <DateInput source="blok" />
//             <DateInput source="vhod" />
//             <DateInput source="apartment" />
//             <DateInput source="floor" />
//             <ReferenceArrayInput source="car_ids" reference="cars">
//                 <TextInput source="id" />
//             </ReferenceArrayInput>
//         </SimpleForm>
//     </Edit>
// );
