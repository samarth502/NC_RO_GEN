// Function to show the loader
function showLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; // Show the loader
}

// Function to hide the loader
function hideLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none'; // Hide the loader
}

// File upload event listener with loader integration
document.getElementById('fileUploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        showToast('error', 'Error', 'Please select a file to upload!');
        return;
    }

    // Show the loader before starting the process
    showLoader();

    // Prepare the file for upload
    const formData = new FormData();
    formData.append('file', file);

    // Send request to the server
    fetch('/api/upload/master_data', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to upload file to the server');
            }
        })
        .then(data => {
            // Hide the loader after data is processed
            hideLoader();

            // Show a toast notification based on the server response
            showToast(data.status === 'success' ? 'success' : 'error', data.status, data.message);

            if (data.status === 'success') {
                // Display the masterRates in the table
                displayTable(data.masterRates);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoader(); // Hide the loader on error
            showToast('error', 'Error', 'Error uploading file. Please try again.');
        });
});

// Function to display the master rates in a table
function displayTable(data) {
    const table = document.getElementById('dataTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Clear existing table content
    thead.innerHTML = '';
    tbody.innerHTML = '';

    // Check if data exists
    if (!data || data.length === 0) {
        const noDataMessage = document.createElement('tr');
        noDataMessage.innerHTML = '<td colspan="100%" class="text-center">No data available</td>';
        tbody.appendChild(noDataMessage);
        return;
    }

    const headers = [
        "Newspaper Code",
        "Newspaper Name",
        "Last Renewal Date",
        "State",
        "Place of Publication",
        "Language",
        "Periodicity",
        "Category",
        "Regularity Status",
        "Circulation Base",
        "Circulation",
        "Rate"
    ];

    // Clear any existing headers
    thead.innerHTML = '';

    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);



    // Create table body
    data.forEach(record => {
        const row = document.createElement('tr');

        // Add cells for each property in the record
        const fields = [
            'newspaperCode',
            'newspaperName',
            'lastRenewedDate',
            'state',
            'placeOfPublication',
            'language',
            'periodicity',
            'category',
            'regularityStatus',
            'circulationBase',
            'circulation',
            'rate'
        ];

        fields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = record[field] || ''; // Handle empty or missing fields
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
}

// Function to display a SweetAlert2 toast
function showToast(icon, title, message, position = 'top-end', timer = 10000) {
    Swal.fire({
        icon: icon, // 'success', 'error', 'warning', 'info', or 'question'
        title: title,
        text: message,
        toast: true,
        position: position, // 'top', 'top-end', 'top-start', etc.
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
    });
}




function getDav(){

    const newspaperName2 = document.getElementById("newspaperName").value.trim();
    const state = document.getElementById("stateDropdown").value.trim();
    const edition = document.getElementById("placeOfPublication").value.trim();
    const language = document.getElementById("language").value.trim();

    // Check if any field is empty
    if (!newspaperName2 || !state || !edition || !language) {
        return;
    }

    const newspaperName = decodeHTML(newspaperName2);

    // Build the URL with query parameters
    const url = `/api/getDavRates?newspaperName=${encodeURIComponent(newspaperName)}&state=${encodeURIComponent(state)}&edition=${encodeURIComponent(edition)}&language=${encodeURIComponent(language)}`;

    // Fetch the data from the backend
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Dav Rate fetched:", data);
            // Append the data in the Dav input field
            document.getElementById("dav").value = data.toUpperCase();
        })
        .catch(error => {
            console.error("Error fetching Dav rates:", error);
            alert("An error occurred while fetching Dav rates. Please try again.");
        });

}


document.getElementById("newspaperName").addEventListener("change", getDav);
document.getElementById("stateDropdown").addEventListener("change", getDav);
document.getElementById("placeOfPublication").addEventListener("change", getDav);
document.getElementById("language").addEventListener("change", getDav);


function disabledFields(){
    document.getElementById("clientName").readOnly = true;
    document.getElementById("clientName").disabled = true;

    document.getElementById("pageNumber").readOnly = true;
    document.getElementById("pageNumber").disabled = true;

    document.getElementById("newspaperName").readOnly = true;
    document.getElementById("newspaperName").disabled = true;

    document.getElementById("stateDropdown").readOnly = true;
    document.getElementById("stateDropdown").disabled = true;

    document.getElementById("placeOfPublication").readOnly = true;
    document.getElementById("placeOfPublication").disabled = true;

    document.getElementById("language").readOnly = true;
    document.getElementById("language").disabled = true;

    document.getElementById("dav").readOnly = true;
    document.getElementById("dav").disabled = true;

    document.getElementById("color").readOnly = true;
    document.getElementById("color").disabled = true;

    document.getElementById("dateInput").readOnly = true;
    document.getElementById("dateInput").disabled = true;
}

