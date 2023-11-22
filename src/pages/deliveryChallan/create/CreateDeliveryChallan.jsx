import React, { Fragment, useState, useEffect } from "react";
import useNavigationShortcuts from "../../../hooks/useNavigationShortcuts";
import FormField from "../../../components/ui/inputs/FormField/FormField";
import TextInput from "../../../components/ui/inputs/TextInput/TextInput";
import SuggestionInput from "../../../components/ui/inputs/SuggestionInput/SuggestionInput";
import DateInput from "../../../components/ui/inputs/DateInput/DateInput";

function CreateDeliveryChallan() {
  const [nextChallanNo, setNextChallanNo] = useState("");
  const [poList, setPoList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  
  useEffect(() => {
    getNextChallanNo();
    getPoList();
    getCustomerList();
    setTodaysDate();
  }, []);

  async function getNextChallanNo() {
    const nextChallanNo = await deliveryChallanModule.getNextChallanNo();
    setNextChallanNo(nextChallanNo);
  }

  async function getPoList() {
    const poList = await poMasterModule.getPoList();
    setPoList(poList.map((poItem) => poItem.po_no));
  }

  async function getCustomerList() {
    setCustomerList(
      (await customerMasterModule.getCustomers()).map(
        (customerItem) => customerItem.customer_name
      )
    );
  }

  function setTodaysDate() {
    challanDateRef.ref.current.setValue(new Date());
  }

  const [
    [challanNoRef, poNumberRef, customerNameRef, challanDateRef],
    dispatchNavigationShortcut,
  ] = useNavigationShortcuts({
    fieldList: [
      {
        name: "challanNo",
        focusable: false,
      },
      {
        name: "poNumber",
        focusable: true,
      },
      {
        name: "customerName",
        focusable: true,
      },
      {
        name: "challanDate",
        focusable: true,
      },
    ],
    defaultFocusedFieldName: "poNumber",
  });

  return (
    <Fragment>
      <div className="flex flex-col">
        <div className="flex justify-center gap-10">
          <FormField
            component={TextInput}
            label="Challan No"
            componentProperties={{ value: nextChallanNo, disabled: true }}
            ref={challanNoRef.ref}
          />
          <FormField
            component={SuggestionInput}
            label="PO Number"
            componentProperties={{
              placeholder: "PO Number",
              name: "poNumber",
              suggestions: poList,
              strict: true,
              extendChangeHandler: () => {
                setTimeout(() => {
                  const { value, isValid } = poNumberRef.ref.current;
                  if (isValid) {
                    getPoDetails(value);
                  }
                }, 100);
              },
              extendFillHandler: (value) => {
                getPoDetails(value);
              },
            }}
            ref={poNumberRef.ref}
          />
        </div>
        <div className="flex justify-center gap-10">
          <FormField
            component={TextInput}
            label="Customer Name"
            componentProperties={{
              name: "customerName",
              value: "",
              disabled: true,
            }}
            ref={customerNameRef.ref}
          />
          <FormField
            component={DateInput}
            label="Challan Date"
            componentProperties={{
              name: "challanDate",
              // value: new Date(),
            }}
            ref={challanDateRef.ref}
          />
        </div>
      </div>
      <div className="w-full mx-auto mt-10 border border-black table border-collapse">
        <div className="table-header-group text-center font-bold text-lg">
          <div className="table-row">
            <div className="table-cell py-2 border border-black w-1/12">
              Sr. No.
            </div>
            <div className="table-cell py-2 border border-black w-2/12">
              Drawing No
            </div>
            <div className="table-cell py-2 border border-black w-5/12">
              Description
            </div>
            <div className="table-cell py-2 border border-black w-3/12">
              Quantity
            </div>
            <div className="table-cell py-2 border border-black w-1/12"></div>
          </div>
        </div>
        <div className="table-row-group">
          {tableState.rows.map((tableRow) => {
            // console.log(tableRow);
            return (
              <TableRow
                key={tableRow.index}
                rowData={tableRow}
                lastActionHandler={lastActionHandler}
                setDrawingNo={setDrawingNo}
                setDescription={setDescription}
                setQuantity={setQuantity}
                itemsTable={itemsTable}
                showQuantityLimit={true}
                disableDelete={tableState.lastRowIndex === 0}
                deleteRowHandler={deleteRow}
                focusFirstElement={tableRow.index === tableState.focusedIndex}
              />
            );
          })}
        </div>
      </div>
      <ActionButton
        className="block bg-white text-black border hover:bg-black hover:text-white border-black mt-5"
        onClick={addRow}
      >
        Add Row
      </ActionButton>
      <ActionButton
        className="block mx-auto my-10"
        onClick={createDeliveryChallan}
      >
        Save
      </ActionButton>
    </Fragment>
  );
}

export default CreateDeliveryChallan;
