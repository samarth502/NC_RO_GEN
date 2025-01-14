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
