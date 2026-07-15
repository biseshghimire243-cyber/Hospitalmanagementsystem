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

        const formData = new FormData();

formData.append("name", document.getElementById("name").value);
formData.append("age", document.getElementById("age").value);
formData.append("gender", document.getElementById("gender").value);
formData.append("phone", document.getElementById("phone").value);
formData.append("blood_group", document.getElementById("bloodGroup").value);

formData.append("email", document.getElementById("email").value);

formData.append("address", document.getElementById("address").value);

formData.append("dob", document.getElementById("dob").value);

formData.append("emergency_contact", document.getElementById("emergencyContact").value);

const photo = document.getElementById("photo").files[0];

if(photo){

    formData.append("photo", photo);

}

await fetch(`${API}/patients`,{

    method:"POST",

    body:formData

});

        showToast("✅ Patient Added");

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

    const search = document.getElementById("searchPatient")?.value.toLowerCase() || "";

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

            <td>
                <img
                    src="${patient.photo ? `${API}/uploads/${patient.photo}` : 'images/default-avatar.png'}"
                    class="patient-img"
                    onerror="this.src='images/default-avatar.png'"
                >
            </td>

            <td>${patient.name}</td>

            <td>${patient.age}</td>

            <td>${patient.gender}</td>

            <td>${patient.blood_group || "-"}</td>

            <td>${patient.phone}</td>

            <td>${patient.email || "-"}</td>

            <td>${patient.emergency_contact || "-"}</td>

            <td>${patient.address || "-"}</td>

            <td>${patient.dob || "-"}</td>

            <td>

                <button onclick="viewPatient(
                    ${patient.id},
                    '${patient.name}',
                    ${patient.age},
                    '${patient.gender}',
                    '${patient.phone}',
                    '${patient.photo}',
                    '${patient.blood_group || ""}',
                    '${patient.dob || ""}',
                    '${patient.email || ""}',
                    '${patient.emergency_contact || ""}',
                    '${patient.address || ""}'
                )">
                    👁 View
                </button>

                <button onclick="editPatient(
                    ${patient.id},
                    '${patient.name}',
                    ${patient.age},
                    '${patient.gender}',
                    '${patient.phone}'
                )">
                    ✏ Edit
                </button>

                <button onclick="deletePatient(${patient.id})">
                    🗑 Delete
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

   showToast("👨‍⚕️ Doctor Added");

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

