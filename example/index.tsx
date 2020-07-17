import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Table from '../.';
import * as Yup from 'yup';
import { Column } from 'material-table';

const AddSchema = Yup.object().shape({
  /*  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'), */
  surname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  //birthYear: Yup.number().required('Required'),
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

// make columnField disabled
// Add rowValue control
const disabledFn = (
  columnField: string,
  mode: string,
  rowValue: any | undefined
): boolean => {
  // if (columnField === 'name') return true;
  return false;
};

// set hide flag, based on drop down field
// return 0 (no hidden) or any other number
const setHiddenFlagFn = (
  fieldName: string,
  fieldValue: string | number | boolean,
  currentHideFlag: number
) => {
  if (fieldName === 'birthCity') {
    if (Number(fieldValue) === 34) {
      return 1;
    } else return 0;
  } else {
    return currentHideFlag;
  }
};

// initial set hide flag
// rowValue: current row value
// pay attention to : Number(xxxx)
// return 0 (no hidden) or any other number
const setInitialHiddenFlagFn = (rowValue: any | undefined) => {
  if (rowValue) {
    if (rowValue.birthCity) {
      if (Number(rowValue.birthCity) === 34) {
        return 1;
      }
    }
  }
  return 0;
};

// control how to use hideflag to show column
// return boolean
// True means show, false means hide
const setHiddenConditionFn = (fieldName: string, hideFlag: number) => {
  if (fieldName !== 'surname' || hideFlag === 0) {
    return true;
  } else {
    return false;
  }
};

const App = () => {
  const [canceledState, setCanceledState] = React.useState(0);

  function canceledCallBackFn(): any {
    setCanceledState(8);
    alert('canceled State is ' + canceledState);
  }

  const [data, setData] = React.useState([
    { name: 'Engel', surname: 'Dominik', birthYear: 1994, birthCity: 34 },
  ]);
  return (
    <div>
      <Table
        validationSchema={AddSchema}
        localization={localization}
        disabledFn={disabledFn}
        // canceledCallBackFn={canceledCallBackFn}
        setHiddenFlagFn={setHiddenFlagFn}
        setHiddenConditionFn={setHiddenConditionFn}
        setInitialHiddenFlagFn={setInitialHiddenFlagFn}
        columns={[
          { title: 'Name', field: 'name' },
          { title: 'First Name', field: 'surname', hidden: true },
          {
            title: 'Birth Year',
            field: 'birthYear',
            type: 'numeric',
          },
          {
            title: 'Brith City',
            field: 'birthCity',
            lookup: { 34: 'Aachen', 63: 'Berlin' },
          },
        ]}
        editColumns={[
          { title: 'Name', field: 'name' },
          { title: 'First Name', field: 'surname' },
          {
            title: 'Birth Year',
            field: 'birthYear',
            type: 'numeric',
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

/*
                                    if (
                                      field.name === 'birthCity' &&
                                      newValue === '34'
                                    ) {
                                      setHideFlag(1);
                                    } else {
                                      setHideFlag(0);
                                    }

*/

/*
                      ((column.field as string) !== 'name' ||
                        hideFlag === 0) && (
*/
