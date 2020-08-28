import React, { useEffect, useRef } from 'react';
import MaterialTable, {
  MaterialTableProps,
  Column,
  Components,
  Localization,
  Icons,
  Options,
  MTableEditField,
  MTableBodyRow,
  EditCellColumnDef,
} from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Formik, Field, FormikErrors, FieldAttributes } from 'formik';
import { makeStyles, DialogContentText } from '@material-ui/core';

const useStyles = makeStyles({
  field: {
    padding: 8,
  },
});

interface IData extends Object {
  tableData?: {};
}

interface IFormikWrapperProps<RowData extends IData>
  extends MaterialTableProps<RowData> {
  validate?: (value: RowData) => void | object | Promise<FormikErrors<RowData>>;
  validationSchema?: any | (() => any);
  disabledFn?: (
    columnField: string,
    mode: 'add' | 'update' | 'delete'
  ) => boolean;
  localization?: IWrapperLocalization;
  canceledCallBackFn?: () => any;
  editColumns?: Column<RowData>[];
  setHiddenFlagFn?: (
    fieldName: string,
    fieldValue: string | number | boolean,
    currentHideFlag: number,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void,
    getFieldProps: any
  ) => number;
  setInitialHiddenFlagFn?: (rowValue: RowData | undefined) => number;
  setHiddenConditionFn?: (fieldName: string, hideFlag: number) => boolean;
}

interface IWrapperLocalization extends Localization {
  deleteHeader?: string;
  deleteAction?: string;
}

function FormikWrapper<RowData extends IData>(
  props: IFormikWrapperProps<RowData>
) {
  const {
    localization,
    components,
    validate,
    validationSchema,
    disabledFn,
    canceledCallBackFn,
    editColumns,
    setHiddenFlagFn,
    setInitialHiddenFlagFn,
    setHiddenConditionFn,
  } = props;

  const dialogLocalisation = {
    addTooltip:
      localization && localization.body
        ? localization.body.addTooltip || 'Add Row'
        : 'Add Row',
    editTooltip:
      localization && localization.body
        ? localization.body.editTooltip || 'Edit Row'
        : 'Edit Row',
    deleteHeader: localization
      ? localization.deleteHeader || 'Delete Row'
      : 'Delete Row',
    deleteAction: localization
      ? localization.deleteAction || 'Delete'
      : 'Delete',
  };

  const editField = components?.EditField || MTableEditField;
  return (
    <MaterialTable
      {...props}
      components={{
        ...components,
        EditRow: editProps => (
          <FormikDialog
            {...editProps}
            editField={editField}
            dialogLocalisation={dialogLocalisation}
            validate={validate}
            disabledFn={disabledFn}
            canceledCallBackFn={canceledCallBackFn}
            validationSchema={validationSchema}
            editColumns={editColumns}
            setHiddenFlagFn={setHiddenFlagFn}
            setHiddenConditionFn={setHiddenConditionFn}
            setInitialHiddenFlagFn={setInitialHiddenFlagFn}
          />
        ),
      }}
    />
  );
}

interface IFormikDialogProps<RowData extends IData> {
  children?: JSX.Element;
  validate?: (
    values: RowData
  ) => void | object | Promise<FormikErrors<RowData>>;
  disabledFn?: (
    columnField: string,
    mode: 'add' | 'update' | 'delete'
  ) => boolean;
  canceledCallBackFn?: () => any;
  validationSchema?: any | (() => any);
  dialogLocalisation: {
    addTooltip: string;
    editTooltip: string;
    deleteHeader: string;
    deleteAction: string;
  };
  editField: () => React.ReactElement<any>;
  columns: Column<RowData>[];
  editColumns?: Column<RowData>[];
  setHiddenFlagFn?: (
    fieldname: string,
    fieldvalue: string | number | boolean,
    currentHideFlag: number,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void,
    getFieldProps: any
  ) => number;
  setInitialHiddenFlagFn?: (rowValue: RowData | undefined) => number;
  setHiddenConditionFn?: (fieldName: string, hideFlag: number) => boolean;
  data?: RowData;
  components: Components;
  icons: Icons;
  mode: 'add' | 'update' | 'delete';
  localization: {
    saveTooltip: string;
    cancelTooltip: string;
    deleteText: string;
  };
  options: Options<RowData>;
  isTreeData: boolean;
  detailPanel: undefined;
  onEditingCanceled: (
    mode: 'add' | 'update' | 'delete',
    rowData?: RowData
  ) => Promise<void>;
  onEditingApproved: (
    mode: 'add' | 'update' | 'delete',
    newDate: RowData,
    oldData: RowData | undefined
  ) => Promise<void>;
  getFieldValue: (rowData: RowData, columnDef: unknown) => string | number;
}