function addRow() {
    const tableBody = document.getElementById("tableBody");
    const colorDropdown = document.getElementById("color"); // Use the existing dropdown
    const selectedColor = colorDropdown.value; // Get the selected value

    if(colorDropdown.value ===""){
        alert("Please select Color format");
        return ;
    }

    const clientName = document.getElementById("clientName").value.trim();
    const pageNumber = document.getElementById("pageNumber").value.trim();
    const newspaperName = document.getElementById("newspaperName").value.trim();
    const state = document.getElementById("stateDropdown").value.trim();
    const edition = document.getElementById("placeOfPublication").value.trim();
    const language = document.getElementById("language").value.trim();
    const dav = document.getElementById("dav").value.trim();
    const dateInput = document.getElementById("dateInput").value.trim();

    // Check if any field is empty
    if (!clientName || !pageNumber || !newspaperName || !state || !edition || !language || !dav) {
        alert("All fields are required. Please fill in all details.");
        return;
    }

    disabledFields();

    const newRow = document.createElement("tr");

    const createReadOnlyCell = (value, name) => {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.value = value;
        input.name = name; // Set the input name dynamically
        input.readOnly = true;
        cell.appendChild(input);
        return cell;
    };

    const actionBtnCell = document.createElement("td");
    const actionBtn = document.createElement("button");
    actionBtn.className = "btn btn-primary"; // You can use any class for styling the button
    actionBtn.type = "button"; // You can specify "submit" if you want to submit a form
    actionBtn.innerText = "Action";

    actionBtn.addEventListener("click", function () {
        const row = this.closest("tr");
        const cells = row.querySelectorAll("td");
        const rowData = {};

        cells.forEach((cell) => {
            const input = cell.querySelector("input, select, textarea");
            if (input) {
                const key = input.name || input.id || "undefined"; // Use `name` as key, fallback to `id`, or a placeholder
                rowData[key] = input.value; // Store the input value with the key
            } else {
                const textContent = cell.textContent.trim();
                if (textContent) {
                    const key = "column_" + [...cell.parentNode.children].indexOf(cell); // Generate key for plain text cells
                    rowData[key] = textContent;
                }
            }
        });

        console.log("Row Data:", rowData); // Log the row data as key-value pairs
    });

    actionBtnCell.appendChild(actionBtn);


    const roNumberCell = document.createElement("td");
    const roNumberInput = document.createElement("input");
    roNumberInput.type = "number";
    roNumberInput.className = "form-control";
    roNumberInput.placeholder = "Ro Number";
    roNumberInput.name = "roNumber";
    roNumberInput.id = "roNumber";
    roNumberInput.setAttribute("required","required");
    roNumberCell.appendChild(roNumberInput);

    const roDateCell = document.createElement("td");
    const roDateInput = document.createElement("input");
    roDateInput.type = "date";
    roDateInput.className = "form-control";
    roDateInput.placeholder = "roDate";
    roDateInput.name = "roDate";
    roDateInput.id = "roDate";
    roDateInput.setAttribute("required","required");
    roDateCell.appendChild(roDateInput);

    // Create length input
    const lengthCell = document.createElement("td");
    const lengthInput = document.createElement("input");
    lengthInput.type = "number";
    lengthInput.className = "form-control";
    lengthInput.placeholder = "length";
    lengthInput.name = "length";
    lengthInput.id = "length";
    lengthInput.min = "0";
    lengthInput.step = "0.01";
    lengthInput.setAttribute("required","required");
    lengthCell.appendChild(lengthInput);

    // Create length input
    const dopCell = document.createElement("td");
    const dopInput = document.createElement("input");
    dopInput.type = "date";
    dopInput.className = "form-control";
    dopInput.placeholder = "Date";
    dopInput.name = "dateOfPublication";
    dopInput.id = "dateOfPublication";
    dopInput.setAttribute("required","required");
    dopCell.appendChild(dopInput);

    // Create breadth input
    const breadthCell = document.createElement("td");
    const breadthInput = document.createElement("input");
    breadthInput.type = "number";
    breadthInput.className = "form-control";
    breadthInput.placeholder = "breadth";
    breadthInput.name = "breadth";
    breadthInput.id = "breadth";
    breadthInput.min = "0";
    breadthInput.step = "0.01";
    breadthInput.setAttribute("required","required");
    breadthCell.appendChild(breadthInput);


    // Create Total Size cell
    const totalSizeCell = document.createElement("td");
    const totalSizeInput = document.createElement("input");
    totalSizeInput.type = "number";
    totalSizeInput.className = "form-control";
    totalSizeInput.placeholder = "Total Size";
    totalSizeInput.name = "totalSize";
    totalSizeInput.id = "totalSize";
    totalSizeInput.setAttribute("required","required");
    totalSizeInput.readOnly = true; // Make it read-only
    totalSizeCell.appendChild(totalSizeInput);


    const ppNewspaperCell = document.createElement("td");
    const ppNewspaperInput = document.createElement("input");
    ppNewspaperInput.type = "number";
    ppNewspaperInput.className = "form-control";
    ppNewspaperInput.placeholder = "Price to Newspaper";
    ppNewspaperInput.name = "priceToNewsPaper";
    ppNewspaperInput.id = "priceToNewsPaper";
    ppNewspaperInput.setAttribute("required","required");
    ppNewspaperCell.appendChild(ppNewspaperInput);


    // Create and append the amount input field
    const amountCell = document.createElement("td");
    const amountInput = document.createElement("input");
    amountInput.type = "text";
    amountInput.className = "form-control";
    amountInput.placeholder = "Amount";
    amountInput.name = "amount";
    amountInput.id = "amount";
    amountInput.readOnly = true;
    amountCell.appendChild(amountInput);


    // Append GST
    const gstCell = document.createElement("td");
    const gstInput = document.createElement("input");
    gstInput.type = "number";
    gstInput.className = "form-control";
    gstInput.placeholder = "GST";
    gstInput.name = "gst";
    gstInput.id = "gst";
    gstInput.setAttribute("required", "required");
    gstCell.appendChild(gstInput);

// Append Net Payable
    const netPayableCell = document.createElement("td");
    const netPayableInput = document.createElement("input");
    netPayableInput.type = "number";
    netPayableInput.className = "form-control";
    netPayableInput.placeholder = "Net Payable";
    netPayableInput.name = "netPayable";
    netPayableInput.id = "netPayable";
    netPayableInput.setAttribute("required", "required");
    netPayableCell.appendChild(netPayableInput);

// Append Email ID
    const emailCell = document.createElement("td");
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.className = "form-control";
    emailInput.placeholder = "Email ID";
    emailInput.name = "emailId";
    emailInput.id = "emailId";
    emailInput.setAttribute("required", "required");
    emailCell.appendChild(emailInput);

// Append Phone Number
    const phoneCell = document.createElement("td");
    const phoneInput = document.createElement("input");
    phoneInput.type = "tel";
    phoneInput.className = "form-control";
    phoneInput.placeholder = "Phone Number";
    phoneInput.name = "phoneNumber";
    phoneInput.id = "phoneNumber";
    phoneInput.setAttribute("required", "required");
    phoneCell.appendChild(phoneInput);


    // Add event listeners to length and breadth inputs
    const updatetotalSize = () => {

        const davValue = parseFloat(dav) || 0;
        const colorValue = selectedColor === "Color" ? selectedColor || 0 : 0;
        const length = parseFloat(lengthInput.value) || 0;
        const breadth = parseFloat(breadthInput.value) || 0;
        totalSizeInput.value = length * breadth;

        const totalSize = length * breadth;

        const calculatedAmount = selectedColor === "Color"
            ? (davValue + parseFloat(extraInput.value)) * totalSize
            : davValue * totalSize;
        amountInput.value = calculatedAmount.toFixed(2);

        const totalAmountVal = calculatedAmount;

        var lessForNewsPaper = (totalAmountVal * 0.15)

        ppNewspaperInput.value = (totalAmountVal - lessForNewsPaper).toFixed(2);

        const priceToNewspaper = (totalAmountVal - lessForNewsPaper);

        const gstInputVal = (priceToNewspaper * 0.05);

        gstInput.value = parseFloat(gstInputVal).toFixed(2);

        netPayableInput.value =  (parseFloat(priceToNewspaper) + parseFloat(gstInputVal)).toFixed(2);

    };


    // Create Color cell
    const colorCell = document.createElement("td");
    const colorValue = document.createElement("span");
    colorValue.textContent = selectedColor;
    colorValue.name = selectedColor;
    colorCell.appendChild(colorValue);

    newRow.appendChild(actionBtnCell);
    newRow.appendChild(createReadOnlyCell(dateInput, "submissionDate"));
    newRow.appendChild(createReadOnlyCell(clientName, "clientName"));
    newRow.appendChild(createReadOnlyCell(pageNumber, "pageNumber"));
    newRow.appendChild(createReadOnlyCell(newspaperName, "newspaperName"));
    newRow.appendChild(createReadOnlyCell(state, "state"));
    newRow.appendChild(createReadOnlyCell(edition, "edition"));
    newRow.appendChild(createReadOnlyCell(dav, "dav"));



    // If "Color" is selected, add an extra column
    if (selectedColor === "Color") {
        document.getElementById("extraColumnHeader").style.display = 'table-cell';
        const extraCell = document.createElement("td");
        var extraInput = document.createElement("input");
        extraInput.type = "text";
        extraInput.className = "form-control";
        extraInput.placeholder = "40% value";
        extraInput.name = "colorPercentage";
        extraInput.id = "colorPer";

        const davValue = Number(dav);

        const extraValue = (davValue * 0.4).toFixed(2);
        extraInput.value = extraValue; // Set the calculated value
        extraInput.readOnly = true;

        extraCell.appendChild(extraInput);
        newRow.appendChild(extraCell);

    }
    newRow.appendChild(createReadOnlyCell(language, "language"));
    // newRow.appendChild(createReadOnlyCell(language));
    newRow.appendChild(roNumberCell);
    newRow.appendChild(roDateCell);
    newRow.appendChild(dopCell);
    newRow.appendChild(lengthCell);
    newRow.appendChild(breadthCell);
    newRow.appendChild(totalSizeCell);
    newRow.appendChild(amountCell);
    newRow.appendChild(ppNewspaperCell);
    newRow.appendChild(gstCell);
    newRow.appendChild(netPayableCell);
    newRow.appendChild(emailCell);
    newRow.appendChild(phoneCell);

    // Add the new row to the table body
    tableBody.appendChild(newRow);

    lengthInput.addEventListener("input", updatetotalSize);
    breadthInput.addEventListener("input", updatetotalSize);


}

