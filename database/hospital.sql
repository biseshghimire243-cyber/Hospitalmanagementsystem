-- ==========================================================
-- HOSPITAL MANAGEMENT SYSTEM DATABASE
-- Database: hospital_db
-- ==========================================================

-- ==========================================================
-- 1. USERS TABLE
-- Used by /login
-- ==========================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Default login
INSERT INTO users (username, password)
VALUES ('admin', 'admin123');


-- ==========================================================
-- 2. PATIENTS TABLE
-- Used by /patients
-- ==========================================================

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    age INT,
    gender VARCHAR(20),
    phone VARCHAR(30),

    photo VARCHAR(255) DEFAULT '',

    blood_group VARCHAR(10),
    email VARCHAR(150),
    address VARCHAR(255),

    dob DATE,

    emergency_contact VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================================
-- 3. DOCTORS TABLE
-- Used by /doctors
-- ==========================================================

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    specialization VARCHAR(150),
    phone VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================================
-- 4. DEPARTMENTS TABLE
-- Used by /departments
-- ==========================================================

CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    department_name VARCHAR(150) NOT NULL,
    head_doctor VARCHAR(150),
    description TEXT,

    status ENUM('Active', 'Inactive') DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==========================================================
-- 5. APPOINTMENTS TABLE
-- Used by /appointments
-- ==========================================================

CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,

    appointment_date DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ==========================================================
-- 6. BILLS TABLE
-- Used by /bills
-- ==========================================================

CREATE TABLE bills (
    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,

    consultation_fee DECIMAL(10,2) DEFAULT 0.00,
    medicine_fee DECIMAL(10,2) DEFAULT 0.00,
    lab_fee DECIMAL(10,2) DEFAULT 0.00,

    total DECIMAL(10,2) DEFAULT 0.00,

    payment_status ENUM(
        'Paid',
        'Pending',
        'Partially Paid'
    ) DEFAULT 'Pending',

    bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_bill_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_bill_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- ==========================================================
-- SAMPLE DATA
-- ==========================================================


-- ----------------------------------------------------------
-- SAMPLE PATIENTS
-- ----------------------------------------------------------

INSERT INTO patients
(name, age, gender, phone, photo, blood_group, email, address, dob, emergency_contact)
VALUES
(
    'Ram Sharma',
    35,
    'Male',
    '9800000001',
    '',
    'O+',
    'ram@example.com',
    'Kathmandu, Nepal',
    '1991-05-15',
    '9811111111'
),
(
    'Sita Rai',
    28,
    'Female',
    '9800000002',
    '',
    'A+',
    'sita@example.com',
    'Biratnagar, Nepal',
    '1998-08-20',
    '9822222222'
),
(
    'Hari Thapa',
    45,
    'Male',
    '9800000003',
    '',
    'B+',
    'hari@example.com',
    'Dharan, Nepal',
    '1981-03-10',
    '9833333333'
);


-- ----------------------------------------------------------
-- SAMPLE DOCTORS
-- ----------------------------------------------------------

INSERT INTO doctors
(name, specialization, phone)
VALUES
(
    'Dr. Rajesh Sharma',
    'Cardiologist',
    '9812345678'
),
(
    'Dr. Anita Rai',
    'Gynecologist',
    '9823456789'
),
(
    'Dr. Suresh Thapa',
    'Neurologist',
    '9834567890'
),
(
    'Dr. Binod Karki',
    'Orthopedic',
    '9845678901'
);


-- ----------------------------------------------------------
-- SAMPLE DEPARTMENTS
-- ----------------------------------------------------------

INSERT INTO departments
(department_name, head_doctor, description, status)
VALUES
(
    'Cardiology',
    'Dr. Rajesh Sharma',
    'Department specializing in heart and cardiovascular diseases.',
    'Active'
),
(
    'Gynecology',
    'Dr. Anita Rai',
    'Department providing women health and maternity services.',
    'Active'
),
(
    'Neurology',
    'Dr. Suresh Thapa',
    'Department specializing in brain and nervous system disorders.',
    'Active'
),
(
    'Orthopedics',
    'Dr. Binod Karki',
    'Department specializing in bones, joints and muscles.',
    'Active'
),
(
    'Emergency',
    'Dr. Rajesh Sharma',
    '24-hour emergency medical services.',
    'Active'
);


-- ----------------------------------------------------------
-- SAMPLE APPOINTMENTS
-- ----------------------------------------------------------

INSERT INTO appointments
(patient_id, doctor_id, appointment_date)
VALUES
(
    1,
    1,
    '2026-09-05 10:00:00'
),
(
    2,
    2,
    '2026-09-06 11:30:00'
),
(
    3,
    3,
    '2026-09-07 14:00:00'
);


-- ----------------------------------------------------------
-- SAMPLE BILLS
-- ----------------------------------------------------------

INSERT INTO bills
(
    patient_id,
    doctor_id,
    consultation_fee,
    medicine_fee,
    lab_fee,
    total,
    payment_status
)
VALUES
(
    1,
    1,
    1000.00,
    1500.00,
    500.00,
    3000.00,
    'Paid'
),
(
    2,
    2,
    800.00,
    1000.00,
    700.00,
    2500.00,
    'Pending'
),
(
    3,
    3,
    1200.00,
    800.00,
    1000.00,
    3000.00,
    'Partially Paid'
);


-- ==========================================================
-- INDEXES
-- ==========================================================

CREATE INDEX idx_patients_phone
ON patients(phone);

CREATE INDEX idx_patients_email
ON patients(email);

CREATE INDEX idx_doctors_specialization
ON doctors(specialization);

CREATE INDEX idx_appointments_patient
ON appointments(patient_id);

CREATE INDEX idx_appointments_doctor
ON appointments(doctor_id);

CREATE INDEX idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX idx_bills_patient
ON bills(patient_id);

CREATE INDEX idx_bills_doctor
ON bills(doctor_id);


-- ==========================================================
-- CHECK TABLES
-- ==========================================================

SHOW TABLES;

SELECT * FROM users;
SELECT * FROM patients;
SELECT * FROM doctors;
SELECT * FROM departments;
SELECT * FROM appointments;
SELECT * FROM bills;