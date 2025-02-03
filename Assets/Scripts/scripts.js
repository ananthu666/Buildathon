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
        filterIcon.onclick = () => handleFilter(column);
        

        document.getElementById('close_modal').addEventListener('click', () => {
            const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
            filterModal.hide();
        });
        
        document.getElementById('applyFilter').addEventListener('click', () => {
            const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
            filterModal.hide();
            // Add any filter application logic here
        });
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
 
        // filterIcon.onclick = () => handleFilter(column); // Implement handleFilter
 
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

function handleFilter(column) {
    function getColumnData(columnKey) {
        return [...new Set(employeeData.employees.map(emp => emp[columnKey]))]; // Ensure unique values
    }

    const columnKey = column.key;
    const columnData = getColumnData(columnKey);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = "";

    const selectAllDiv = document.createElement("div");
    selectAllDiv.classList.add("form-check");

    selectAllDiv.innerHTML = `
        <input class="form-check-input" type="checkbox" id="selectAllCheckbox">
        <label class="form-check-label fw-bold" for="selectAllCheckbox">Select All</label>
        <hr>
    `;

    modalBody.appendChild(selectAllDiv);

    columnData.forEach(item => {
        if (item === null || item === undefined) return; // Skip invalid values

        const safeItem = String(item); // Convert to string
        // const safeId = `checkbox_${safeItem.replace(/\s+/g, "_")}`; // Safe ID

        const d = document.createElement("div");
        d.classList.add("form-check");

        d.innerHTML = `
            <input class="form-check-input item-checkbox" type="checkbox" id="${safeItem}" value="${safeItem}">
            <label class="form-check-label" for="${safeItem}">${safeItem}</label>
        `;

        modalBody.appendChild(d);
    });

    // Show modal
    const filterModal = new bootstrap.Modal(document.getElementById("filterModal"));
    filterModal.show();

    // "Select All" functionality
    document.getElementById("selectAllCheckbox").addEventListener("change", function () {
        document.querySelectorAll(".item-checkbox").forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
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
    // if the edit button not enabled dot edit
    if (!document.getElementById('editButton').disabled) {
       return;
    }
    const input = document.createElement('input');
    input.type = 'text'; // Customize input type as needed
    input.value = cellContent.textContent.trim();
    cellContent.innerHTML = ''; // Clear the cell content
    cellContent.appendChild(input);
    input.focus();
    editedCells.push({ cellContent, input, key, employee }); // Track the edited cell

    // Listen for "Enter" key to save changes
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit(cellContent, input.value, key, employee);
        }
    });
}
 
// Function to save the edited value
function saveEdit(cellContent, newValue, key, employee) {
    if (newValue.trim() === "") return; // Do not save empty values
    cellContent.innerHTML = newValue; // Update the cell content
    employee[key] = newValue; // Update the employee data
    toggleButtons('update');
}
 
function updateButtonState() {
    const updateButton = document.getElementById('updateButton');
    if (editedCells.length > 0) {
        updateButton.disabled = false; // Enable "Update" button if any cells are edited
    } else {
        updateButton.disabled = true; // Disable it if no cells are edited
    }
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
function toggleButtons(action) {
    const addButton = document.getElementById('addButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');
    const updateButton = document.getElementById('updateButton');
    const cancelButton = document.getElementById('cancelButton');

    switch (action) {
        case 'add':
            addButton.disabled = true;
            editButton.disabled = true;
            deleteButton.disabled = true;
            updateButton.disabled = false;
            cancelButton.disabled = false;
            break;
        case 'edit':
            addButton.disabled = true;
            editButton.disabled = true;
            deleteButton.disabled = true;
            updateButton.disabled = false;
            cancelButton.disabled = false;
            break;
        case 'delete':
            addButton.disabled = true;
            editButton.disabled = true;
            deleteButton.disabled = true;
            updateButton.disabled = false;
            cancelButton.disabled = false;
            break;
        case 'cancel':
            addButton.disabled = false;
            editButton.disabled = false;
            deleteButton.disabled = false;
            updateButton.disabled = true;
            cancelButton.disabled = true;
            break;
        case 'update':
            addButton.disabled = false;
            editButton.disabled = false;
            deleteButton.disabled = false;
            updateButton.disabled = true;
            cancelButton.disabled = true;
            break;
    }
}

let editedCells = [];

document.getElementById('addButton').addEventListener('click', function () {
    addEmployee();
    
    
    toggleButtons('add'); // Disable Add, Edit, Delete and enable Update, Cancel
});

document.getElementById('updateButton').addEventListener('click', () => {
    editedCells.forEach(({ cellContent, input, key, employee }) => {
        const newValue = input.value;
        saveEdit(cellContent, newValue, key, employee);
    });

    editedCells = []; // Clear the edited cells after update
    updateButtonState(); // Disable the "Update" button
    // toggleButtons('update');
});


document.getElementById('deleteButton').addEventListener('click', () => {
    deleteSelected();
    toggleButtons('delete');
}
);

document.getElementById('editButton').addEventListener('click', () => {
    toggleButtons('edit');
});


document.getElementById('cancelButton').addEventListener('click', () => {
    editedCells.forEach(({ cellContent, input }) => {
        // if input value is empty user prevous value
        if (input.value.trim() === "") {
            cellContent.innerHTML = cellContent.textContent;
        } else {
            cellContent.innerHTML = input.value;
        }
    });

    editedCells = []; // Clear the edited cells
    updateButtonState(); // Disable the "Update" button
    toggleButtons('cancel');
});