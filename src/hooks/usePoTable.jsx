import { useReducer } from 'react';

function usePoTable(itemsTable) {
  function addRow(index) {
    dispatchTableState({ type: 'ADD_ROW' });
  }

  function lastActionHandler(index) {
    dispatchTableState({ type: 'LAST_ACTION', payload: index });
  }

  function setDrawingNo(index, drawingNo) {
    dispatchTableState({
      type: 'SET_DRAWING_NO',
      payload: { index, drawingNo },
    });
  }

  function setDescription(index, description) {
    dispatchTableState({
      type: 'SET_DESCRIPTION',
      payload: { index, description },
    });
  }

  function setQuantity(index, quantity) {
    dispatchTableState({
      type: 'SET_QUANTITY',
      payload: { index, quantity },
    });
  }

  function deleteRow(index) {
    dispatchTableState({ type: 'DELETE_ROW', payload: index });
  }

  function setFocusedRow(index) {
    // console.log({ focusedIndex: index });
    dispatchTableState({ type: 'SET_FOCUSED_ROW', payload: index });
  }

  function resetTable() {
    dispatchTableState({ type: 'RESET' });
  }

  const [tableState, dispatchTableState] = useReducer(
    (state, { type, payload }) => {
      let index, drawingNo, description, newRowState, newRowData, quantity;
      switch (type) {
        case 'ADD_ROW':
          return {
            focusedIndex: state.lastRowIndex + 1,
            lastRowIndex: state.lastRowIndex + 1,
            rows: [
              ...state.rows,
              {
                index: state.rows.length,
                drawingNo: '',
                description: '',
                quantity: '',
              },
            ],
          };
        case 'LAST_ACTION':
          if (payload === state.rows.length - 1) {
            return {
              focusedIndex: state.lastRowIndex + 1,
              lastRowIndex: state.lastRowIndex + 1,
              rows: [
                ...state.rows,
                {
                  index: state.rows.length,
                  drawingNo: '',
                  description: '',
                  quantity: '',
                },
              ],
            };
          } else if (payload < state.rows.length - 1) {
            return { ...state, focusedIndex: payload + 1 };
          }
        case 'SET_FOCUSED_ROW':
          if (payload < state.rows.length) {
            return { ...state, focusedIndex: payload };
          }
          return { ...state };
        case 'SET_DRAWING_NO':
          ({ index, drawingNo } = payload);
          if (
            index >= state.rows.length ||
            drawingNo === state.rows[index].drawingNo
          ) {
            return state;
          }
          newRowState = [...state.rows];
          description = itemsTable.drawingNoMapping[drawingNo] || null;
          newRowData = {
            ...state.rows[index],
            drawingNo: description ? drawingNo : '',
            description: description ? description : '',
          };
          newRowState[index] = newRowData;
          return { ...state, rows: newRowState };
        case 'SET_DESCRIPTION':
          ({ index, description } = payload);
          if (
            index >= state.rows.length ||
            description === state.rows[index].description
          ) {
            return state;
          }
          newRowState = [...state.rows];
          drawingNo = itemsTable.descriptionMapping[description] || null;
          newRowData = {
            ...state.rows[index],
            description: drawingNo ? description : '',
            drawingNo: drawingNo ? drawingNo : '',
          };
          newRowState[index] = newRowData;
          return { ...state, rows: newRowState };
        case 'SET_QUANTITY':
          ({ index, quantity } = payload);
          newRowState = [...state.rows];
          newRowData = {
            ...state.rows[index],
            quantity,
          };
          newRowState[index] = newRowData;
          return { ...state, rows: newRowState };
        case 'SET_ROWS':
          return {
            focusedIndex: -1,
            lastRowIndex: payload.length - 1,
            rows: payload,
          };
        case 'DELETE_ROW':
          newRowState = [];
          for (let i = 0; i < state.rows.length; i++) {
            if (i < payload) {
              newRowState.push(state.rows[i]);
            } else if (i > payload) {
              newRowState.push({
                ...state.rows[i],
                index: state.rows[i].index - 1,
              });
            } else {
              continue;
            }
          }
          return {
            ...state,
            lastRowIndex: state.lastRowIndex - 1,
            rows: newRowState,
          };
        case 'RESET':
          return {
            focusedIndex: -1,
            lastRowIndex: 0,
            rows: [
              {
                index: 0,
                drawingNo: '',
                description: '',
                quantity: '',
              },
            ],
          };
        default:
          return state;
      }
    },
    {
      focusedIndex: -1,
      lastRowIndex: 0,
      rows: [
        {
          index: 0,
          drawingNo: '',
          description: '',
          quantity: '',
        },
      ],
    }
  );

  // return [tableState, [addRow, lastActionHandler], dispatchTableState]
  return {
    tableState,
    addRow,
    lastActionHandler,
    setDrawingNo,
    setDescription,
    setQuantity,
    deleteRow,
    setFocusedRow,
    resetTable,
    dispatchTableState,
  };
}

export default usePoTable;
