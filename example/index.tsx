import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Table from '../.';
import * as Yup from 'yup';
import { Column } from 'material-table';

const AddSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  surname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  birthYear: Yup.number().required('Required'),
});

const localization = {
  body: {
    editRow: {
      saveTooltip: 'Save',
      cancelTooltip: 'Cancel',
      deleteText: 'Are you sure you want to delete this ETL input file?',
    },
  },
};

function disabledFn(columnField: string, mode: string): boolean {
  if (columnField === 'name') return true;
  return false;
}

const App = () => {
  const [data, setData] = React.useState([
    { name: 'Engel', surname: 'Dominik', birthYear: 1994, birthCity: 63 },
  ]);
  return (
    <div>
      <Table
        validationSchema={AddSchema}
        localization={localization}
        disabledFn={disabledFn}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'First Name', field: 'surname', hidden: true },
          {
            title: 'Birth Year',
            field: 'birthYear',
            type: 'numeric',
            editable: 'never',
          },
          {
            title: 'Brith City',
            field: 'birthCity',
            lookup: { 34: 'Aachen', 63: 'Berlin' },
          },
        ]}
        data={data}
        title="Demo Title"
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setData(prevData => [...prevData, newData]);
                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setData(prevData => [
                  ...prevData.filter(x => x !== oldData),
                  newData,
                ]);
                resolve();
              }, 1000);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                setData(prevData => [...prevData.filter(x => x !== oldData)]);
                resolve();
              }, 1000);
            }),
        }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