// function to set Date
document.addEventListener("DOMContentLoaded",function (){
    const dateInput = document.getElementById('dateInput');
    const today = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
    dateInput.value = today;
})



function fetchLanguage() {
    const newspaperDropdown = document.getElementById('newspaperName');
    const placeOfPublicationDropdown = document.getElementById('placeOfPublication');
    const languageDropDown = document.getElementById('language');

    const selectedNewspaper = decodeHTML(newspaperDropdown.value); // Decode the selected newspaper name
    const selectedPublicationPlace = placeOfPublicationDropdown.value; // Get the selected place of publication

    // Clear the Language dropdown
    languageDropDown.innerHTML = '<option value="" selected disabled>Select Language</option>';

    // Construct the API URL dynamically
    let url = `/api/language?newspaperName=${encodeURIComponent(selectedNewspaper)}`;
    if (selectedPublicationPlace) {
        url += `&publicationPlace=${encodeURIComponent(selectedPublicationPlace)}`;
    }

    console.log("API URL:", url);

    // Fetch data from the backend
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);

            // Populate the Language dropdown
            data.forEach(language => {
                const option = document.createElement('option');
                option.value = language;
                option.textContent = language;
                languageDropDown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching languages:', error);
        });
}

function fetchPublicationName() {

    debugger;
    const newspaperDropdown = document.getElementById('newspaperName');
    const stateDropdown = document.getElementById('stateDropdown');
    const placeOfPublicationDropdown = document.getElementById('placeOfPublication');

    const selectedNewspaper = decodeHTML(newspaperDropdown.value); // Decode the selected newspaper name
    const selectedState = stateDropdown.value; // Get the selected state

    // Clear the Place of Publication dropdown
    placeOfPublicationDropdown.innerHTML = '<option value="" selected disabled>Select Place Of Publication</option>';

    // Construct the API URL dynamically
    let url = `/api/fetchPublicationName?newspaperName=${encodeURIComponent(selectedNewspaper)}`;
    if (selectedState) {
        url += `&state=${encodeURIComponent(selectedState)}`;
    }

    console.log("API URL:", url);

    // Fetch data from the backend
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Response Data:", data);

            // Populate the Place of Publication dropdown
            data.forEach(publication => {
                const option = document.createElement('option');
                option.value = publication;
                option.textContent = publication;
                placeOfPublicationDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching publications:', error);
        });
}

function fetchStates() {
    const newspaperDropdown = document.getElementById('newspaperName');
    const selectedNewspaper2 = newspaperDropdown.value; // Get the selected newspaper name
    const stateDropdown = document.getElementById('stateDropdown');
    const selectedNewspaper = decodeHTML(selectedNewspaper2); // Decode the newspaper name if needed

    // Clear existing state options
    stateDropdown.innerHTML = '<option value="" selected disabled>Select State</option>';

    console.log("selectedNewspaper:", selectedNewspaper);

    // Remove encodeURIComponent and send the raw value directly
    const url = `/api/getState?newspaperName=${selectedNewspaper}`;

    console.log("url", url);

    // Fetch states from the backend
    fetch(url)
        .then(response => response.json())
        .then(states => {
            console.log("states", states);
            // Populate the state dropdown
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching states:', error);
        });
}

// Decode HTML entities in case the value includes them
function decodeHTML(encodedString) {
    const doc = new DOMParser().parseFromString(encodedString, 'text/html');
    return doc.body.textContent || doc.body.innerText;
}
