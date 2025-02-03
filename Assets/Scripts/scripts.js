// var employeeData = {
//     "columns": [
//         { "key": "id", "header": "ID" },
//         { "key": "firstName", "header": "First Name" },
//         { "key": "lastName", "header": "Last Name" },
//         { "key": "email", "header": "Email" },
//         { "key": "department", "header": "Department" },
//         // { "key": "status", "header": "Current Status" }
//     ],
//     "status": {
//     "Active": "green",
//     "On Leave": "red",
//     "Inactive": "yellow",
//     "Terminated": "danger",
//     "Suspended": "warning"
// },
//     "bodyel": [
//         {
//             "id": 1,
//             "firstName": "John",
//             "lastName": "Smith",
//             "email": "john.smith@email.com",
//             "department": "Marketing",
//             "status": "Active"
//         },
//         {
//             "id": 2,
//             "firstName": "Sarah",
//             "lastName": "Johnson",
//             "email": "sarah.j@email.com",
//             "department": "Development",
//             "status": "Active"
//         },
//         {
//             "id": 3,
//             "firstName": "Michael",
//             "lastName": "Wilson",
//             "email": "m.wilson@email.com",
//             "department": "Sales",
//             "status": "On Leave"
//         },
//         {
//             "id": 4,
//             "firstName": "Emily",
//             "lastName": "Brown",
//             "email": "emily.b@email.com",
//             "department": "HR",
//             "status": "Active"
//         },
//         {
//             "id": 5,
//             "firstName": "David",
//             "lastName": "Lee",
//             "email": "david.lee@email.com",
//             "department": "Development",
//             "status": "Inactive"
//         }
//     ]
// };
 

