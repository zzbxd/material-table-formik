import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Table from '../.';
import * as Yup from 'yup';
import { Column } from 'material-table';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker,
  DateTimePicker,
} from '@material-ui/pickers';
import { CsvBuilder } from 'filefy';
import Moment from 'moment';

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
const disabledFn = (columnField: string, mode: string): boolean => {
  // if (columnField === 'name') return true;
  return false;
};

// set hide flag, based on drop down field
// return 0 (no hidden) or any other number
const setHiddenFlagFn = (
  fieldName: string,
  fieldValue: string | number | boolean,
  currentHideFlag: number,
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void,
  getFieldProps: any
) => {
  //let o = getFieldProps('birthYear');
  // console.log(o.value);

  if (fieldName === 'birthCity') {
    if (Number(fieldValue) === 34) {
      setFieldValue('birthYear', 2000, false);
      return 1;
    } else {
      setFieldValue('birthYear', 1994, false);
      return 0;
    }
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

const CustomExportCsv = (columns: any, data) => {
  let fileName = 'Demo';
  let copyData = JSON.parse(JSON.stringify(data));
  let exportData = {};
  let outputColumns: any = [];

  if (copyData) {
    exportData = copyData.map(c => {
      let v: any = [];

      var i;
      for (i = 0; i < columns.length; i++) {
        if (columns[i].hidden !== true) {
          if (columns[i].lookup) {
            v.push(columns[i].lookup[c[columns[i].field]]);
          } else {
            if (columns[i].type === 'date') {
              v.push(Moment(c[columns[i].field]).format('MM/DD/YYYY'));
            } else {
              v.push(c[columns[i].field]);
            }
          }
        }
      }
      return v;
    });
  }

  var i;
  for (i = 0; i < columns.length; i++) {
    if (columns[i].hidden !== true) {
      outputColumns.push(columns[i]);
    }
  }

  const builder = new CsvBuilder(fileName + '.csv');
  builder
    .setDelimeter(',')
    .setColumns(outputColumns.map(columnDef => columnDef.title))
    .addRows(exportData)
    .exportFile();
};

const App = () => {
  const [canceledState, setCanceledState] = React.useState(0);

  function canceledCallBackFn(): any {
    setCanceledState(8);
    alert('canceled State is ' + canceledState);
  }

  const [data, setData] = React.useState([
    {
      name: 'Engel',
      surname: 'Dominik',
      birthYear: '1994-11-01',
      birthCity: 34,
    },
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
            type: 'date',
          },
          {
            title: 'Brith City',
            field: 'birthCity',
            lookup: { 34: 'Aachen', 63: 'Berlin' },
          },
          { title: 'a1', field: 'a1' },
          { title: 'a2', field: 'a2' },
          { title: 'a3', field: 'a3' },
          { title: 'a4', field: 'a4' },
          { title: 'a5', field: 'a5' },
          { title: 'a6', field: 'a6' },
          { title: 'a7', field: 'a7' },
          { title: 'a8', field: 'a8' },
          { title: 'a9', field: 'a9' },
          { title: 'a10', field: 'a10' },
          { title: 'a11', field: 'a11' },
          { title: 'a12', field: 'a12' },
          { title: 'a13', field: 'a13' },
          { title: 'a14', field: 'a14' },
          { title: 'a15', field: 'a15' },
          { title: 'a16', field: 'a16' },
          { title: 'a17', field: 'a17' },
          { title: 'a18', field: 'a18' },
          { title: 'a19', field: 'a19' },
          { title: 'a20', field: 'a20' },
        ]}
        editColumns={[
          { title: 'Name', field: 'name' },
          { title: 'First Name', field: 'surname' },
          {
            title: 'Birth Year',
            field: 'birthYear',
            type: 'date',
            editComponent: props => {
              const [by, setBy] = React.useState(props.rowData.birthYear);
              const onChangeBirthyear = birthYear => {
                setBy(birthYear);
                props.onChange(birthYear);
              };

              return (
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    value={by}
                    format="MM/dd/yyyy"
                    onChange={onChangeBirthyear}
                    fullWidth={true}
                  />
                </MuiPickersUtilsProvider>
              );
            },
          },
          {
            title: 'Brith City',
            field: 'birthCity',
            lookup: { 34: 'Aachen', 63: 'Berlin' },
          },
          { title: 'a1', field: 'a1' },
          { title: 'a2', field: 'a2' },
          { title: 'a3', field: 'a3' },
          { title: 'a4', field: 'a4' },
          { title: 'a5', field: 'a5' },
          { title: 'a6', field: 'a6' },
          { title: 'a7', field: 'a7' },
          { title: 'a8', field: 'a8' },
          { title: 'a9', field: 'a9' },
          { title: 'a10', field: 'a10' },
          { title: 'a11', field: 'a11' },
          { title: 'a12', field: 'a12' },
          { title: 'a13', field: 'a13' },
          { title: 'a14', field: 'a14' },
          { title: 'a15', field: 'a15' },
          { title: 'a16', field: 'a16' },
          { title: 'a17', field: 'a17' },
          { title: 'a18', field: 'a18' },
          { title: 'a19', field: 'a19' },
          { title: 'a20', field: 'a20' },
        ]}
        data={data}
        title="Demo Title"
        options={{
          exportButton: true,
          exportAllData: true,
          exportCsv: CustomExportCsv,
        }}
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
