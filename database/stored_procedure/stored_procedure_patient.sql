USE dentistry_system_database;

# Procedure to register patient
DELIMITER //
CREATE PROCEDURE procedure_to_register_patient(
    IN p_full_name VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_sex CHAR(1),
    IN p_birth_date DATE,
    IN p_emergency_contact VARCHAR(255),
    IN p_emergency_phone VARCHAR(8)
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering patient.';
    END;
    START TRANSACTION; 
        INSERT INTO patient (full_name, address, sex, birth_date, emergency_contact, emergency_phone, createdAt, updatedAt)
        VALUES (p_full_name, p_address, p_sex, p_birth_date, p_emergency_contact, p_emergency_phone, NOW(), NOW());
    COMMIT;
END //
DELIMITER ;

# Procedure to update patient
DELIMITER //
CREATE PROCEDURE procedure_to_update_patient(
    IN p_id INT,
    IN p_full_name VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_sex CHAR(1),
    IN p_birth_date DATE,
    IN p_emergency_contact VARCHAR(255),
    IN p_emergency_phone VARCHAR(8)
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM patient
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient exists but is logically deleted.';
    ELSE
        UPDATE patient
        SET full_name = p_full_name,
            address = p_address,
            sex = p_sex,
            birth_date = p_birth_date,
            emergency_contact = p_emergency_contact,
            emergency_phone = p_emergency_phone,
            updatedAt = NOW()
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

# Procedure to Delete logically patient
DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_patient(
    IN p_id INT
)
BEGIN
    DECLARE patient_exists INT;
    DECLARE patient_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing patient logical deletion.';
    END;
    SELECT COUNT(*)
    INTO patient_exists
    FROM user
    WHERE id = p_id;
    IF patient_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient does not exist.';
    ELSE
        SELECT status
        INTO patient_status
        FROM user
        WHERE id = p_id;
        IF patient_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Patient has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE patient
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
DELIMITER ;