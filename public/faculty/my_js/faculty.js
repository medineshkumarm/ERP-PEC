// public/js/faculty.js
document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display faculty data
    const facultyTable = document.querySelector(".facultyTable tbody");

    if (facultyTable) {
        fetch("http://localhost:3000/api/faculty")
            .then((response) => response.json())
            .then((facultyMembers) => {
                facultyMembers.forEach((faculty, index) => {
                    const row = facultyTable.insertRow();

                    // Adding data columns
                    row.insertCell(0).innerText = index + 1; // SL.NO
                    row.insertCell(1).innerText = faculty.name;
                    row.insertCell(2).innerText = faculty.qualifications;
                    row.insertCell(3).innerText = faculty.designation;
                    row.insertCell(4).innerText = faculty.email;
                    row.insertCell(5).innerText = faculty.contactNumber;
                    row.insertCell(6).innerHTML = `<a href="${faculty.scopusLink}">Scopus link</a>`;
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
});