function FormikDialog<RowData extends IData>({
  children,
  onEditingCanceled,
  validate,
  disabledFn,
  editColumns,
  setHiddenFlagFn,
  setInitialHiddenFlagFn,
  setHiddenConditionFn,
  canceledCallBackFn,
  onEditingApproved,
  validationSchema,
  mode,
  editField: EditCell,
  dialogLocalisation,
  ...props
}: IFormikDialogProps<RowData>) {
  const { localization, data, columns } = props;

  const classes = useStyles();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const initialValues = React.useMemo(
    () => (data ? { ...data } : ({} as RowData)),
    [data]
  );

  const closeDialog = () => {
    if (canceledCallBackFn) {
      var x = canceledCallBackFn();
      if (x) console.log(x);
    }
    onEditingCanceled(mode, data);
  };

  const onEnter = () => {
    if (setInitialHiddenFlagFn) {
      setHideFlag(setInitialHiddenFlagFn(data));
    }
  };

  const onSubmitForm = () => {
    btnSaveRef.current?.click();
  };

  let title;
  switch (mode) {
    case 'add':
      title = dialogLocalisation.addTooltip;
      break;
    case 'update':
      title = dialogLocalisation.editTooltip;
      break;
    case 'delete':
      title = dialogLocalisation.deleteHeader;
      break;
  }

  const getEditCell = (
    column: Column<RowData>,
    field: any,
    meta: any,
    setValues: (rowData: RowData) => void,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void,
    getFieldProps: any
  ) => {
    const onChange = (newValue: string | number | boolean) =>
      field.onChange({
        target: {
          value: newValue,
          checked: newValue,
          name: field.name,
        },
      });
    const onRowDataChange = (newRowData: Partial<RowData>) => {
      if (data) {
        setValues({
          ...data,
          ...newRowData,
        });
      }
    };
    if (column.editComponent && data) {
      return column.editComponent({
        rowData: data,
        value: field.value,
        onChange,
        onRowDataChange,
        columnDef: column as EditCellColumnDef,
        error: meta.error !== undefined,
      });
    } else {
      const errorProps: {
        helperText?: string;
        error?: boolean;
      } = {};
      if (column.lookup === undefined) {
        errorProps.helperText = meta.error;
        errorProps.error = meta.error !== undefined;
      }
      return (
        <EditCell
          {...field}
          {...errorProps}
          // locale={dateTimePickerLocalization}
          fullWidth={true}
          id={column.field}
          columnDef={column}
          disabled={
            disabledFn ? disabledFn(column.field as string, mode) : false
          }
          onChange={(newValue: string | number | boolean) => {
            wrapFieldChange(field, newValue, setFieldValue, getFieldProps);
          }}
          rowData={data}
        />
      );
    }
  };

  const [hideFlag, setHideFlag] = React.useState(0);

  const wrapFieldChange = (
    field: any,
    newValue: string | number | boolean,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void,
    getFieldProps: any
  ) => {
    if (setHiddenFlagFn) {
      setHideFlag(
        setHiddenFlagFn(
          field.name,
          newValue,
          hideFlag,
          setFieldValue,
          getFieldProps
        )
      );
    }

    field.onChange({
      target: {
        value: newValue,
        checked: newValue,
        name: field.name,
      },
    });
  };

  const btnSaveRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Dialog
        onClose={closeDialog}
        open={true}
        onEnter={onEnter}
        fullWidth={true}
        scroll={'paper'}
      >
        <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            validate={validate}
            onSubmit={async (values, { setSubmitting }) => {
              console.log('called');
              setSubmitting(true);
              delete values.tableData;
              await onEditingApproved(mode, values, data);
              if (mounted && mounted.current) {
                setSubmitting(false);
              }
            }}
          >
            {({
              isSubmitting,
              handleSubmit,
              setValues,
              setFieldValue,
              getFieldProps,
            }) => (
              <>
                <form onSubmit={handleSubmit}>
                  {mode !== 'delete' &&
                    (editColumns ? editColumns : columns).map(
                      column =>
                        (column.editable === undefined ||
                          column.editable === 'always' ||
                          (column.editable === 'onAdd' && mode === 'add') ||
                          (column.editable === 'onUpdate' &&
                            mode === 'update')) &&
                        (setHiddenConditionFn
                          ? setHiddenConditionFn(
                              column.field as string,
                              hideFlag
                            )
                          : true) && (
                          <Field key={column.field} name={column.field}>
                            {({ field, meta }: FieldAttributes<any>) => {
                              return (
                                <div className={classes.field}>
                                  <label htmlFor={column.field as string}>
                                    {column.title}
                                  </label>
                                  <br />
                                  {getEditCell(
                                    column,
                                    field,
                                    meta,
                                    setValues,
                                    setFieldValue,
                                    getFieldProps
                                  )}
                                </div>
                              );
                            }}
                          </Field>
                        )
                    )}
                  {mode === 'delete' && (
                    <DialogContentText>
                      {localization.deleteText}
                    </DialogContentText>
                  )}
                  <div style={{ display: 'none' }}>
                    <Button
                      ref={btnSaveRef}
                      color="primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {mode !== 'delete'
                        ? localization.saveTooltip
                        : dialogLocalisation.deleteAction}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <>
            <Button onClick={closeDialog} color="primary">
              {localization.cancelTooltip}
            </Button>
            <Button
              color="primary"
              autoFocus={true}
              type="submit"
              onClick={onSubmitForm}
            >
              {mode !== 'delete'
                ? localization.saveTooltip
                : dialogLocalisation.deleteAction}
            </Button>
          </>
        </DialogActions>
      </Dialog>
      {data && (
        <MTableBodyRow {...props} onToggleDetailPanel={() => {}}>
          {children}
        </MTableBodyRow>
      )}
    </>
  );
}

export default FormikWrapper;
