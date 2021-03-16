import { Admin, AdminProps, DataProvider, Resource } from 'react-admin';
import { myDataProvider } from './dataprovider';
import Cookies from 'js-cookie';
import { CarList, CarShow } from './cars';
import { CompanyShow } from './companies';
import { PersonShow } from './people';
import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        secondary: {
            light: '#6ec6ff',
            main: '#2196f3',
            dark: '#0069c0',
            contrastText: '#fff'
        }
    }
});

const adminProps: AdminProps = {
    dataProvider: myDataProvider(Cookies.get('api_host') ?? 'http://localhost:3001') as DataProvider,
    theme
}

const App = () => (
    <Admin {...adminProps}>
        <Resource name="cars" list={CarList} show={CarShow} /* edit={CarEdit} */ />
        <Resource name="companies" /* list={CompanyList} */ show={CompanyShow} /* edit={CompanyEdit} */ />
        <Resource name="people" /* list={PersonList} */ show={PersonShow} /* edit={PersonEdit} */ />
    </Admin>
);

export default App;
