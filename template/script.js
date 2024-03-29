async function getPrintData() {
  const printData = await printModule.getPrintDetails();
  fillData(printData);
}

function fillData({
  customerName,
  customerAddress,
  gstNo,
  challanNo,
  challanDate,
  poNo,
  poDate,
  customerCode,
  challanItems,
}) {
  document.getElementById('customer-name').innerText = customerName;
  document.getElementById('customer-address').innerText = customerAddress;
  document.getElementById('gst-no').innerText = gstNo;
  document.getElementById('challan-no').innerText = challanNo;
  document.getElementById('challan-date').innerText =
    momentModule.formatDate(challanDate);
  document.getElementById('po-no').innerText = poNo;
  document.getElementById('po-date').innerText =
    momentModule.formatDate(poDate);
  document.getElementById('customer-code').innerText = customerCode;
  let row;
  for (let i = 0; i < 10; i++) {
    if (i < challanItems.length) {
      const { drawingNo, description, quantity } = challanItems[i];
      row = createTableRow(i + 1, drawingNo, description, quantity);
    } else {
      row = createTableRow(i+1, '', '', '');
    }
    document.getElementById('challan-table-body').appendChild(row);
  }
}

function createTableRow(srNo, drawingNo, description, quantity) {
  const row = document.createElement('tr');
  row.appendChild(createTableCell('sr-no', `${srNo}${srNo !== '' ? '.' : ''}`));
  row.appendChild(createTableCell('description', description));
  row.appendChild(createTableCell('item-no', drawingNo));
  row.appendChild(createTableCell('quantity', quantity));
  row.appendChild(createTableCell('value', ''));
  row.appendChild(createTableCell('remark', ''));
  return row;
}

function createTableCell(className, data) {
  const td = document.createElement('td');
  td.classList.add(className);
  td.innerText = data;
  return td;
}

document.addEventListener('DOMContentLoaded', (DOMContentLoadedEvent) => {
  getPrintData();
});
