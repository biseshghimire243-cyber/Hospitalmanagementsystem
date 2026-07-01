if (
    window.location.pathname.includes("dashboard.html")
    &&
    localStorage.getItem("loggedIn") !== "true"
){
    window.location.href = "login.html";
}
const API = "http://localhost:3000";

// Add Patient
window.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("patientForm");

    if (!form) {
        console.log("patientForm not found");
        return;
    }

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const patient = {
            name: document.getElementById("name").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            phone: document.getElementById("phone").value
        };

        await fetch("http://localhost:3000/patients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(patient)
        });

        alert("Patient Added");

        loadPatients();
    });

});

// Load Patients
// Load Patients
async function loadPatients() {

    const res = await fetch(`${API}/patients`);
    const data = await res.json();

    const table = document.getElementById("patientTable");

    if (!table) return;

    table.innerHTML = "";

    // Search value
    const search = document.getElementById("searchPatient")?.value.toLowerCase() || "";

    // Filter patients
    const filteredPatients = data.filter(patient =>

        patient.id.toString().includes(search) ||

        patient.name.toLowerCase().includes(search) ||

        patient.age.toString().includes(search) ||

        patient.gender.toLowerCase().includes(search) ||

        patient.phone.toLowerCase().includes(search)

    );

    filteredPatients.forEach(patient => {

        table.innerHTML += `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.age}</td>
                <td>${patient.gender}</td>
                <td>${patient.phone}</td>
                <td>
                <button onclick="viewPatient(${patient.id}, '${patient.name}', ${patient.age}, '${patient.gender}', '${patient.phone}')">
        👁️ View
    </button>

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
if(document.getElementById("loggedUser")){
    document.getElementById("loggedUser").innerText =
        localStorage.getItem("username");
}
async function loadChart(){

    const patients =
    await fetch("http://localhost:3000/patients")
    .then(r=>r.json());

    const doctors =
    await fetch("http://localhost:3000/doctors")
    .then(r=>r.json());

    const appointments =
    await fetch("http://localhost:3000/appointments")
    .then(r=>r.json());

    const patientCount=patients.length;
    const doctorCount=doctors.length;
    const appointmentCount=appointments.length;

    const barCanvas=document.getElementById("hospitalChart");

    if(barCanvas){

        new Chart(barCanvas,{

            type:"bar",

            data:{

                labels:[
                    "Patients",
                    "Doctors",
                    "Appointments"
                ],

                datasets:[{

                    label:"Total Records",

                    data:[
                        patientCount,
                        doctorCount,
                        appointmentCount
                    ],

                    backgroundColor:[
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b"
                    ],

                    borderRadius:10

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{
                        display:false
                    }

                },

                scales:{

                    y:{
                        beginAtZero:true
                    }

                }

            }

        });

    }

    const pieCanvas=document.getElementById("pieChart");

    if(pieCanvas){

        new Chart(pieCanvas,{

            type:"pie",

            data:{

                labels:[
                    "Patients",
                    "Doctors",
                    "Appointments"
                ],

                datasets:[{

                    data:[
                        patientCount,
                        doctorCount,
                        appointmentCount
                    ],

                    backgroundColor:[
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b"
                    ]

                }]

            },

            options:{

                responsive:true

            }

        });

    }

}

loadChart();
async function loadSummary(){

    const patients=
    await fetch("http://localhost:3000/patients")
    .then(r=>r.json());

    const doctors=
    await fetch("http://localhost:3000/doctors")
    .then(r=>r.json());

    const appointments=
    await fetch("http://localhost:3000/appointments")
    .then(r=>r.json());

    if(document.getElementById("todayPatients")){

        document.getElementById("todayPatients").innerText=
        patients.length;

    }

    if(document.getElementById("availableDoctors")){

        document.getElementById("availableDoctors").innerText=
        doctors.length;

    }

    if(document.getElementById("todayAppointments")){

        document.getElementById("todayAppointments").innerText=
        appointments.length;

    }

    const table=document.getElementById("recentAppointmentTable");

    if(table){

        table.innerHTML="";

        appointments.slice(-5).reverse().forEach(app=>{

            table.innerHTML+=`

            <tr>

                <td>${app.id}</td>

                <td>${app.patient}</td>

                <td>${app.doctor}</td>

                <td>${app.appointment_date}</td>

            </tr>

            `;

        });

    }

}

loadSummary();
function updateClock(){

    const clock=document.getElementById("liveClock");

    if(!clock) return;

    clock.innerHTML=new Date().toLocaleTimeString();

}

setInterval(updateClock,1000);

updateClock();
async function loadExtraDashboard(){

    // Doctors

    const doctorRes=await fetch("http://localhost:3000/doctors");

    const doctors=await doctorRes.json();

    const doctorTable=document.getElementById("topDoctors");

    if(doctorTable){

        doctorTable.innerHTML="";

        doctors.slice(0,5).forEach(doc=>{

            doctorTable.innerHTML+=`

            <tr>

                <td>${doc.name}</td>

                <td>${doc.specialization}</td>

            </tr>

            `;

        });

    }

    // Patients

    const patientRes=await fetch("http://localhost:3000/patients");

    const patients=await patientRes.json();

    const patientTable=document.getElementById("recentPatients");

    if(patientTable){

        patientTable.innerHTML="";

        patients.slice(-5).reverse().forEach(p=>{

            patientTable.innerHTML+=`

            <tr>

                <td>${p.name}</td>

                <td>${p.phone}</td>

            </tr>

            `;

        });

    }

}

loadExtraDashboard();
async function loadAppointmentTrend() {

    const res = await fetch("http://localhost:3000/appointments");
    const appointments = await res.json();

    const monthData = [0,0,0,0,0,0,0,0,0,0,0,0];

    appointments.forEach(app => {

        const month = new Date(app.appointment_date).getMonth();

        monthData[month]++;

    });

    const canvas = document.getElementById("appointmentTrend");

    if (!canvas) return;

    new Chart(canvas, {

        type: "line",

        data: {

            labels: [

                "Jan","Feb","Mar","Apr","May","Jun",

                "Jul","Aug","Sep","Oct","Nov","Dec"

            ],

            datasets: [{

                label: "Appointments",

                data: monthData,

                fill: true,

                tension: 0.4,

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,0.2)",

                pointRadius: 5

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}

loadAppointmentTrend();
const searchPatient = document.getElementById("searchPatient");

if (searchPatient) {

    searchPatient.addEventListener("input", loadPatients);

}
function viewPatient(id, name, age, gender, phone){

    document.getElementById("viewId").innerText = id;
    document.getElementById("viewName").innerText = name;
    document.getElementById("viewAge").innerText = age;
    document.getElementById("viewGender").innerText = gender;
    document.getElementById("viewPhone").innerText = phone;

    document.getElementById("patientModal").style.display = "block";

}

function closePatient(){

    document.getElementById("patientModal").style.display = "none";

}

// Close modal when clicking outside it
window.onclick = function(event){

    const modal = document.getElementById("patientModal");

    if(event.target == modal){

        modal.style.display = "none";

    }

}