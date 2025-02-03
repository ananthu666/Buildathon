var employeeData = {
    "columns": [
        { "key": "id", "header": "ID" },
        { "key": "firstName", "header": "First Name" },
        { "key": "lastName", "header": "Last Name" },
        { "key": "email", "header": "Email" },
        { "key": "department", "header": "Department" },
        // { "key": "status", "header": "Current Status" }
    ],
    "status": {
    "Active": "green",
    "On Leave": "red",
    "Inactive": "yellow",
    "Terminated": "danger",
    "Suspended": "warning"
},
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


const addBtn = document.querySelector('[data-action="add"]');
const editBtn = document.querySelector('[data-action="edit"]');
const deleteBtn = document.querySelector('[data-action="delete"]');
const updateBtn = document.querySelector('[data-action="update"]');
const cancelBtn = document.querySelector('[data-action="cancel"]');

function enableActionButtons() {
    updateBtn.disabled = false;
    cancelBtn.disabled = false;
}
 
// Function to disable Update and Cancel buttons
function disableActionButtons() {
    updateBtn.disabled = true;
    cancelBtn.disabled = true;
}
 
// Function to disable Add, Edit, and Delete buttons
function disableMainButtons() {
    addBtn.disabled = true;
    editBtn.disabled = true;
    deleteBtn.disabled = true;
}
 
// Function to enable Add, Edit, and Delete buttons
function enableMainButtons() {
    addBtn.disabled = false;
    editBtn.disabled = false;
    deleteBtn.disabled = false;
}

// Add click event listeners to the buttons
addBtn.addEventListener('click', () => {
    addBtn.disabled = false;
    editBtn.disabled = true;
    deleteBtn.disabled = true;
    enableActionButtons();
    addEmployee();
    
});
 
editBtn.addEventListener('click', () => {
    addBtn.disabled = true;
    editBtn.disabled = false;
    deleteBtn.disabled = true;
    enableActionButtons();

    
});
 
deleteBtn.addEventListener('click', () => {
    addBtn.disabled = true;
    editBtn.disabled = true;
    deleteBtn.disabled = false;
    enableActionButtons();
    deleteSelected();
    
});
 
// Optional: Disable action buttons when Update or Cancel is clicked
updateBtn.addEventListener('click', () => {
    enableMainButtons(); // Enable main buttons when updating
    disableActionButtons();
    // Your update functionality here
});
 
cancelBtn.addEventListener('click', () => {
    enableMainButtons(); // Enable main buttons when canceling
    disableActionButtons();
    // Your cancel functionality here
});
 
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
        
        // icons from b
        const iconContainer = document.createElement('div');
        iconContainer.className = 'icon-container';
        iconContainer.style.position = 'absolute';
        iconContainer.style.top = '50%';
        iconContainer.style.right = '5px';  // Adjust as needed
        iconContainer.style.transform = 'translateY(-50%)';
        iconContainer.style.display = 'flex';
        iconContainer.style.alignItems = 'center';
 
        const sortIcon = document.createElement('i');
        sortIcon.className = 'bi bi-arrow-down';
        sortIcon.style.cursor = 'pointer';
        sortIcon.style.marginLeft = '5px'; // Space between icons
        column.sortDirection = 'asc';
 
        const filterIcon = document.createElement('i');
        filterIcon.className = 'bi bi-funnel';
        filterIcon.style.cursor = 'pointer';
        filterIcon.style.marginLeft = '5px'; // Space between icons
        filterIcon.onclick = (event) => {
            $('#filterModal').modal('show'); // Use jQuery to show the modal
        };
        // document.getElementById('close_modal').onclick = () => {
           
        //     $('#filterModal').modal('hide');
        // };
        // document.getElementById('applyFilter').onclick = () => {
           
        //     $('#filterModal').modal('hide');
        // };
 
        sortIcon.onclick = () => {
            if (column.sortState === 'none' || column.sortState === 'desc') {
                column.sortState = 'asc';
                sortIcon.className = 'bi bi-arrow-up';
            } else {
                column.sortState = 'desc';
                sortIcon.className = 'bi bi-arrow-down';
            }
 
            handleSort(column);
        };
 
        filterIcon.onclick = () => handleFilter(column); // Implement handleFilter
 
        iconContainer.appendChild(sortIcon);
        iconContainer.appendChild(filterIcon);  // Add both icons
 
 
 

         // Append the icon container to the th
         th.appendChild(iconContainer);
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


// function to reload data after sort
function reloaddata(data) {
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
 
}
 
//  function to sort column 

function handleSort(column) {
    const key = column.key;
    const direction = column.sortState;
 
    employeeData.employees.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
 
        let comparisonResult;
        if (typeof aValue === 'string') {
            comparisonResult = aValue.localeCompare(bValue);
        } else {
            comparisonResult = aValue - bValue;
        }
 
        return direction === 'asc' ? comparisonResult : -comparisonResult;
    });
 
    // console.log(employeeData.employees);
    reloaddata(employeeData);
}
 

// Function to edit a cell
function editCell(cellContent, key, employee) {
    if(editBtn.disabled == true )
        return;
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
    if(newValue=="")return;
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
    
    // Add ID cell
    const idCell = document.createElement('th');
    idCell.textContent = employeeId++;
    newRow.appendChild(idCell);
    
    // Add other columns
    employeeData.columns.forEach((column, index) => {
        if (index > 0) { // Skip the first column (ID)
            const cell = document.createElement('td');
            const div = document.createElement('div');
            div.className = 'cell-content';
            div.setAttribute('onclick', `editCell(this, '${column.key}', {})`);
            div.textContent = column.header || ' ';
            cell.appendChild(div);
            newRow.appendChild(cell);
        }
    });
    
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


function deleteSelected() {
    const checkboxes = document.querySelectorAll('.select-row');
    const selectedIds = [];

    
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const row = checkbox.closest('tr');
            const idCell = row.querySelector('th'); // Assuming ID is in the first column
            selectedIds.push(parseInt(idCell.textContent));
        }
    });

    
    employeeData.employees = employeeData.employees.filter(employee => !selectedIds.includes(employee.id));
    
    // Re-render the table
    renderEmployeeTable(employeeData);
}