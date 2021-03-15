import {
    Datagrid, DateField, DateInput, Edit, EditProps, Filter, FilterProps, List, ListProps, ReferenceField,
    ReferenceInput,
    SelectInput,
    Show, ShowProps, SimpleForm, SimpleShowLayout, TextField, TextInput
} from 'react-admin';

const CarFilter = (props: Partial<FilterProps>) => (
    <Filter {...props}>
        <TextInput label="Car number" source="dkn" alwaysOn />
    </Filter>
);

export const CarList = (props: ListProps) => (
    <List {...props} filters={<CarFilter />}>
        <Datagrid rowClick="show" >
            {/* <TextField source="id" /> */}
            <TextField source="rama" />
            <TextField source="dkn" />
            <TextField source="mark_name" />
            <TextField source="model_name" />
            <DateField source="produce_year" />
            <ReferenceField source="company_id" reference="companies" link="show">
                <TextField source="client_name" display='block' noWrap style={{ textOverflow: 'ellipsis', maxWidth: '5cm' }} />
            </ReferenceField>
            <ReferenceField source="person_id" reference="people" link="show">
                <TextField source="client_name" display='block' noWrap style={{ textOverflow: 'ellipsis', maxWidth: '5cm' }} />
            </ReferenceField>
        </Datagrid>
    </List>
);

export const CarShow = (props: ShowProps) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="rama" />
            <TextField source="dkn" />
            <TextField source="mark_name" />
            <TextField source="model_name" />
            <DateField source="produce_year" />
            <ReferenceField source="company_id" reference="companies">
                <TextField source="id" />
            </ReferenceField>
            <ReferenceField source="person_id" reference="people">
                <TextField source="id" />
            </ReferenceField>
        </SimpleShowLayout>
    </Show>
);

export const CarEdit = (props: EditProps) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="rama" />
            <TextInput source="dkn" />
            <TextInput source="mark_name" />
            <TextInput source="model_name" />
            <DateInput source="produce_year" />
            <ReferenceInput source="company_id" reference="companies">
                <SelectInput optionText="id" />
            </ReferenceInput>
            <ReferenceInput source="person_id" reference="people">
                <SelectInput optionText="id" />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);