var employeeData = {
    "columns": [
        { "key": "id", "header": "ID" },
        { "key": "firstName", "header": "First Name" },
        { "key": "lastName", "header": "Last Name" },
        { "key": "email", "header": "Email" },
        // { "key": "major", "header": "Major" },
        { "key": "year", "header": "Year" },
       
        { "key": "gpa", "header": "GPA" },
        // { "key": "status", "header": "Current Status" }
    ],
    "status": {
        "Active": "green",
        "Graduated": "blue",
        "On Leave": "red",
        "Inactive": "yellow"
    },
    "bodyel": [
        {
            "id": 1,
            "firstName": "Alice",
            "lastName": "Johnson",
            "email": "alice.johnson@email.com",
            "major": "Computer Science",
            "year": "Sophomore",
            "gpa": 3.8,
            "status": "Active"
        },
        {
            "id": 2,
            "firstName": "Bob",
            "lastName": "Smith",
            "email": "bob.smith@email.com",
            "major": "Mathematics",
            "year": "Freshman",
            "gpa": 3.5,
            "status": "Active"
        },
        {
            "id": 3,
            "firstName": "Charlie",
            "lastName": "Davis",
            "email": "charlie.davis@email.com",
            "major": "Biology",
            "year": "Junior",
            "gpa": 2.9,
            "status": "On Leave"
        },
        {
            "id": 4,
            "firstName": "Diana",
            "lastName": "Williams",
            "email": "diana.williams@email.com",
            "major": "Chemistry",
            "year": "Senior",
            "gpa": 3.9,
            "status": "Graduated"
        },
        {
            "id": 5,
            "firstName": "Ethan",
            "lastName": "Taylor",
            "email": "ethan.taylor@email.com",
            "major": "Physics",
            "year": "Senior",
            "gpa": 2.7,
            "status": "Inactive"
        },
        {
            "id": 6,
            "firstName": "Fay",
            "lastName": "Martinez",
            "email": "fay.martinez@email.com",
            "major": "Engineering",
            "year": "Freshman",
            "gpa": 3.2,
            "status": "Active"
        },
        {
            "id": 7,
            "firstName": "George",
            "lastName": "Brown",
            "email": "george.brown@email.com",
            "major": "Psychology",
            "year": "Sophomore",
            "gpa": 3.6,
            "status": "Active"
        },
        {
            "id": 8,
            "firstName": "Hannah",
            "lastName": "Garcia",
            "email": "hannah.garcia@email.com",
            "major": "English Literature",
            "year": "Junior",
            "gpa": 3.1,
            "status": "On Leave"
        },
        {
            "id": 9,
            "firstName": "Isaac",
            "lastName": "Lopez",
            "email": "isaac.lopez@email.com",
            "major": "History",
            "year": "Senior",
            "gpa": 2.8,
            "status": "Graduated"
        },
        {
            "id": 10,
            "firstName": "Jack",
            "lastName": "Martinez",
            "email": "jack.martinez@email.com",
            "major": "Sociology",
            "year": "Senior",
            "gpa": 3.4,
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
function renderEmployeeTable(data,status1="status") {
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
        th.style.position = 'relative'; // Ensure icons are positioned relative to th
        th.style.paddingRight = '90px';
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

        document.getElementById('applyFilter').addEventListener('click', () => {
            const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
            filterModal.hide();
            // Add any filter application logic here
            const currentColumn = window.currentFilterColumn; // Store the current column globally when opening filter modal

            // Collect selected checkboxes
            const selectedValues = Array.from(document.querySelectorAll('.item-checkbox:checked'))
                .map(checkbox => checkbox.value);

            // If values are selected, filter and group
            if (selectedValues.length > 0) {
                const filteredEmployees = employeeData.bodyel.filter(employee =>
                    selectedValues.includes(String(employee[currentColumn.key]))
                );

                reloaddata_filtered(filteredEmployees);
            } else {
                // If no values selected, reload full data
                renderEmployeeTable(employeeData);
            }
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
 
    data.bodyel.forEach(employee => {
        // const statusClass = {
        //     'Active': 'bg-success',
        //     'Inactive': 'bg-danger',
        //     'On Leave': 'bg-warning text-dark'
        // }[status];

    //     "status": {
    //     "Active": "green",
    //     "Graduated": "blue",
    //     "On Leave": "red",
    //     "Inactive": "yellow"
    // },



 
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
 
            if (column.key === status) {
                cell.innerHTML = `<span class="badge" style="background-color:${employeeData.status[employeeData.bodyel[index][column.key]]}">${employeeData.bodyel[index][column.key]}</span>`;
                alert(employeeData.status[employeeData.bodyel[index][column.key]]);
            } else {
                cell.appendChild(cellContent);
            }
 
            row.appendChild(cell);
        });
 
        tableBody.appendChild(row);
    });
 
    // Update employeeId to the next available ID
    employeeId = data.bodyel.length > 0 ? Math.max(...data.bodyel.map(emp => emp.id)) + 1 : 1;
}

function handleFilter(column) {
    window.currentFilterColumn = column;
    function getColumnData(columnKey) {
        return [...new Set(employeeData.bodyel.map(emp => emp[columnKey]))]; // Ensure unique values
    }

    const columnKey = column.key;
    const columnData = getColumnData(columnKey);
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = "";
    


    const sortDiv = document.createElement("div");
    sortDiv.classList.add("d-flex", "flex-column", "mb-2");
    const ascendingBtn = document.createElement("button");
    ascendingBtn.classList.add("btn", "btn-sm");
    ascendingBtn.id = "sortAtoZ";
    ascendingBtn.innerHTML = `
    <i class="bi bi-arrow-up"></i> A to Z
    `;

    const descendingBtn = document.createElement("button");
    descendingBtn.classList.add("btn", "btn-sm");
    descendingBtn.id = "sortZtoA";
    descendingBtn.innerHTML = `
    <i class="bi bi-arrow-down"></i> Z to A
    `;

    sortDiv.appendChild(ascendingBtn);
    sortDiv.appendChild(descendingBtn);
    modalBody.appendChild(sortDiv);

    ascendingBtn.addEventListener('click', () => {
        sortAtoZ(column);
        reloaddata_filtered(employeeData.bodyel);
        filterModal.hide();
    });

    descendingBtn.addEventListener('click', () => {
        sortZtoA(column);
        reloaddata_filtered(employeeData.bodyel);
        filterModal.hide();
    });

    const deselectAllDiv = document.createElement("div");
    deselectAllDiv.classList.add("form-check");

    deselectAllDiv.innerHTML = `
        <button class="btn " id="deselectAllButton">Clear Filter</button>
    `;

    modalBody.appendChild(deselectAllDiv);
    const deselectAllButton = document.getElementById("deselectAllButton");
    deselectAllButton.addEventListener("click", function() {
        const checkboxes = modalBody.querySelectorAll('.form-check-input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Uncheck all checkboxes
        });
        selectAllCheckbox.checked = false; // Also deselect the "Select All" checkbox
    });

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
    const columnIndex = Array.from(document.querySelectorAll('th')).findIndex(th => th.textContent === column.header);
    const columnWidth = document.querySelector(`th:nth-child(${columnIndex + 1})`).offsetWidth;

    // Set the width of the modal dialog
    const modal = document.querySelector('.modal-dialog');
    // modal.style.width = `${columnWidth}px`;
}

// function to reload data after sort
function reloaddata(data) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';
 
    data.bodyel.forEach(employee => {
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

function reloaddata_filtered(employees) {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '';

    if (employees && Array.isArray(employees)) {
        employees.forEach(employee => {
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

            employeeData.columns.forEach(column => {
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
}
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function group_keys(column) {
    const grouped_by_name = groupBy(employeeData.bodyel, employee => employee[column.key]);
    // console.log(grouped_by_name);
    return grouped_by_name.keys();
}

function sortAtoZ(column) {
    const key = column.key;
    employeeData.bodyel.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        return aValue.localeCompare(bValue);
    });
}

function sortZtoA(column) {
    const key = column.key;
    employeeData.bodyel.sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
        return bValue.localeCompare(aValue);
    });
}
function handleSort(column) {
    const key = column.key;
    const direction = column.sortState;
 
    employeeData.bodyel.sort((a, b) => {
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
    // append to main data
   
    
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
    checkbox.checked = true; // Set the checkbox to be checked by default
    
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
    renderEmployeeTable(employeeData,status="Current status");
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
    
    // Check if any checkboxes are checked
    const checkedBoxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    
    if (checkedBoxes.length === 0) {
        // alert('No rows selected for deletion');
        return;
    }
    toggleButtons('delete');
    const selectedIds = checkedBoxes.map(checkbox => {
        const row = checkbox.closest('tr');
        const idCell = row.querySelector('th'); // Assumes ID is in the first column
        return parseInt(idCell.textContent);
    });

    // Filter out employees with selected IDs
    employeeData.bodyel = employeeData.bodyel.filter(
        employee => !selectedIds.includes(employee.id)
    );
    
    // Re-render the table
    renderEmployeeTable(employeeData);
    
    // Reset button states
    toggleButtons('delete');
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
    deleteSelected();
    toggleButtons('cancel');
});