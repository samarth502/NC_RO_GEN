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
    const edition = document.getElementById("placeOfPublication").value.trim();
    const language = document.getElementById("language").value.trim();
    const periodicity = document.getElementById("periodicity").value.trim();
    const category = document.getElementById("category").value.trim();
    var url;
    const newspaperName = decodeHTML(newspaperName2);

    // Check if any field is empty
    if (!newspaperName2 || !edition || !language) {
        return;
    }
    url = `/api/getDavRates?newspaperName=${encodeURIComponent(newspaperName)}&edition=${encodeURIComponent(edition)}&language=${encodeURIComponent(language)}`;

    if(periodicity){
        var cat = category;
        if(cat === null || cat === ''){
            fetchCategory();
            return;
        }
        url = `/api/getDavRates?newspaperName=${encodeURIComponent(newspaperName)}&edition=${encodeURIComponent(edition)}&language=${encodeURIComponent(language)}&periodicity=${encodeURIComponent(periodicity)}&category=${encodeURIComponent(category)}`;
    }



    // Build the URL with query parameters


    // Fetch the data from the backend
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            //console.log("Dav Rate fetched:", data);
            // Append the data in the Dav input field
            document.getElementById("dav").value = data.toUpperCase();
        })
        .catch(error => {

            alert("As per Provided Data, There are More Than One DAVP Rates Applicable, To Further Narrow Down DAVP Rates, Please Select the Periodicity & Category Highlighted in Form");

            document.getElementById("periodicityDropDown").style.display="block";
            document.getElementById("categoryDropDown").style.display="block";


            console.error("Error fetching Dav rates:", error);

        });

}


document.getElementById("newspaperName").addEventListener("change", getDav);
document.getElementById("stateDropdown").addEventListener("change", getDav);
document.getElementById("placeOfPublication").addEventListener("change", getDav);
document.getElementById("language").addEventListener("change", getDav);
document.getElementById("periodicity").addEventListener("change", getDav);
document.getElementById("category").addEventListener("change", getDav);


// fucntion to disable data
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