loadDepartmentDropdown();
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

    showToast("📅 Appointment Booked");

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
function viewPatient(
    id,
    name,
    age,
    gender,
    phone,
    photo,
    blood_group,
    dob,
    email,
    emergency_contact,
    address
) {

    document.getElementById("viewId").innerText = id;
    document.getElementById("viewName").innerText = name;
    document.getElementById("viewAge").innerText = age;
    document.getElementById("viewGender").innerText = gender;
    document.getElementById("viewPhone").innerText = phone;

    document.getElementById("viewBlood").innerText = blood_group;
    document.getElementById("viewDob").innerText = dob;
    document.getElementById("viewEmail").innerText = email;
    document.getElementById("viewEmergency").innerText = emergency_contact;
    document.getElementById("viewAddress").innerText = address;

    document.getElementById("viewPhoto").src =
        photo ? `${API}/uploads/${photo}` : "images/default-avatar.png";

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
async function exportPatientPDF() {

    const res = await fetch(`${API}/patients`);
    const data = await res.json();

    // Current search text
    const search = document.getElementById("searchPatient")?.value.toLowerCase() || "";

    // Export only filtered patients
    const filteredPatients = data.filter(patient =>

        patient.id.toString().includes(search) ||

        patient.name.toLowerCase().includes(search) ||

        patient.age.toString().includes(search) ||

        patient.gender.toLowerCase().includes(search) ||

        patient.phone.toLowerCase().includes(search)

    );

    if (filteredPatients.length === 0) {
        alert("No patient found to export.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Hospital Management System", 14, 15);

    doc.setFontSize(14);
    doc.text("Filtered Patient List", 14, 25);

    const rows = [];

    filteredPatients.forEach(patient => {

        rows.push([
            patient.id,
            patient.name,
            patient.age,
            patient.gender,
            patient.phone
        ]);

    });

    doc.autoTable({
        head: [["ID", "Name", "Age", "Gender", "Phone"]],
        body: rows,
        startY: 35
    });

    doc.save("Filtered_Patients.pdf");
}
function showToast(message,type="success"){

    const toast=document.getElementById("toast");

    if(!toast) return;

    toast.className=type;

    toast.innerHTML=message;

    toast.style.display="block";

    setTimeout(()=>{

        toast.style.display="none";

    },3000);

}
function toggleSidebar(){

    document
        .getElementById("sidebar")
        .classList
        .toggle("active");

}
// ===================================
// DEPARTMENTS MODULE
// ===================================

if (window.location.pathname.includes("departments.html")) {

    loadDepartments();

    const form = document.getElementById("departmentForm");

    form.addEventListener("submit", async function(e) {

        e.preventDefault();

        const department = {
            department_name: document.getElementById("departmentName").value,
            head_doctor: document.getElementById("headDoctor").value,
            description: document.getElementById("description").value,
            status: document.getElementById("status").value
        };

        await fetch(`${API}/departments`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(department)

        });

        alert("Department Added Successfully ✅");

        form.reset();

        loadDepartments();

    });

}
async function loadDepartments() {

    const res = await fetch(`${API}/departments`);

    const data = await res.json();

    const table = document.getElementById("departmentTable");

    if (!table) return;

    table.innerHTML = "";

    // Search text
    const search =
        document.getElementById("searchDepartment")?.value.toLowerCase() || "";

    // Filter departments
    const filtered = data.filter(dep =>

        dep.department_name.toLowerCase().includes(search) ||

        dep.head_doctor.toLowerCase().includes(search)

    );

    // Show only filtered departments
    filtered.forEach(department => {

        table.innerHTML += `

        <tr>

            <td>${department.id}</td>

            <td>${department.department_name}</td>

            <td>${department.head_doctor}</td>

            <td>${department.description}</td>

            <td>

                <span class="${
                    department.status === "Active"
                    ? "status-active"
                    : "status-inactive"
                }">

                ${department.status}

                </span>

            </td>

            <td>

                <button onclick="editDepartment(${department.id})">
                    ✏ Edit
                </button>

                <button onclick="deleteDepartment(${department.id})">
                    🗑 Delete
                </button>

            </td>

        </tr>

        `;

    });

}
async function deleteDepartment(id) {

    if (!confirm("Delete this department?")) return;

    await fetch(`${API}/departments/${id}`, {

        method: "DELETE"

    });

    loadDepartments();

}
document.getElementById("searchDepartment")?.addEventListener("keyup", () => {

    loadDepartments();

});
async function loadDepartmentDropdown() {

    const res = await fetch(`${API}/departments`);

    const data = await res.json();

    const dropdown = document.getElementById("departmentSelect");

    if(!dropdown) return;

    dropdown.innerHTML = `
        <option value="">
            Select Department
        </option>
    `;

    data.forEach(dep=>{

        dropdown.innerHTML += `
            <option value="${dep.department_name}">
                ${dep.department_name}
            </option>
        `;

    });

}
const consultation =
document.getElementById("consultationFee");

const medicine =
document.getElementById("medicineFee");

const lab =
document.getElementById("labFee");

const total =
document.getElementById("totalFee");

function calculateBill(){

if(!consultation) return;

const c =
Number(consultation.value)||0;

const m =
Number(medicine.value)||0;

const l =
Number(lab.value)||0;

total.value = c+m+l;

}

consultation?.addEventListener("input",calculateBill);

medicine?.addEventListener("input",calculateBill);

lab?.addEventListener("input",calculateBill);
async function loadBillPatients() {

    const res = await fetch(`${API}/patients`);
    const patients = await res.json();

    const dropdown = document.getElementById("billPatient");

    if (!dropdown) return;

    dropdown.innerHTML = `
        <option value="">Select Patient</option>
    `;

    patients.forEach(patient => {

        dropdown.innerHTML += `
            <option value="${patient.id}">
                ${patient.name}
            </option>
        `;

    });

}
async function loadBillDoctors() {

    const res = await fetch(`${API}/doctors`);
    const doctors = await res.json();

    const dropdown = document.getElementById("billDoctor");

    if (!dropdown) return;

    dropdown.innerHTML = `
        <option value="">Select Doctor</option>
    `;

    doctors.forEach(doctor => {

        dropdown.innerHTML += `
            <option value="${doctor.id}">
                ${doctor.name}
            </option>
        `;

    });

}
if (window.location.pathname.includes("billing.html")) {

    loadBillPatients();

    loadBillDoctors();

}
// =============================
// BILLING MODULE
// =============================

const billForm = document.getElementById("billForm");

billForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const bill = {

        patient_id: document.getElementById("billPatient").value,
        doctor_id: document.getElementById("billDoctor").value,
        consultation_fee: document.getElementById("consultationFee").value,
        medicine_fee: document.getElementById("medicineFee").value,
        lab_fee: document.getElementById("labFee").value,
        total: document.getElementById("totalFee").value,
        payment_status: document.getElementById("paymentStatus").value

    };

    const res = await fetch(`${API}/bills`, {

        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bill)

    });

    const msg = await res.text();

    showToast(msg);

    billForm.reset();

    calculateBill();

    loadBills();

});

