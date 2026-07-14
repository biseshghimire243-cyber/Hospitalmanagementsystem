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
    console.log("BODY:", req.body);
console.log("FILE:", req.file);

    const {
        name,
        age,
        gender,
        phone,
        blood_group,
        email,
        address,
        dob,
        emergency_contact
    } = req.body;

    const photo = req.file ? req.file.filename : "";

    db.query(

        `INSERT INTO patients
        (name, age, gender, phone, photo, blood_group, email, address, dob, emergency_contact)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

        [
            name,
            age,
            gender,
            phone,
            photo,
            blood_group,
            email,
            address,
            dob,
            emergency_contact
        ],

        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            res.send("Patient Added Successfully");

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
// =========================
// Add Bill
// =========================

app.post("/bills", (req, res) => {

    const {

        patient_id,
        doctor_id,
        consultation_fee,
        medicine_fee,
        lab_fee,
        total,
        payment_status

    } = req.body;

    db.query(

        `INSERT INTO bills
        (patient_id, doctor_id, consultation_fee,
        medicine_fee, lab_fee, total, payment_status)
        VALUES (?,?,?,?,?,?,?)`,

        [

            patient_id,
            doctor_id,
            consultation_fee,
            medicine_fee,
            lab_fee,
            total,
            payment_status

        ],

        (err, result) => {

            if (err) return res.send(err);

            res.send("Bill Generated");

        }

    );

});
// =========================
// Get Bills
// =========================

app.get("/bills", (req, res) => {

    db.query(

        `SELECT

        bills.id,

        patients.name AS patient,

        doctors.name AS doctor,

        consultation_fee,

        medicine_fee,

        lab_fee,

        total,

        payment_status,

        bill_date

        FROM bills

        JOIN patients
        ON bills.patient_id = patients.id

        JOIN doctors
        ON bills.doctor_id = doctors.id

        ORDER BY bills.id DESC`,

        (err, result) => {

            if (err) return res.send(err);

            res.json(result);

        }

    );

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
// =========================
// ADD DEPARTMENT
// =========================
app.post("/departments", (req, res) => {

    const {
        department_name,
        head_doctor,
        description,
        status
    } = req.body;

    db.query(
        `INSERT INTO departments
        (department_name, head_doctor, description, status)
        VALUES (?, ?, ?, ?)`,
        [
            department_name,
            head_doctor,
            description,
            status
        ],
        (err) => {

            if (err) return res.status(500).send(err);

            res.send("Department Added Successfully");

        }
    );

});

// =========================
// GET DEPARTMENTS
// =========================
app.get("/departments", (req, res) => {

    db.query(
        "SELECT * FROM departments ORDER BY id DESC",
        (err, result) => {

            if (err) return res.status(500).send(err);

            res.json(result);

        }
    );

});

// =========================
// UPDATE DEPARTMENT
// =========================
app.put("/departments/:id", (req, res) => {

    const id = req.params.id;

    const {
        department_name,
        head_doctor,
        description,
        status
    } = req.body;

    db.query(
        `UPDATE departments
         SET department_name=?,
             head_doctor=?,
             description=?,
             status=?
         WHERE id=?`,
        [
            department_name,
            head_doctor,
            description,
            status,
            id
        ],
        (err) => {

            if (err) return res.status(500).send(err);

            res.send("Department Updated");

        }
    );

});

// =========================
// DELETE DEPARTMENT
// =========================
app.delete("/departments/:id", (req, res) => {

    db.query(
        "DELETE FROM departments WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).send(err);

            res.send("Department Deleted");

        }
    );

});
// =========================
// ADD LAB TEST
// =========================
app.post("/labtests", (req, res) => {

    const {
        patient_id,
        doctor_id,
        test_name,
        test_date,
        result,
        status,
        price
    } = req.body;

    db.query(
        `INSERT INTO lab_tests
        (patient_id, doctor_id, test_name, test_date, result, status, price)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            patient_id,
            doctor_id,
            test_name,
            test_date,
            result,
            status,
            price
        ],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Laboratory Test Added Successfully" });
        }
    );

});


// =========================
// GET LAB TESTS
// =========================
app.get("/labtests", (req, res) => {

    db.query(
        `SELECT
            lab_tests.id,
            patients.name AS patient,
            doctors.name AS doctor,
            test_name,
            test_date,
            result,
            status,
            price

        FROM lab_tests

        JOIN patients
        ON lab_tests.patient_id = patients.id

        JOIN doctors
        ON lab_tests.doctor_id = doctors.id

        ORDER BY lab_tests.id DESC`,
        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result);

        }
    );

});


// =========================
// DELETE LAB TEST
// =========================
app.delete("/labtests/:id", (req, res) => {

    db.query(
        "DELETE FROM lab_tests WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                message: "Deleted Successfully"
            });

        }
    );

});
//===========================
// ADD MEDICINE
//===========================

app.post("/medicines",(req,res)=>{

const{

medicine_name,
company,
category,
stock,
price,
expiry_date,
description

}=req.body;

db.query(

`INSERT INTO medicines
(medicine_name,company,category,stock,price,expiry_date,description)

VALUES(?,?,?,?,?,?,?)`,

[
medicine_name,
company,
category,
stock,
price,
expiry_date,
description
],

(err)=>{

if(err) return res.status(500).json(err);

res.json({
message:"Medicine Added"
});

}

);

});

//===========================
// GET MEDICINES
//===========================

app.get("/medicines",(req,res)=>{

db.query(

"SELECT * FROM medicines ORDER BY id DESC",

(err,result)=>{

if(err) return res.status(500).json(err);

res.json(result);

}

);

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});