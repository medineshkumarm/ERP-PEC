document.addEventListener("DOMContentLoaded", () => {
    const facultyForm = document.getElementById("faculty-form");

    if (facultyForm) {
        facultyForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(facultyForm);
            const formObject = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("http://localhost:3000/api/faculty", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formObject),
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || "Faculty added successfully!");
                    facultyForm.reset();
                } else {
                    alert(result.message || "Failed to add faculty.");
                }
            } catch (error) {
                console.error("Error adding faculty:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }
});

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
document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display student data
    const studentTable = document.querySelector(".studentTable tbody");

    if (studentTable) {
        fetch("http://localhost:3000/api/students")
            .then((response) => response.json())
            .then((students) => {
                students.forEach((student) => {
                    const row = studentTable.insertRow();

                    // Adding data columns
                    row.insertCell(0).innerText = student.rollNumber;
                    row.insertCell(1).innerText = student.studentName;
                    row.insertCell(2).innerText = student.gender;
                    row.insertCell(3).innerText = student.year;
                    row.insertCell(4).innerText = student.section;
                    row.insertCell(5).innerText = student.parentName;
                    row.insertCell(6).innerText = student.address;
                    row.insertCell(7).innerText = new Date(student.dateOfBirth).toLocaleDateString();
                    row.insertCell(8).innerText = student.contactNumber;
                    row.insertCell(9).innerText = student.parentContactNumber;
                    row.insertCell(10).innerText = student.studentEmail;
                    row.insertCell(11).innerHTML = student.studentDocs.map(doc => `<a href="${doc}" target="_blank">View Document</a>`).join('<br>');
                });
            })
            .catch((error) => console.error("Error fetching data:", error));
    }
});