async function loadBills() {

    const table = document.getElementById("billTable");

    if (!table) return;

    const res = await fetch(`${API}/bills`);

    const bills = await res.json();

    table.innerHTML = "";

    bills.forEach(bill => {

        table.innerHTML += `
        <tr>
            <td>${bill.id}</td>
            <td>${bill.patient}</td>
            <td>${bill.doctor}</td>
            <td>Rs. ${bill.total}</td>
            <td>${bill.payment_status}</td>
            <td>${bill.bill_date}</td>
            <td>
                <button onclick="alert('Print feature coming soon')">
                    🖨 Print
                </button>
            </td>
        </tr>
        `;

    });

}

if (window.location.pathname.includes("billing.html")) {

    loadBills();

}
// Generate Bill
document.getElementById("billingForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const bill = {

        patient_id: document.getElementById("billPatient").value,
        doctor_id: document.getElementById("billDoctor").value,

        consultation_fee: document.getElementById("consultationFee").value,

        medicine_fee: document.getElementById("medicineFee").value,

        lab_fee: document.getElementById("labFee").value,

        total: document.getElementById("totalFee").value,

        payment_status: document.getElementById("paymentStatus").value

    };

    const res = await fetch(`${API}/bills`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(bill)

    });

    const msg = await res.text();

    showToast(msg);

    document.getElementById("billingForm").reset();

    calculateBill();

    loadBills();

});


// Load Billing History
async function loadBills() {

    const table = document.getElementById("billTable");

    if (!table) return;

    const res = await fetch(`${API}/bills`);

    const bills = await res.json();

    table.innerHTML = "";

    bills.forEach(bill => {

        table.innerHTML += `

        <tr>

            <td>${bill.id}</td>

            <td>${bill.patient}</td>

            <td>${bill.doctor}</td>

            <td>Rs. ${bill.total}</td>

            <td>${bill.payment_status}</td>

            <td>${bill.bill_date}</td>

            <td>

                <button>🖨 Print</button>

            </td>

        </tr>

        `;

    });

}
if(window.location.pathname.includes("billing.html")){

    loadBills();

}
// =============================
// Generate Bill
// =============================

document.getElementById("billForm")?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const bill = {

        patient_id: document.getElementById("billPatient").value,

        doctor_id: document.getElementById("billDoctor").value,

        consultation_fee: document.getElementById("consultationFee").value,

        medicine_fee: document.getElementById("medicineFee").value,

        lab_fee: document.getElementById("labFee").value,

        total: document.getElementById("totalFee").value,

        payment_status: document.getElementById("paymentStatus").value

    };

    const res = await fetch(`${API}/bills`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(bill)

    });

    const msg = await res.text();

    alert(msg);

    loadBills();

});
// =============================
// Load Bills
// =============================

