const express = require("express");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const multer = require("multer");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ============================
// Patient Photo Upload
// ============================

const uploadFolder = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            file.originalname;

        cb(null, uniqueName);

    }

});

const upload = multer({
    storage: storage
});


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
// =========================
// Add Patient With Photo
// =========================
app.post("/patients", upload.single("photo"), (req, res) => {

    const { name, age, gender, phone } = req.body;

    let photo = "";

    if (req.file) {
        photo = req.file.filename;
    }

    db.query(

        "INSERT INTO patients(name, age, gender, phone, photo) VALUES(?,?,?,?,?)",

        [name, age, gender, phone, photo],

        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

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
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

// Update Patient
app.put("/patients/:id", (req, res) => {

    const id = req.params.id;
    const { name, age, gender, phone } = req.body;

    db.query(
        "UPDATE patients SET name=?, age=?, gender=?, phone=? WHERE id=?",
        [name, age, gender, phone, id],
        (err) => {
            if (err) return res.send(err);
            res.send("Updated");
        }
    );
});

// Delete Patient
app.delete("/patients/:id", (req, res) => {

    const id = req.params.id;

    db.query(
        "DELETE FROM appointments WHERE patient_id=?",
        [id],
        (err) => {

            if (err) return res.send(err);

            db.query(
                "DELETE FROM patients WHERE id=?",
                [id],
                (err) => {

                    if (err) return res.send(err);

                    res.send("Patient Deleted");
                }
            );
        }
    );
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE BINARY username=? AND BINARY password=?",
        [username, password],
        (err, result) => {

            if (err) return res.status(500).json(err);

            if (result.length > 0) {
                res.json({
                    success: true,
                    user: result[0]
                });
            } else {
                res.json({
                    success: false
                });
            }
        }
    );
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});
// START SERVER (ALWAYS LAST)

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});