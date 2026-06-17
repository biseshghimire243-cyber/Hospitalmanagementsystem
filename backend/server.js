const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "hospital_db"
});

db.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("MySQL Connected");
    }
});

// Add Patient
app.post("/patients",(req,res)=>{
    const {name,age,gender,phone} = req.body;

    db.query(
        "INSERT INTO patients(name,age,gender,phone) VALUES(?,?,?,?)",
        [name,age,gender,phone],
        (err,result)=>{
            if(err) return res.send(err);
            res.send("Patient Added");
        }
    );
});

// Get Patients
app.get("/patients",(req,res)=>{
    db.query(
        "SELECT * FROM patients",
        (err,result)=>{
            if(err) return res.send(err);
            res.json(result);
        }
    );
});

// Add Doctor
app.post("/doctors",(req,res)=>{
    const {name,specialization,phone} = req.body;

    db.query(
        "INSERT INTO doctors(name,specialization,phone) VALUES(?,?,?)",
        [name,specialization,phone],
        (err,result)=>{
            if(err) return res.send(err);
            res.send("Doctor Added");
        }
    );
});

// Get Doctors
app.get("/doctors",(req,res)=>{
    db.query(
        "SELECT * FROM doctors",
        (err,result)=>{
            if(err) return res.send(err);
            res.json(result);
        }
    );
});

// Book Appointment
app.post("/appointments",(req,res)=>{
    const {patient_id,doctor_id,appointment_date} = req.body;

    db.query(
        "INSERT INTO appointments(patient_id,doctor_id,appointment_date) VALUES(?,?,?)",
        [patient_id,doctor_id,appointment_date],
        (err,result)=>{
            if(err) return res.send(err);
            res.send("Appointment Booked");
        }
    );
});

// Get Appointments
app.get("/appointments",(req,res)=>{
    db.query(
        `SELECT appointments.id,
         patients.name AS patient,
         doctors.name AS doctor,
         appointment_date
         FROM appointments
         JOIN patients ON appointments.patient_id = patients.id
         JOIN doctors ON appointments.doctor_id = doctors.id`,
        (err,result)=>{
            if(err) return res.send(err);
            res.json(result);
        }
    );
});

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/patients.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});