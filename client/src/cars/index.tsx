import {
    ChipField,
    Datagrid, Filter, FilterProps, List, ListProps, RaThemeOptions, ReferenceField,
    Show, ShowProps, SimpleList, SimpleListProps, SimpleShowLayout, TextField, TextInput
} from 'react-admin';

import { useMediaQuery, withTheme, ThemeProvider, WithTheme, Typography } from '@material-ui/core';
import DirectionsCarOutlinedIcon from '@material-ui/icons/DirectionsCarOutlined';
import FaceIcon from '@material-ui/icons/Face';
import BusinessIcon from '@material-ui/icons/Business';

const CarFilter = (props: Partial<FilterProps>) => (
    <Filter {...props}>
        <TextInput label="Car number" source="dkn" alwaysOn variant="outlined" />
    </Filter>
);

const MobileList = withTheme((props: SimpleListProps & WithTheme) => {
    const theme = {
        ...props.theme,
        props: {
            ...props.theme.props,
            MuiListItem: {
                divider: true
            }
        }
    }
    return (
        <ThemeProvider theme={theme}>
            <SimpleList {...props} />
        </ThemeProvider>
    );
});

export const CarList = (props: ListProps) => {
    const isSmall = useMediaQuery<RaThemeOptions>(theme => (theme.breakpoints!).down!('sm'));
    return (
        <List {...props} filters={<CarFilter />} perPage={isSmall ? 100 : 10}>
            {isSmall ? (
                <MobileList
                    leftAvatar={() => (<DirectionsCarOutlinedIcon />)}
                    linkType="show"
                    primaryText={record => (
                        <Typography color={(record.company_id || record.person_id) ? 'primary' : 'inherit'}>
                            {`${record.dkn || 'NO NUMBER'}`}
                        </Typography>
                    )}
                    // tertiaryText={record => record.rama}
                    // tertiaryText={record => (
                    //     <Typography variant="overline">
                    //         {`${record.mark_name} ${record.model_name} ${record.produce_year}`}
                    //     </Typography>
                    // )}
                    secondaryText={record => `${record.mark_name} ${record.model_name} ${record.produce_year}`}
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
            {/* <TextField source="id" /> */}
            <ReferenceField source="company_id" reference="companies" linkType="show">
                <ChipField source="client_name" icon={<BusinessIcon />} />
            </ReferenceField>
            <ReferenceField source="person_id" reference="people" linkType="show">
                <ChipField source="client_name" icon={<FaceIcon />} />
            </ReferenceField>
            <TextField source="dkn" />
            <TextField source="rama" />
            <TextField source="mark_name" />
            <TextField source="model_name" />
            <TextField source="produce_year" />
        </SimpleShowLayout>
    </Show>
);

// export const CarEdit = (props: EditProps) => (
//     <Edit {...props}>
//         <SimpleForm>
//             <TextInput source="id" />
//             <TextInput source="rama" />
//             <TextInput source="dkn" />
//             <TextInput source="mark_name" />
//             <TextInput source="model_name" />
//             <DateInput source="produce_year" />
//             <ReferenceInput source="company_id" reference="companies">
//                 <SelectInput optionText="id" />
//             </ReferenceInput>
//             <ReferenceInput source="person_id" reference="people">
//                 <SelectInput optionText="id" />
//             </ReferenceInput>
//         </SimpleForm>
//     </Edit>
// );
