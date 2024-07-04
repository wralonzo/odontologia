USE dentistry_system_database;

# Procedure to register patient record
DELIMITER //
CREATE PROCEDURE procedure_to_register_patient_record(
    IN p_full_name VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_gender CHAR(1),
    IN p_age INT,
    IN p_emergency_contact VARCHAR(255),
    IN p_emergency_phone VARCHAR(8),
    IN p_hypertension BOOLEAN,
    IN p_hypertension_control BOOLEAN,
    IN p_diabetes BOOLEAN,
    IN p_diabetes_control BOOLEAN,
    IN p_hospitalization BOOLEAN,
    IN p_allergy_medication BOOLEAN,
    IN p_bleeding BOOLEAN,
    IN p_serious_illness TEXT,
    IN p_pregnancy BOOLEAN,
    IN p_pregnancy_months INT,
    IN p_recent_food BOOLEAN,
    IN p_recent_symptoms BOOLEAN,
    IN p_blood_pressure VARCHAR(10),
    IN p_blood_sugar VARCHAR(10),
    IN p_last_treatment TEXT,
    IN p_other_physical_data TEXT,
    IN p_treatment VARCHAR(255),
    IN p_cost DECIMAL(10, 2),
    IN p_treatment_date DATE,
    IN p_tooth_number VARCHAR(50),
    IN p_conductometry TEXT,
    IN p_restoration BOOLEAN,
    IN p_other_root_canal_data TEXT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering patient record.';
    END;
    START TRANSACTION; 
        INSERT INTO patient (full_name, address, gender, age, emergency_contact, emergency_phone, status, createdAt, updatedAt)
        VALUES (p_full_name, p_address, p_gender, p_age, p_emergency_contact, p_emergency_phone, TRUE, NOW(), NOW());
        SET @patient_id = LAST_INSERT_ID();
        INSERT INTO health_questionnaire (patient_id, hypertension, hypertension_control, diabetes, diabetes_control, hospitalization, allergy_medication, bleeding, serious_illness, pregnancy, pregnancy_months, recent_food, recent_symptoms, status, createdAt, updatedAt)
        VALUES (@patient_id, p_hypertension, p_hypertension_control, p_diabetes, p_diabetes_control, p_hospitalization, p_allergy_medication, p_bleeding, p_serious_illness, p_pregnancy, p_pregnancy_months, p_recent_food, p_recent_symptoms, TRUE, NOW(), NOW());
        INSERT INTO physical_evaluation (patient_id, blood_pressure, blood_sugar, last_treatment, other_data, status, createdAt, updatedAt)
        VALUES (@patient_id, p_blood_pressure, p_blood_sugar, p_last_treatment, p_other_physical_data, TRUE, NOW(), NOW());
        INSERT INTO treatment (patient_id, treatment, cost, date, status, createdAt, updatedAt)
        VALUES (@patient_id, p_treatment, p_cost, p_treatment_date, TRUE, NOW(), NOW());
        INSERT INTO root_canal_treatment (patient_id, tooth_number, conductometry, restoration, other_data, status, createdAt, updatedAt)
        VALUES (@patient_id, p_tooth_number, p_conductometry, p_restoration, p_other_root_canal_data, TRUE, NOW(), NOW());
    COMMIT;
END //
