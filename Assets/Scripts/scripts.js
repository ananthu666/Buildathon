const employeeData = {
    "columns": [
        { "key": "id", "header": "#" },
        { "key": "firstName", "header": "First Name" },
        { "key": "lastName", "header": "Last Name" },
        { "key": "email", "header": "Email Address" },
        { "key": "department", "header": "Department" },
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

function renderEmployeeTable(data) {
    const tableHead = document.querySelector('thead');
    const headerRow = document.createElement('tr');
   
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
       
        data.columns.forEach(column => {
            const cell = column.key === 'id' ? document.createElement('th') : document.createElement('td');
            if (column.key === 'id') {
                cell.setAttribute('scope', 'row');
            }
           
            if (column.key === 'status') {
                cell.innerHTML = `<span class="badge ${statusClass}">${employee[column.key]}</span>`;
            } else {
                cell.textContent = employee[column.key];
            }
           
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

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