async function loadBills(){

    const res = await fetch(`${API}/bills`);

    const bills = await res.json();

    const table = document.getElementById("billTable");

    if(!table) return;

    table.innerHTML = "";

    bills.forEach(bill=>{

        table.innerHTML += `

        <tr>

            <td>${bill.id}</td>

            <td>${bill.patient}</td>

            <td>${bill.doctor}</td>

            <td>Rs. ${bill.total}</td>

            <td>${bill.payment_status}</td>

            <td>${bill.bill_date}</td>

            <td>

                <button onclick="alert('Print feature coming soon')">

                    🖨 Print

                </button>

            </td>

        </tr>

        `;

    });

}

loadBills();
// ===================================
// LABORATORY MODULE
// ===================================

// Load Patients
async function loadLabPatients() {

    const res = await fetch(`${API}/patients`);
    const patients = await res.json();

    const dropdown = document.getElementById("labPatient");

    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Select Patient</option>`;

    patients.forEach(patient => {

        dropdown.innerHTML += `
            <option value="${patient.id}">
                ${patient.name}
            </option>
        `;

    });

}

// Load Doctors
async function loadLabDoctors() {

    const res = await fetch(`${API}/doctors`);
    const doctors = await res.json();

    const dropdown = document.getElementById("labDoctor");

    if (!dropdown) return;

    dropdown.innerHTML = `<option value="">Select Doctor</option>`;

    doctors.forEach(doc => {

        dropdown.innerHTML += `
            <option value="${doc.id}">
                ${doc.name}
            </option>
        `;

    });

}

// Save Lab Test
const labForm = document.getElementById("labForm");

labForm?.addEventListener("submit", async function(e){

    e.preventDefault();

    const lab = {

        patient_id: document.getElementById("labPatient").value,

        doctor_id: document.getElementById("labDoctor").value,

        test_name: document.getElementById("testName").value,

        test_date: document.getElementById("testDate").value,

        result: document.getElementById("testResult").value,

        status: document.getElementById("testStatus").value,

        price: document.getElementById("testPrice").value

    };

    await fetch(`${API}/labtests`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(lab)

    });

    showToast("🧪 Laboratory Test Saved");

    labForm.reset();

    loadLabHistory();

});

// Load History
async function loadLabHistory(){

    const res = await fetch(`${API}/labtests`);

    const tests = await res.json();

    const table = document.getElementById("labTable");

    if(!table) return;

    table.innerHTML = "";

    tests.forEach(test=>{

        table.innerHTML += `
        <tr>

            <td>${test.id}</td>

            <td>${test.patient}</td>

            <td>${test.doctor}</td>

            <td>${test.test_name}</td>

            <td>Rs. ${test.price}</td>

            <td>${test.status}</td>

            <td>${test.test_date}</td>

            <td>

                <button onclick="deleteLab(${test.id})">
                    🗑 Delete
                </button>

            </td>

        </tr>
        `;

    });

}

// Delete
async function deleteLab(id){

    if(!confirm("Delete this laboratory record?")) return;

    await fetch(`${API}/labtests/${id}`,{

        method:"DELETE"

    });

    loadLabHistory();

}

// Page Load
if(window.location.pathname.includes("laboratory.html")){

    loadLabPatients();

    loadLabDoctors();

    loadLabHistory();

}
// =====================================
// PHARMACY MODULE
// =====================================

// Add Medicine
const medicineForm = document.getElementById("medicineForm");

medicineForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const medicine = {

        medicine_name: document.getElementById("medicineName").value,

        company: document.getElementById("company").value,

        category: document.getElementById("category").value,

        stock: document.getElementById("stock").value,

        price: document.getElementById("price").value,

        expiry_date: document.getElementById("expiryDate").value,

        description: document.getElementById("description").value

    };

    await fetch(`${API}/medicines`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(medicine)

    });

    showToast("💊 Medicine Added Successfully");

    medicineForm.reset();

    loadMedicines();

});



// Load Medicines
async function loadMedicines(){

    const res = await fetch(`${API}/medicines`);

    const medicines = await res.json();

    const table = document.getElementById("medicineTable");

    if(!table) return;

    table.innerHTML = "";

    const search =
    document.getElementById("searchMedicine")?.value.toLowerCase() || "";

    medicines
    .filter(medicine =>

        medicine.medicine_name.toLowerCase().includes(search) ||

        medicine.company.toLowerCase().includes(search) ||

        medicine.category.toLowerCase().includes(search)

    )

    .forEach(medicine=>{

        let status="🟢 In Stock";

        if(medicine.stock<=20){

            status="🟡 Low Stock";

        }

        if(medicine.stock==0){

            status="🔴 Out of Stock";

        }

        table.innerHTML +=`

        <tr>

            <td>${medicine.id}</td>

            <td>${medicine.medicine_name}</td>

            <td>${medicine.company}</td>

            <td>${medicine.category}</td>

            <td>${medicine.stock}</td>

            <td>Rs. ${medicine.price}</td>

            <td>${medicine.expiry_date}</td>

            <td>${status}</td>

            <td>

                <button onclick="deleteMedicine(${medicine.id})">

                🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

}


