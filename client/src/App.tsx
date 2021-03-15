import { Admin, DataProvider, Resource } from 'react-admin';
import { myDataProvider } from './dataprovider';
import Cookies from 'js-cookie';
import { CarEdit, CarList, CarShow } from './cars';
import { CompanyEdit, CompanyList, CompanyShow } from './companies';
import { PersonEdit, PersonList, PersonShow } from './people';

function App() {
  return (
    <Admin dataProvider={myDataProvider(Cookies.get('api_host') ?? 'http://localhost:3001') as DataProvider}>
      <Resource name="cars" list={CarList} show={CarShow} edit={CarEdit} />
      <Resource name="companies" list={CompanyList} show={CompanyShow} edit={CompanyEdit} />
      <Resource name="people" list={PersonList} show={PersonShow} edit={PersonEdit} />
    </Admin>
  );
}

export default App;
