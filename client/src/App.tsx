import { Admin, DataProvider, ListGuesser, Resource } from 'react-admin';
import { dataProvider } from './dataprovider';

function App() {
  return (
    <Admin dataProvider={dataProvider as DataProvider}>
      <Resource name="cars" list={ListGuesser} />
      <Resource name="companies" list={ListGuesser} />
      <Resource name="persons" list={ListGuesser} />
    </Admin>
  );
}

export default App;