// Delete Medicine
async function deleteMedicine(id){

    if(!confirm("Delete this medicine?")) return;

    await fetch(`${API}/medicines/${id}`,{

        method:"DELETE"

    });

    loadMedicines();

}


// Search
document
.getElementById("searchMedicine")
?.addEventListener("keyup",loadMedicines);


// Page Load
if(window.location.pathname.includes("pharmacy.html")){

    loadMedicines();

}
// ======================================
// ROOM MANAGEMENT MODULE
// ======================================

// Add Room
const roomForm = document.getElementById("roomForm");

roomForm?.addEventListener("submit", async (e) => {

    e.preventDefault();

    const room = {

        room_number: document.getElementById("roomNumber").value,
        bed_number: document.getElementById("bedNumber").value,
        room_type: document.getElementById("roomType").value,
        patient_name: document.getElementById("patientName").value,
        status: document.getElementById("roomStatus").value,
        daily_charge: document.getElementById("dailyCharge").value

    };

    await fetch(`${API}/rooms`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(room)

    });

    showToast("🛏 Room Added Successfully");

    roomForm.reset();

    loadRooms();

});


// Load Rooms
async function loadRooms() {

    const res = await fetch(`${API}/rooms`);

    const rooms = await res.json();

    const table = document.getElementById("roomTable");

    if (!table) return;

    table.innerHTML = "";

    const search =
        document.getElementById("searchRoom")?.value.toLowerCase() || "";

    rooms
    .filter(room =>

        room.room_number.toLowerCase().includes(search) ||

        room.room_type.toLowerCase().includes(search) ||

        room.patient_name.toLowerCase().includes(search)

    )

    .forEach(room => {

        let badge = "";

        if (room.status === "Available")
            badge = "<span class='status-green'>🟢 Available</span>";

        if (room.status === "Occupied")
            badge = "<span class='status-red'>🔴 Occupied</span>";

        if (room.status === "Cleaning")
            badge = "<span class='status-yellow'>🟡 Cleaning</span>";

        table.innerHTML += `

        <tr>

            <td>${room.id}</td>

            <td>${room.room_number}</td>

            <td>${room.bed_number}</td>

            <td>${room.room_type}</td>

            <td>${room.patient_name || "-"}</td>

            <td>${badge}</td>

            <td>Rs. ${room.daily_charge}</td>

            <td>

                <button onclick="deleteRoom(${room.id})">

                    🗑 Delete

                </button>

            </td>

        </tr>

        `;

    });

}


// Delete Room
async function deleteRoom(id) {

    if (!confirm("Delete this room?")) return;

    await fetch(`${API}/rooms/${id}`, {

        method: "DELETE"

    });

    loadRooms();

}


// Search
document.getElementById("searchRoom")
?.addEventListener("keyup", loadRooms);


// Page Load
if (window.location.pathname.includes("rooms.html")) {

    loadRooms();

}