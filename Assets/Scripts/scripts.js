const employeeData = {
    "columns": [
        { "key": "id", "header": "OrderID" },
        { "key": "firstName", "header": "Customer Name" },
        { "key": "lastName", "header": "Freidge" },
        { "key": "email", "header": "Shipping Date" },
        { "key": "department", "header": "Shipping Country" },
        { "key": "status", "header": "Current Status" }
    ],
    "employees": [
        {
            "id": 1,
            "firstName": "John",
            "lastName": "Smith",
            "email": "john.smith@email.com",
            "department": "Marketing",
            "status": "Active"
        },
        {
            "id": 2,
            "firstName": "Sarah",
            "lastName": "Johnson",
            "email": "sarah.j@email.com",
            "department": "Development",
            "status": "Active"
        },
        {
            "id": 3,
            "firstName": "Michael",
            "lastName": "Wilson",
            "email": "m.wilson@email.com",
            "department": "Sales",
            "status": "On Leave"
        },
        {
            "id": 4,
            "firstName": "Emily",
            "lastName": "Brown",
            "email": "emily.b@email.com",
            "department": "HR",
            "status": "Active"
        },
        {
            "id": 5,
            "firstName": "David",
            "lastName": "Lee",
            "email": "david.lee@email.com",
            "department": "Development",
            "status": "Inactive"
        }
    ]
};
 
const table = document.getElementById('resizable-table');
const tableContainer = document.querySelector('.table-container');
const resizeIndicator = document.querySelector('.resize-indicator');
 
let isResizing = false;
let currentColumn = null;
let startX, startWidth;
let employeeId = 1;
 
 
 
// Function to render the employee table
function renderEmployeeTable(data) {
    const tableHead = document.querySelector('thead');
    const headerRow = document.createElement('tr');
 
    // Add Select column header
    const selectHeader = document.createElement('th');
    selectHeader.textContent = 'Select';
    headerRow.appendChild(selectHeader);
 
    data.columns.forEach((column, index) => {
        const th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = column.header;
 
        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        resizer.id = `resizer-${index}`;
 
        th.appendChild(resizer);
        headerRow.appendChild(th);
 
        // Add resize event listeners
        resizer.addEventListener('mousedown', initResize);
        resizer.addEventListener('dblclick', handleDoubleClick);
    });
 
    tableHead.innerHTML = '';
    tableHead.appendChild(headerRow);
 
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
 
    data.employees.forEach(employee => {
        const statusClass = {
            'Active': 'bg-success',
            'Inactive': 'bg-danger',
            'On Leave': 'bg-warning text-dark'
        }[employee.status];
 
        const row = document.createElement('tr');
 
        // Add checkbox for selection
        const selectCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'select-row';
        selectCell.appendChild(checkbox);
        row.appendChild(selectCell);
 
        data.columns.forEach(column => {
            const cell = column.key === 'id' ? document.createElement('th') : document.createElement('td');
            if (column.key === 'id') {
                cell.setAttribute('scope', 'row');
            }
 
            // Create editable cell
            const cellContent = document.createElement('div');
            cellContent.textContent = employee[column.key];
            cellContent.className = 'cell-content';
            cellContent.addEventListener('click', () => editCell(cellContent, column.key, employee));
 
            if (column.key === 'status') {
                cell.innerHTML = `<span class="badge ${statusClass}">${employee[column.key]}</span>`;
            } else {
                cell.appendChild(cellContent);
            }
 
            row.appendChild(cell);
        });
 
        tableBody.appendChild(row);
    });
 
    // Update employeeId to the next available ID
    employeeId = data.employees.length > 0 ? Math.max(...data.employees.map(emp => emp.id)) + 1 : 1;
}
 
// Function to edit a cell
function editCell(cellContent, key, employee) {
    const input = document.createElement('input');
    input.type = key === 'status' ? 'text' : 'text'; // You can customize input types based on the key
    input.value = cellContent.textContent;
    cellContent.innerHTML = ''; // Clear the cell content
    cellContent.appendChild(input);
    if(input.value=='')
        input.value=employee[key]
    input.focus();
 
    input.addEventListener('blur', () => saveEdit(cellContent, input.value, key, employee));
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(cellContent, input.value, key, employee);
        }
    });
}
 
// Function to save the edited value
function saveEdit(cellContent, newValue, key, employee) {
    cellContent.innerHTML = newValue; // Update the cell content
    employee[key] = newValue; // Update the employee data
}
 
