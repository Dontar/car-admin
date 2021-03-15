import { Admin, DataProvider, Resource } from 'react-admin';
import { myDataProvider } from './dataprovider';
import Cookies from 'js-cookie';
import { CarList, CarShow } from './cars';
import { CompanyShow } from './companies';
import { PersonShow } from './people';

function App() {
  return (
    <Admin dataProvider={myDataProvider(Cookies.get('api_host') ?? 'http://localhost:3001') as DataProvider}>
      <Resource name="cars" list={CarList} show={CarShow} /* edit={CarEdit} */ intent="registration" />
      <Resource name="companies" /* list={CompanyList} */ show={CompanyShow} /* edit={CompanyEdit} */ />
      <Resource name="people" /* list={PersonList} */ show={PersonShow} /* edit={PersonEdit} */ />
    </Admin>
  );
}

export default App;
