import {
    ChipField,
    Datagrid, DateField, DateInput, Edit, EditProps, Filter, FilterProps, List, ListProps, RaThemeOptions, ReferenceField,
    ReferenceInput,
    SelectInput,
    Show, ShowProps, SimpleForm, SimpleList, SimpleListProps, SimpleShowLayout, TextField, TextInput
} from 'react-admin';

import { useMediaQuery, withTheme, ThemeProvider, WithTheme, Typography } from '@material-ui/core';

const CarFilter = (props: Partial<FilterProps>) => (
    <Filter {...props}>
        <TextInput label="Car number" source="dkn" alwaysOn variant="outlined" />
    </Filter>
);

const MobileList = withTheme((props: SimpleListProps & WithTheme) => {
    props.theme.props = {
        ...props.theme.props,
        MuiListItem: {
            divider: true
        }
    }
    return (
        <ThemeProvider theme={props.theme}>
            <SimpleList {...props} />
        </ThemeProvider>
    );
});

export const CarList = (props: ListProps) => {
    const isSmall = useMediaQuery<RaThemeOptions>(theme => (theme.breakpoints!).down!('sm'));
    return (
        <List {...props} filters={<CarFilter />}>
            {isSmall ? (
                <MobileList
                    linkType="show"
                    primaryText={record => (
                        <Typography color={(record.company_id || record.person_id) ? 'primary' : 'inherit'}>
                            {`${record.dkn || 'NO NUMBER'}`}
                        </Typography>
                    )}
                    secondaryText={record => record.rama}
                    tertiaryText={record => `${record.mark_name} ${record.model_name} ${record.produce_year}`}
                />
            ) : (
                <Datagrid rowClick="show" >
                    {/* <TextField source="id" /> */}
                    <TextField source="rama" />
                    <TextField source="dkn" />
                    <TextField source="mark_name" />
                    <TextField source="model_name" />
                    <TextField source="produce_year" align="right" />
                    <ReferenceField source="company_id" reference="companies" link="show">
                        <TextField source="client_name" display='block' noWrap style={{ textOverflow: 'ellipsis', maxWidth: '5cm' }} />
                    </ReferenceField>
                    <ReferenceField source="person_id" reference="people" link="show">
                        <TextField source="client_name" display='block' noWrap style={{ textOverflow: 'ellipsis', maxWidth: '5cm' }} />
                    </ReferenceField>
                </Datagrid>
            )}
        </List>
    );
}

export const CarShow = (props: ShowProps) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="rama" />
            <TextField source="dkn" />
            <TextField source="mark_name" />
            <TextField source="model_name" />
            <DateField source="produce_year" />
            <ReferenceField source="company_id" reference="companies" linkType="show">
                <ChipField source="client_name" />
            </ReferenceField>
            <ReferenceField source="person_id" reference="people" linkType="show">
                <ChipField source="client_name" />
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