function addEmployee() {
    const tableBody = document.querySelector('#resizable-table tbody');
    const newRow = document.createElement('tr');
 
    // Add checkbox for selection
    const selectCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'select-row';
    selectCell.appendChild(checkbox);
    newRow.appendChild(selectCell);
 
    // newRow.innerHTML += `
    //     <td>${employeeId++}</td> <!-- Auto-increment ID -->
    //     <td><div class="cell-content" onclick="editCell(this, 'firstName', {})">Customer Name</div></td>
    //     <td><div class="cell-content" onclick="editCell(this, 'lastName', {})">Last Name</div></td>
    //     <td><div class="cell-content" onclick="editCell(this, 'email', {})">Email Address</div></td>
    //     <td><div class="cell-content" onclick="editCell(this, 'department', {})">Department</div></td>
    //     <td><div class="cell-content" onclick="editCell(this, 'status', {})">Current Status</div></td>
    // `;
 
    newRow.innerHTML +=`
        <tr>
           
            <td>${employeeId++}</td>
    `;
 
    employeeData.columns.forEach((column, index) => {
        if (index > 0) { // Skip the first column
            newRow.innerHTML += `
                <td>
                    <div class="cell-content" onclick="editCell(this, ${column.key}, {})">${column.header || ' '}</div>
                </td>
            `;
        }
    });
 
    newRow.innerHTML  += `</tr>`;
 
    tableBody.appendChild(newRow);
}
 
// Initial rendering of the employee table
document.addEventListener('DOMContentLoaded', () => {
    renderEmployeeTable(employeeData);
    autoFitAll();
});
 
 
 
function calculateOptimalWidth(columnIndex) {
    const cells = Array.from(table.querySelectorAll(`tr td:nth-child(${columnIndex + 1})`))
        .concat(Array.from(table.querySelectorAll(`tr th:nth-child(${columnIndex + 1})`)));
   
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    document.body.appendChild(temp);
   
    const maxWidth = cells.reduce((max, cell) => {
        temp.textContent = cell.textContent;
        const width = temp.offsetWidth;
        return Math.max(max, width);
    }, 0);
   
    document.body.removeChild(temp);
    return maxWidth + 40;
}
 
function autoFitColumn(columnIndex) {
    const optimalWidth = calculateOptimalWidth(columnIndex);
    const header = table.querySelector(`th:nth-child(${columnIndex + 1})`);
    header.style.width = `${optimalWidth}px`;
}
 
function autoFitAll() {
    const headers = table.querySelectorAll('th');
    headers.forEach((_, index) => autoFitColumn(index));
}
 
function resetColumns() {
    const headers = table.querySelectorAll('th');
    headers.forEach(header => header.style.width = '');
}
 
function initResize(e) {
    isResizing = true;
    currentColumn = e.target.parentElement;
    startX = e.pageX;
    startWidth = currentColumn.offsetWidth;
   
    // Calculate the initial position relative to the table container
    const tableRect = tableContainer.getBoundingClientRect();
    const initialX = e.pageX - tableRect.left + tableContainer.scrollLeft;
   
    resizeIndicator.style.display = 'block';
    resizeIndicator.style.left = `${initialX}px`;
   
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
   
    // Add resizing class to the table container
    tableContainer.classList.add('resizing');
}
 
function handleResize(e) {
    if (!isResizing) return;
   
    // Calculate the position relative to the table container
    const tableRect = tableContainer.getBoundingClientRect();
    const x = e.pageX - tableRect.left + tableContainer.scrollLeft;
   
    const width = startWidth + (e.pageX - startX);
    if (width >= 50) {
        resizeIndicator.style.left = `${x}px`;
        currentColumn.style.width = `${width}px`;
    }
}
 
function stopResize() {
    if (!isResizing) return;
   
    isResizing = false;
    resizeIndicator.style.display = 'none';
   
    // Remove resizing class from the table container
    tableContainer.classList.remove('resizing');
   
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}
 
function handleDoubleClick(e) {
    const header = e.target.parentElement;
    const columnIndex = Array.from(header.parentElement.children).indexOf(header);
    autoFitColumn(columnIndex);
}
 
document.addEventListener('DOMContentLoaded', () => {
    renderEmployeeTable(employeeData);
    autoFitAll();
});