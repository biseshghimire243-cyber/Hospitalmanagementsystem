if (
    window.location.pathname.includes("dashboard.html")
    &&
    localStorage.getItem("loggedIn") !== "true"
){
    window.location.href = "login.html";
}
const API = "http://localhost:3000";

// Add Patient
document.getElementById("patientForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const patient = {
        name: document.getElementById("name").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        phone: document.getElementById("phone").value
    };

    await fetch(`${API}/patients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(patient)
    });

    alert("Patient Added");

    loadPatients();
});

// Load Patients
// Load Patients
async function loadPatients() {
    const res = await fetch(`${API}/patients`);
    const data = await res.json();

    const table = document.getElementById("patientTable");

    if (!table) return;

    table.innerHTML = "";

    data.forEach(patient => {
        table.innerHTML += `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>
                    <button onclick="editPatient(${patient.id}, '${patient.name}', ${patient.age}, '${patient.gender}', '${patient.phone}')">
                        Edit
                    </button>

                    <button onclick="deletePatient(${patient.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

loadPatients();
// Add Doctor
document.getElementById("doctorForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const doctor = {
        name: document.getElementById("doctorName").value,
        specialization: document.getElementById("specialization").value,
        phone: document.getElementById("doctorPhone").value
    };

    await fetch("http://localhost:3000/doctors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(doctor)
    });

    alert("Doctor Added");

    loadDoctors();
});

// Load Doctors
async function loadDoctors() {
    const res = await fetch("http://localhost:3000/doctors");
    const data = await res.json();

    const table = document.getElementById("doctorTable");

    if (!table) return;

    table.innerHTML = "";

    data.forEach(doctor => {
        table.innerHTML += `
            <tr>
                <td>${doctor.id}</td>
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.phone}</td>
            </tr>
        `;
    });
}

loadDoctors();
// Load Patients into Dropdown
async function loadPatientDropdown() {
    const res = await fetch("http://localhost:3000/patients");
    const data = await res.json();

    const patientSelect = document.getElementById("patient");

    if (!patientSelect) return;

    patientSelect.innerHTML =
        '<option value="">Select Patient</option>';

    data.forEach(patient => {
        patientSelect.innerHTML += `
            <option value="${patient.id}">
                ${patient.name}
            </option>
        `;
    });
}

// Load Doctors into Dropdown
async function loadDoctorDropdown() {
    const res = await fetch("http://localhost:3000/doctors");
    const data = await res.json();

    const doctorSelect = document.getElementById("doctor");

    if (!doctorSelect) return;

    doctorSelect.innerHTML =
        '<option value="">Select Doctor</option>';

    data.forEach(doctor => {
        doctorSelect.innerHTML += `
            <option value="${doctor.id}">
                ${doctor.name}
            </option>
        `;
    });
}

// Book Appointment
document.getElementById("appointmentForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const appointment = {
        patient_id: document.getElementById("patient").value,
        doctor_id: document.getElementById("doctor").value,
        appointment_date: document.getElementById("appointmentDate").value
    };

    await fetch("http://localhost:3000/appointments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(appointment)
    });

    alert("Appointment Booked");

    loadAppointments();
});

// Load Appointments
async function loadAppointments() {

    const res = await fetch("http://localhost:3000/appointments");
    const data = await res.json();

    const table = document.getElementById("appointmentTable");

    if (!table) return;

    table.innerHTML = "";

    data.forEach(app => {
        table.innerHTML += `
            <tr>
                <td>${app.id}</td>
                <td>${app.patient}</td>
                <td>${app.doctor}</td>
                <td>${app.appointment_date}</td>
            </tr>
        `;
    });
}

loadPatientDropdown();
loadDoctorDropdown();
loadAppointments();
async function loadDashboardCounts() {

    const patientRes = await fetch("http://localhost:3000/patients");
    const patients = await patientRes.json();

    const doctorRes = await fetch("http://localhost:3000/doctors");
    const doctors = await doctorRes.json();

    const appointmentRes = await fetch("http://localhost:3000/appointments");
    const appointments = await appointmentRes.json();

    if(document.getElementById("patientCount")){
        document.getElementById("patientCount").innerText = patients.length;
    }

    if(document.getElementById("doctorCount")){
        document.getElementById("doctorCount").innerText = doctors.length;
    }

    if(document.getElementById("appointmentCount")){
        document.getElementById("appointmentCount").innerText = appointments.length;
    }
}

loadDashboardCounts();
let editId = null;

function editPatient(id, name, age, gender, phone) {

    document.getElementById("name").value = name;
    document.getElementById("age").value = age;
    document.getElementById("gender").value = gender;
    document.getElementById("phone").value = phone;

    editId = id;
}
async function deletePatient(id) {

    try {
        const res = await fetch(`http://localhost:3000/patients/${id}`, {
            method: "DELETE"
        });

        const data = await res.text();
        console.log(data);

        loadPatients();

    } catch (error) {
        console.log("Delete error:", error);
    }
}
function logout(){

    localStorage.removeItem("loggedIn");

    window.location.href = "login.html";
}