async function submitRoData(rowData) {
    rowData.color = document.getElementById("color").value.trim();
    rowData.gstType = document.getElementById("gstType").value.trim();
    rowData.pageNumber = document.getElementById("pageNumber").value.trim();


    const roNumber = document.getElementById("roNumber").value.trim();
    const submissionDate = document.getElementById("dateInput").value.trim();
    const clientName = document.getElementById("clientName").value.trim();
    const newspaperName = document.getElementById("newspaperName").value.trim();
    const state = document.getElementById("stateDropdown").value.trim();
    const edition = document.getElementById("placeOfPublication").value.trim();
    const dav = document.getElementById("dav").value.trim();
    const language = document.getElementById("language").value.trim();

    // Check if any value is null or empty
    if (!roNumber || !submissionDate || !clientName || !newspaperName || !state || !edition || !dav || !language) {
        alert("Please fill all the required fields.");
        return;
    }

    rowData.roNumber = roNumber;
    rowData.submissionDate = submissionDate;
    rowData.clientName = clientName;
    rowData.newspaperName = newspaperName;
    rowData.state = state;
    rowData.edition = edition;
    rowData.dav = dav;
    rowData.language = language;

    //console.log("RO Data ", rowData);

    const apiUrl = "/api/submitRoData";

    try {
        // Use await to handle the fetch request asynchronously
        const response = await fetch(apiUrl, {
            method: "POST", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Set the request header
            },
            body: JSON.stringify(rowData), // Convert the rowData object to JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Wait for the response text (assuming it's plain text)
        const message = await response.text();
        //console.log("Received Message:", message);

        // Return appropriate message
        if (message === "Successfully") {
            showToast('success', 'Successfully', 'RO Data Saved Successfully', 'top-end', 10000);
            return message;
        } else if (message === "Failed") {
            showToast('error', 'Failed', 'Failed To send Data', 'top-end', 10000);
            return message;
        } else {
            showToast('error', 'Failed', 'Something went wrong, Contact Admin', 'top-end', 10000);
            return message;
        }
    } catch (error) {
        console.error("Error while submitting data:", error);
        showToast('error', 'Error', 'Failed to submit data. Check console for details.', 'top-end', 10000);
        return "Error"; // Explicitly return "Error" to handle failure cases
    }
}

function addRow() {
    const tableBody = document.getElementById("tableBody");
    const roNumber = document.getElementById("roNumber").value.trim();
    const colorDropdown = document.getElementById("color"); // Use the existing dropdown
    const selectedColor = colorDropdown.value; // Get the selected value

    // // pattern to check ro number
    const pattern = /^[A-Za-z0-9]+\/[A-Za-z0-9]+\/[A-Za-z0-9-]+\/[0-9]{4}\/([0-9]+)$/;
    const match = roNumber.match(pattern);

    if (!match) {
        alert("Generated RO number is Wrong please check the RO number")
        return ;
    }

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



    const newRow = document.createElement("tr");

    const createReadOnlyCell = (value, name) => {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control uppercase";
        input.value = value;
        input.name = name; // Set the input name dynamically
        input.readOnly = true;
        cell.appendChild(input);
        return cell;
    };

    const actionBtnCell = document.createElement("td");
    const actionBtn = document.createElement("button");
    actionBtn.className = "btn btn-secondary"; // You can use any class for styling the button
    actionBtn.type = "button"; // You can specify "submit" if you want to submit a form
    actionBtn.innerText = "Submit";

    actionBtn.addEventListener("click", async  function () {
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

        try {



            const message = await submitRoData(rowData); // Await the async operation

            //console.log("Successfully Successfully",message);
            if (message === "Successfully") {
                cells.forEach((cell) => {
                    const input = cell.querySelector("input, select, textarea");
                    if (input) {
                        input.disabled = true; // Disable the input element
                    }
                });
                this.className="btn btn-success"
                this.disabled = true; // Disable the button
                this.textContent = "Data Submitted"; // Update button text
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }
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
    emailInput.setAttribute("required", "true");
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
    // newRow.appendChild(createReadOnlyCell(dateInput, "submissionDate"));
    // newRow.appendChild(createReadOnlyCell(clientName, "clientName"));
    // newRow.appendChild(createReadOnlyCell(pageNumber, "pageNumber"));
    // newRow.appendChild(createReadOnlyCell(newspaperName, "newspaperName"));
    // newRow.appendChild(createReadOnlyCell(state, "state"));
    // newRow.appendChild(createReadOnlyCell(edition, "edition"));
    // newRow.appendChild(createReadOnlyCell(dav, "dav"));



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
    // newRow.appendChild(createReadOnlyCell(language, "language"));
    // newRow.appendChild(createReadOnlyCell(language));
    // newRow.appendChild(roNumberCell);
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

function fetchCategory(){
    const newspaperDropdown = document.getElementById('newspaperName');
    const selectedNewspaper = decodeHTML(newspaperDropdown.value);

    var periodicity = document.getElementById("periodicity").value.trim();
    var url;

    url = `/api/fetchCategory?newspaperName=${encodeURIComponent(selectedNewspaper)}`;

    if(periodicity){
        url =`/api/fetchCategory?newspaperName=${encodeURIComponent(selectedNewspaper)}&periodicity=${encodeURIComponent(periodicity)}`;
    }

    fetch(url)
        .then(response => response.json())  // Assuming the response is in JSON format
        .then(categoryData => {
            const categoryListdropDown = document.getElementById('category');
            categoryListdropDown.innerHTML='';
            // Clear the existing options (if any)
            categoryListdropDown.innerHTML = '<option value="" selected disabled>Select Category</option>';

            //console.log("category ",categoryData);
            // Append the fetched periodicity data as options
            categoryData.forEach(item => {
                const option = document.createElement('option');
                option.value = item;  // Assuming each item has a 'value' property
                option.textContent = item;  // Assuming each item has a 'label' property
                categoryListdropDown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching Category data:', error);
        });

}

function fetchPeriodicity(){
    const newspaperDropdown = document.getElementById('newspaperName');
    const selectedNewspaper = decodeHTML(newspaperDropdown.value);

    let url = `/api/fetchPeriodicity?newspaperName=${encodeURIComponent(selectedNewspaper)}`;

    // Fetch the periodicity data from the API
    fetch(url)
        .then(response => response.json())  // Assuming the response is in JSON format
        .then(periodicityData => {
            const periodicityDropdown = document.getElementById('periodicity');
            periodicityDropdown.innerHTML='';
            // Clear the existing options (if any)
            periodicityDropdown.innerHTML = '<option value="" selected disabled>Select Periodicity</option>';

            //console.log("periodicityData ",periodicityData);
            // Append the fetched periodicity data as options
            periodicityData.forEach(item => {
                const option = document.createElement('option');
                option.value = item;  // Assuming each item has a 'value' property
                option.textContent = item;  // Assuming each item has a 'label' property
                periodicityDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching periodicity data:', error);
        });
}

function fetchLanguage() {
    const newspaperDropdown = document.getElementById('newspaperName');
    const placeOfPublicationDropdown = document.getElementById('placeOfPublication');
    const languageDropDown = document.getElementById('language');

    //  making Ro number Blank
    document.getElementById('roNumber').value = '';
    document.getElementById('depName').value = '';

    const selectedNewspaper = decodeHTML(newspaperDropdown.value); // Decode the selected newspaper name
    const selectedPublicationPlace = placeOfPublicationDropdown.value; // Get the selected place of publication

    // Clear the Language dropdown
    languageDropDown.innerHTML = '<option value="" selected disabled>Select Language</option>';

    // Construct the API URL dynamically
    let url = `/api/language?newspaperName=${encodeURIComponent(selectedNewspaper)}`;
    if (selectedPublicationPlace) {
        url += `&publicationPlace=${encodeURIComponent(selectedPublicationPlace)}`;
    }
    document.getElementById("dav").value='';
    //console.log("API URL:", url);

    // Fetch data from the backend
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log("Response Data:", data);

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

    document.getElementById("dav").value='';

    //console.log("API URL:", url);

    // Fetch data from the backend
    fetch(url)
        .then(response => response.json())
        .then(data => {
            //console.log("Response Data:", data);

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

    document.getElementById("periodicityDropDown").style.display="none";
    document.getElementById("categoryDropDown").style.display="none";


    // Remove encodeURIComponent and send the raw value directly
    const url = `/api/getState?newspaperName=${selectedNewspaper}`;

    document.getElementById("dav").value='';

    // Fetch states from the backend
    fetch(url)
        .then(response => response.json())
        .then(states => {
            //console.log("states", states);
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

//print function
function printPage() {
    // window.print(); // Triggers the browser's print dialog

    var printContent = document.getElementById("RoContainer");
    var originalContent = document.body.innerHTML;

    // Hide all elements except the container to print
    document.body.innerHTML = printContent.outerHTML;

    window.print();


    document.body.innerHTML = originalContent;
}


async function fetchRoDates() {
    const submissionDate = document.getElementById("SubmissionDate").value.trim();
    const clientName = document.getElementById("clientNameForGenerateRO").value.trim();

    if (submissionDate === null || submissionDate === '') {
        alert("Please Select Submission Date");
        return;
    }

    try {
        // Make the API call with submissionDate and clientName as path variables
        const response = await fetch(`/api/getRoDates/${submissionDate}/${clientName}`);

        if (!response.ok) {
            throw new Error(`Error fetching RO Dates: ${response.statusText}`);
        }

        // Assuming the response is a JSON array of dates in the format ["2023-01-01", "2023-01-02", ...]
        const roDates = await response.json();

        // Get the RO date dropdown element
        const roDateDropdown = document.getElementById("roDateForGenrateRo");

        // Clear the previous options (if any)
        roDateDropdown.innerHTML = '<option value="" selected disabled>Select RO Date</option>';

        // Check if any RO Dates are returned
        if (roDates.length > 0) {
            // Append each RO Date as an option to the dropdown
            roDates.forEach((date) => {
                const option = document.createElement("option");
                option.value = date; // The value of the option is the date
                option.textContent = date; // The displayed text of the option is also the date
                roDateDropdown.appendChild(option); // Add the option to the dropdown
            });
        } else {
            alert("No RO Dates found for the selected submission date and client.");
        }

    } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to fetch RO Dates. Please try again.");
    }
}


//generate RO Page JS
document.getElementById("SubmissionDate").addEventListener("change", callSubmissionDate);
document.getElementById("clientNameForGenerateRO").addEventListener("change",fetchRoDates);
document.getElementById("roDateForGenrateRo").addEventListener("change",getNewspaperListForGenerateRo);
document.getElementById("newspaperNameForGenRo").addEventListener("change",getPublicationDate);

document.getElementById("clientID").addEventListener("change",generateRoNumber);
document.getElementById("depName").addEventListener("change",generateRoNumber);
document.getElementById("dateInput").addEventListener("change",generateRoNumber);
document.getElementById("clientName").addEventListener("change",generateRoNumber);
document.getElementById("clientName").addEventListener("change",fetchClientIDs);

document.getElementById("newspaperName").addEventListener("change",fetchRoNumberData);
document.getElementById("dateInput").addEventListener("change",fetchRoNumberData);


// call All client name using submission date

async function callSubmissionDate(){
    var submissionDate = document.getElementById("SubmissionDate").value.trim();

    if (!submissionDate) {
        console.log("Submission date is empty");
        return;
    }

    try {
        // Make the API call with the submission date as a path variable
        const response = await fetch(`/api/getClientNameForSubmissionDate/${submissionDate}`);

        if (!response.ok) {
            throw new Error(`Error fetching client names: ${response.statusText}`);
        }

        const clientNames = await response.json(); // Assuming API returns a JSON array of names

        // Get the client dropdown element
        const clientDropdown = document.getElementById("clientNameForGenerateRO");

        const roDateDropdown = document.getElementById("roDateForGenrateRo");

        roDateDropdown.innerHTML = '<option value="" selected disabled>Select RO Date</option>';

        clientDropdown.innerHTML = `
            <option value="" selected disabled>Select the client Name</option>
        `; // Clear previous options and add the default option

        // Append the client names to the dropdown
        clientNames.forEach((name) => {
            const option = document.createElement("option");
            option.value = name; // Adjust based on your API response structure
            option.textContent = name;
            clientDropdown.appendChild(option); // Add the option to the dropdown
        });

    } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to fetch client name. Please try again.");
    }

}

// get Newspaper name by submission date
async function getNewspaperListForGenerateRo(){


    const submissionDate = document.getElementById("SubmissionDate").value.trim();
    const clientName = document.getElementById("clientNameForGenerateRO").value.trim();
    const roDateForGenrateRo = document.getElementById("roDateForGenrateRo").value.trim();

    // Validation: Ensure all required fields are selected
    if (submissionDate === '' || clientName === '' || roDateForGenrateRo === '') {
        alert("Please select Submission Date, Client Name, and RO Date");
        return;
    }

    //console.log("submissionDate:", submissionDate);
    //console.log("clientName:", clientName);
    //console.log("roDateForGenrateRo:", roDateForGenrateRo);

    try {
        // Make the API call with submissionDate, clientName, and roDate as path variables
        const response = await fetch(`/api/getNewspaperName/${submissionDate}/${clientName}/${roDateForGenrateRo}`);

        if (!response.ok) {
            throw new Error(`Error fetching Newspaper Names: ${response.statusText}`);
        }

        // Assuming the API returns a JSON array of newspaper names
        const newspaperNames = await response.json();
        //console.log("Newspaper Names:", newspaperNames);

        // Get the Newspaper Name dropdown element
        const newspaperDropdown = document.getElementById("newspaperNameForGenRo");

        // Clear previous options
        newspaperDropdown.innerHTML = '<option value="" selected disabled>Select Newspaper Name</option>';

        // Check if any Newspaper Names are returned
        if (newspaperNames.length > 0) {
            // Append each Newspaper Name as an option to the dropdown
            newspaperNames.forEach((name) => {
                const option = document.createElement("option");
                option.value = name; // The value of the option is the newspaper name
                option.textContent = name; // The displayed text of the option is also the newspaper name
                newspaperDropdown.appendChild(option); // Add the option to the dropdown
            });
        } else {
            alert("No Newspaper Names found for the selected criteria.");
        }

    } catch (error) {
        console.error("Error:", error.message);
        alert("Failed to fetch Newspaper Names. Please try again.");
    }


}

async function getPublicationDate() {
    const submissionDate = document.getElementById("SubmissionDate").value.trim();
    const clientName = document.getElementById("clientNameForGenerateRO").value.trim();
    const roDateForGenrateRo = document.getElementById("roDateForGenrateRo").value.trim();
    const newspaperNameForGenRo = document.getElementById("newspaperNameForGenRo").value.trim();

    if (!submissionDate || !clientName || !roDateForGenrateRo || !newspaperNameForGenRo) {
        alert("Please fill all fields to fetch publication dates.");
        return;
    }

    const url = `/api/getPublishCationDate/${submissionDate}/${clientName}/${roDateForGenrateRo}/${newspaperNameForGenRo}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching publication dates: ${response.statusText}`);
        }

        const publicationDates = await response.json(); // Assuming the response is a JSON array of dates
        const dropdown = document.getElementById("publishcationDate");

        // Clear existing options
        dropdown.innerHTML = '';

        dropdown.innerHTML = '<option value="" selected disabled>Select Publish Date</option>';

        // Append new options dynamically
        publicationDates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching publication date:", error);
        alert("Failed to fetch publication dates. Please try again later.");
    }
}



<!--js For View Master-->
document.addEventListener("DOMContentLoaded",fetchDataofClient);

async function fetchDataofClient() {
    const url = "/api/getClientFullData";

    try {
        // Fetch data from the API
        const response = await fetch(url);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Reference to the table body
        const tableBody = document.querySelector("#clientData tbody");

        // Clear existing rows
        tableBody.innerHTML = "";
        //console.log("Client data",data);
        // Append rows dynamically
        data.forEach(client => {

            const row = document.createElement("tr");

            row.innerHTML = `
                        <td>${client.client_name}</td>
                        <td>${client.client_short_form}</td>  
                         <td><button class="btn btn-danger" onclick="deleteClient(${client.id})">Delete</button></td>
                    `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching client data:", error);
    }
}

// Js For Delete Client
function deleteClient(id) {

    // Show a confirmation dialog before proceeding
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this action!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If the user confirms, make the API call to delete the client
            fetch(`/api/deleteClientById/${id}`, {
                method: 'GET', // Adjusting to your backend's method
            })
                .then(response => {
                    if (response.ok) {
                        // Show success message
                        Swal.fire(
                            'Deleted!',
                            'The client has been deleted.',
                            'success'
                        ).then(() => {
                            // Reload the page or refresh the table
                            location.reload();
                        });
                    } else {
                        // Handle error response
                        Swal.fire(
                            'Error!',
                            'Failed to delete the client. Please try again.',
                            'error'
                        );
                    }
                })
                .catch(error => {
                    console.error("Error occurred while deleting the client:", error);
                    Swal.fire(
                        'Error!',
                        'An error occurred. Please check the console for details.',
                        'error'
                    );
                });
        }
    });
}


// Function to load data into the table when the "View Master" tab is clicked
document.getElementById('viewMasterTab').addEventListener('click', function () {
    fetchNewspaperData(); // Fetch data when the tab is clicked
});

// Function to fetch data from backend and populate the table
function fetchNewspaperData() {
    // Show the loader and hide the table
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('tableContainer').style.display = 'none';

    // Perform AJAX request to fetch the data from the backend
    fetch('/api/newspapersMaster')
        .then(response => response.json())  // Assuming the response is a JSON array
        .then(data => {
            //console.log(data);  // Log the response to check its structure
            let tableBody = document.getElementById('viewTable');
            tableBody.innerHTML = ''; // Clear the table body before adding new rows

            // Check if 'data' is an array
            if (Array.isArray(data)) {
                // Loop through the fetched data and append rows to the table
                data.forEach(newspaper => {
                    let row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${newspaper.newspaperCode}</td>
                        <td>${newspaper.newspaperName}</td>
                        <td>${newspaper.lastRenewedDate}</td>
                        <td>${newspaper.state}</td>
                        <td>${newspaper.placeOfPublication}</td>
                        <td>${newspaper.language}</td>
                        <td>${newspaper.periodicity}</td>
                        <td>${newspaper.category}</td>
                        <td>${newspaper.regularityStatus}</td>
                        <td>${newspaper.circulationBase}</td>
                        <td>${newspaper.circulation}</td>
                        <td>${newspaper.rate}</td>
                    `;
                    tableBody.appendChild(row);
                });

                // Destroy the previous DataTable instance (if exists)
                if ($.fn.dataTable.isDataTable('#newspapersTable')) {
                    $('#newspapersTable').DataTable().destroy();
                }

                // Reinitialize DataTable with paging disabled
                $('#newspapersTable').DataTable({
                    "paging": false,
                    "searching": true,
                    "info": true
                });

                // Hide the loader and show the table
                document.getElementById('loader').style.display = 'none';
                document.getElementById('tableContainer').style.display = 'block';
            } else {
                console.error("Received data is not an array:", data);
                document.getElementById('loader').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching newspaper data:', error);
            document.getElementById('loader').style.display = 'none';
        });
}


<!--js For Preview RO -->
// Function to load data into the table when the "View Master" tab is clicked
document.getElementById('previewRoTab').addEventListener('click', function () {
    fetchRoPreviewData(); // Fetch data when the tab is clicked
});

function fetchRoPreviewData() {
    // Show the loader and hide the table
    document.getElementById('loader').style.display = 'flex';
    document.getElementById('previewRoContainer').style.display = 'none';

    // Perform AJAX request to fetch the data from the backend
    fetch('/api/fetchRoData')
        .then(response => response.json()) // Assuming the response is a JSON array
        .then(data => {
            console.log(data); // Log the response to check its structure
            let tableBody = document.getElementById('previewRoTbody');
            tableBody.innerHTML = ''; // Clear the table body before adding new rows

            if (Array.isArray(data)) {
                let previousKey = null; // To track the combined key of the previous row
                let mergeRowStartIndex = null; // To track the starting row for merging
                let mergeCount = 0; // To track the number of rows to merge

                data.forEach((roData, index) => {
                    let currentKey = `${roData.submissionDate || ''}|${roData.newspaperName || ''}|${roData.clientName || ''}|${roData.roDate || ''}|${roData.roNumber || ''}|${roData.dateOfPublication || ''}|${roData.dateOfPublication || ''}`;

                    let row = document.createElement('tr');

                    // Create a button cell separately for easier merging
                    let buttonCell = document.createElement('td');
                    buttonCell.innerHTML = `<button class="btn btn-primary" onclick="navigateToForm(${roData.id})">Release Ro</button>`;
                    row.appendChild(buttonCell);

                    // Fill other row data
                    row.innerHTML += `
                        <td>${roData.submissionDate || ''}</td>
                        <td>${roData.newspaperName || ''}</td>
                        <td>${roData.clientName || ''}</td>
                        <td>${roData.roDate || ''}</td>
                        <td>${roData.roNumber || ''}</td>
                        <td>${roData.dateOfPublication || ''}</td>
                        <td>${roData.pageNumber || ''}</td>
                        <td>${roData.state || ''}</td>
                        <td>${roData.edition || ''}</td>
                        <td>${roData.dav || ''}</td>
                        <td>${roData.color || ''}</td>
                        <td>${roData.language || ''}</td>
                        <td>${roData.length || ''}</td>
                        <td>${roData.breadth || ''}</td>
                        <td>${roData.totalSize || ''}</td>
                        <td>${roData.amount || ''}</td>
                        <td>${roData.priceToNewsPaper || ''}</td>
                        <td>${roData.gst || ''}</td>
                        <td>${roData.netPayable || ''}</td>
                        <td>${roData.emailId || ''}</td>
                        <td>${roData.phoneNumber || ''}</td>
                    `;
                    tableBody.appendChild(row);

                    if (currentKey === previousKey) {
                        // Increment merge count and hide the current row cells for the specified columns
                        mergeCount++;
                        let columnsToMerge = [0, 1, 2, 3, 4, 5, 6]; // Indices of the columns to merge
                        columnsToMerge.forEach(colIndex => {
                            row.cells[colIndex].style.display = 'none';
                        });
                        // Hide the button cell
                        buttonCell.style.display = 'none';
                    } else {
                        // Apply rowspan to the merged cells in the previous group
                        if (mergeCount > 0 && mergeRowStartIndex !== null) {
                            let previousRow = tableBody.rows[mergeRowStartIndex];
                            let columnsToMerge = [0, 1, 2, 3, 4, 5, 6]; // Indices of the columns to merge
                            columnsToMerge.forEach(colIndex => {
                                previousRow.cells[colIndex].rowSpan = mergeCount + 1;
                            });
                            // Apply rowspan to the button cell
                            previousRow.cells[0].rowSpan = mergeCount + 1;
                        }
                        // Reset merge tracking variables
                        mergeRowStartIndex = tableBody.rows.length - 1;
                        mergeCount = 0;
                    }

                    // Update the previous key
                    previousKey = currentKey;
                });

                // Apply rowspan to the last group if needed
                if (mergeCount > 0 && mergeRowStartIndex !== null) {
                    let previousRow = tableBody.rows[mergeRowStartIndex];
                    let columnsToMerge = [0, 1, 2, 3, 4, 5, 6]; // Indices of the columns to merge
                    columnsToMerge.forEach(colIndex => {
                        previousRow.cells[colIndex].rowSpan = mergeCount + 1;
                    });
                    // Apply rowspan to the button cell
                    previousRow.cells[0].rowSpan = mergeCount + 1;
                }

                // Destroy the previous DataTable instance (if exists)
                if ($.fn.dataTable.isDataTable('#previewRoTable')) {
                    $('#previewRoTable').DataTable().destroy();
                }

                // Reinitialize DataTable with paging disabled
                $('#previewRoTable').DataTable({
                    "paging": false,
                    "searching": true,
                    "info": true
                });

                // Hide the loader and show the table
                document.getElementById('loader').style.display = 'none';
                document.getElementById('previewRoContainer').style.display = 'block';
            } else {
                console.error("Received data is not an array:", data);
                document.getElementById('loader').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching newspaper data:', error);
            document.getElementById('loader').style.display = 'none';
        });
}

// Function to navigate to the "Create RO" tab and pre-fill the data
function navigateToForm(id) {
    const createRoTab = new bootstrap.Tab(document.querySelector('a[href="#generateRO"]'));
    createRoTab.show();

    // Fetch the data by ID and pre-fill the form
    fetch(`/api/getRoDataById/${id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Prefilled Data", data);

            // Prefill the date inputs
            document.getElementById('SubmissionDate').value = data.submissionDate || '';

            // Populate dropdowns with direct value lists
            populateDropdown('clientNameForGenerateRO', data.clientName);
            populateDropdown('roDateForGenrateRo', data.roDate);
            populateDropdown('newspaperNameForGenRo', data.newspaperName);
            populateDropdown('publishcationDate', data.dateOfPublication);
            populateDropdown('generateRoNumber', data.roNumber);

            // Set fields to readonly or disabled if necessary
            document.getElementById('SubmissionDate').readOnly = true;
        })
        .catch(error => {
            console.error('Error fetching data for pre-filling:', error);
        });
}

// Helper function to populate dropdowns
function populateDropdown(dropdownId, valueList) {
    const dropdown = document.getElementById(dropdownId);

    // Clear existing options
    dropdown.innerHTML = '';

    // Ensure valueList is an array (wrap string in an array if necessary)
    if (typeof valueList === 'string') {
        valueList = [valueList];  // Convert string to an array with one element
    }

    // Check if valueList is a valid array and not empty
    if (Array.isArray(valueList) && valueList.length > 0) {
        // Add options dynamically
        valueList.forEach(value => {

            const opt = document.createElement('option');
            opt.value = value; // Set the option's value
            opt.textContent = value; // Set the option's display text
            dropdown.appendChild(opt);
        });
    } else {
        console.error("Value list is not an array or is empty.");
    }
}

<!--Add Client-->
document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const clientName = document.getElementById('cName').value;
    const clientShortForm = document.getElementById('cShort').value;

    // Check if the fields are not empty
    if (clientName && clientShortForm) {
        // Create an object with the data
        const clientData = {
            clientName: clientName,
            clientShortForm: clientShortForm
        };

        // Show a loader or disable the submit button while submitting
        document.getElementById('submitBtn').disabled = true;

        // Send data to the backend API
        fetch('/api/addClient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        })
            .then(response => response.text()) // Get the response as plain text
            .then(message => {
                // Handle the response message from the backend
                //console.log(message);  // Log the message to check its content

                if (message === 'Client Added Successfully') {
                    // Success message using SweetAlert2
                    Swal.fire({
                        icon: 'success',
                        title: 'Client Added!',
                        text: message,
                        confirmButtonText: 'OK'
                    });
                    fetchDataofClient();
                    // Optionally, clear the form
                    document.getElementById('addClientForm').reset();
                } else {
                    // Error message using SweetAlert2
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: message,
                        confirmButtonText: 'Try Again'
                    });
                }

                // Re-enable the submit button
                document.getElementById('submitBtn').disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('submitBtn').disabled = false;
            });
    } else {
        // If fields are empty, show an alert using SweetAlert2
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Form',
            text: 'Please fill in all fields.',
            confirmButtonText: 'OK'
        });
    }
});


// Generate RO
async function showRo(){

    const submissionDate = document.getElementById("SubmissionDate").value.trim();
    const clientName = document.getElementById("clientNameForGenerateRO").value.trim();
    const roDateForGenrateRo = document.getElementById("roDateForGenrateRo").value.trim();
    const newspaperNameForGenRo = document.getElementById("newspaperNameForGenRo").value.trim();
    const publishcationDate = document.getElementById("publishcationDate").value.trim();
    const generateGst = document.getElementById("generateGst").value.trim();
    const generateRoNumber = document.getElementById("generateRoNumber").value.trim();

    if (submissionDate === '' || clientName === '' || roDateForGenrateRo === '' || newspaperNameForGenRo === '' || publishcationDate === '' || generateGst ===''|| generateRoNumber ==='') {
        alert("Please select Submission Date, Client Name,RO Date and Newspaper Name");
        return;
    }

    document.getElementById("roClientName").innerText=clientName;
    document.getElementById("clientRoDate").innerText=roDateForGenrateRo;
    document.getElementById("dateOfpublish").innerText=publishcationDate;



    const finTotalAmount = document.getElementById("finTotalAmount");
    const finAgencyCommission = document.getElementById("finAgencyCommission");
    const finPaperPublisihAmount = document.getElementById("finPaperPublisihAmount");
    const finCgst = document.getElementById("finCgst");
    const finSgst = document.getElementById("finSgst");
    const finicgst = document.getElementById("finicgst");
    const finTotalPayAbleAmount = document.getElementById("finTotalPayAbleAmount");
    const genRoNumber = document.getElementById("generateRoNumber");


    if(generateGst ==='IGST'){
        document.getElementById("cgst1").style.display='none';
        document.getElementById("cgst2").style.display='none';
        document.getElementById("Icgst").style.display='table-row';
    }
    if(generateGst === 'CGST'){
        document.getElementById("cgst1").style.display='table-row';
        document.getElementById("cgst2").style.display='table-row';
        document.getElementById("Icgst").style.display='none';
    }

    const generateRoData = {
        submissionDate: submissionDate,
        clientName: clientName,
        roDates: roDateForGenrateRo,
        newspaper: newspaperNameForGenRo,
        publicationDate: publishcationDate,
        generateRoNumber: generateRoNumber,
    };

    try {

        const response = await fetch('/api/getReleaseOrder', {
            method: 'POST', // Use POST to send JSON body data
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(generateRoData), // Send JSON data in the body
        });
        if (!response.ok) {
            throw new Error(`Error fetching release order: ${response.statusText}`);
        }

        const data = await response.json(); // Assuming the API returns an array of release orders

        // Get the table body element
        const tableBody = document.querySelector("#generateRoTable tbody");

        // Clear any existing rows in the table body
        tableBody.innerHTML = '';

        const RoContainer = document.getElementById("RoContainer");
        RoContainer.style.display='block';

        var sumfinTotalAmount = 0;
        var sumfinAgencyCommission = 0;
        var sumfinCgst = 0;
        var sumfinTotalPayAbleAmount = 0;

        //console.log("data",data);
        // Loop through the fetched data and append rows to the table
        data.forEach(row => {
            const tableRow = document.createElement('tr');

            //console.log(row);
            // Create table cells based on the row data

            sumfinTotalAmount += parseFloat(row.amount);
            sumfinAgencyCommission += parseFloat(row.price_to_news_paper);
            sumfinCgst += parseFloat(row.gst);
            sumfinTotalPayAbleAmount += parseFloat(row.net_payable);


            if (data.length > 0) {
                const genRoNumberVal = data[0].ro_number; // Access the ro_number from the first row
                genRoNumber.textContent = genRoNumberVal; // Set the ro_number to the element
            }

            tableRow.innerHTML = `
                <td>${row.length} * ${row.breadth}</td>
                <td>${row.newspaper_name}</td>
                <td>${row.language}</td>
                <td>${row.edition}</td>
                <td>${row.dav}</td>
                <td>${row.color_percentage === null ? 'N/A':row.color_percentage}</td>
                <td>${row.total_size}</td>
                <td>${row.amount}</td>
            `;

            // Append the row to the table body
            tableBody.appendChild(tableRow);
        });

        finTotalAmount.innerText = parseFloat(sumfinTotalAmount).toFixed(2);
        // finTotalAmount.innerText = sumfinAgencyCommission;
        finAgencyCommission.innerText = (parseFloat(sumfinTotalAmount) * 0.15).toFixed(2);

        finPaperPublisihAmount.innerText = ((parseFloat(sumfinTotalAmount).toFixed(2)) - ((parseFloat(sumfinTotalAmount) * 0.15).toFixed(2))).toFixed(2);
        finCgst.innerText = (parseFloat(sumfinCgst)/2).toFixed(2);
        finSgst.innerText =  (parseFloat(sumfinCgst)/2).toFixed(2);
        finicgst.innerText =  parseFloat(sumfinCgst).toFixed(2);
        finTotalPayAbleAmount.innerText =Math.round(sumfinTotalPayAbleAmount);

    } catch (error) {
        console.error("Error fetching RO data:", error.message);
        alert("Failed to fetch release order data. Please try again.");
    }
}


function generateRoNumber(){
    const roNo = document.getElementById("roNumber");
    const depName = document.getElementById("depName").value.trim();
    const dateValue = document.getElementById("dateInput").value.trim();
    const clientID = document.getElementById("clientID").value.trim();
    const specialRoID = document.getElementById("specialRoID").value.trim();

    if (dateValue) {
        // Extract the year directly using substring
        var year = dateValue.substring(0, 4);

    }

    if(depName && dateValue && clientID && year){
        roNo.value = `NC/${depName}/${clientID}/${year}/${specialRoID}`
    }
}

async function fetchClientIDs() {
    const clientName = document.getElementById("clientName").value.trim();
    const url = `/api/getClientID/${clientName}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const clientIDs = await response.json();

        // Reference to the clientID dropdown
        const clientIDDropdown = document.getElementById("clientID");

        // Clear existing options
        clientIDDropdown.innerHTML = `<option value="" disabled selected>Select a client ID</option>`;


        console.log("clientIDs",clientIDs);
        // Populate the dropdown with client IDs
        clientIDs.forEach(clientData => {
            const option = document.createElement("option");
            option.value = clientData.client_short_form;
            option.textContent = clientData.client_short_form;
            clientIDDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching client IDs:", error);
        alert("Failed to fetch client IDs. Please try again later.");
    }
}

function fetchRoNumberData() {
    const newspaperName = document.getElementById("newspaperName").value;
    const submissionDate = document.getElementById("dateInput").value;

    if (!clientName || !submissionDate) {
        alert("Please enter both client name and submission date.");
        return;
    }

    // Construct the API URL
    const apiUrl = `/api/getSpeicalRoNumber/${newspaperName}/${submissionDate}`;

    // Fetch data from the backend
    fetch(apiUrl)
        .then(response => response.text())
        .then(data => {
            console.log("RO number data", data);
            document.getElementById("specialRoID").value = data;

        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("resultContainer").innerHTML = "<p>Error fetching data. Please try again later.</p>";
        });
}

