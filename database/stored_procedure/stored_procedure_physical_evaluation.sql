USE dentistry_system_database;

DELIMITER //
CREATE PROCEDURE procedure_to_register_physical_evaluation(
    IN p_blood_pressure VARCHAR(10),
    IN p_blood_sugar VARCHAR(10),
    IN p_last_treatment TEXT,
    IN p_other_data TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering physical evaluation.';
    END;
    START TRANSACTION; 
        INSERT INTO physical_evaluation (
            blood_pressure, blood_sugar, last_treatment, other_data, createdAt, updatedAt, patient_id
        ) VALUES (
            p_blood_pressure, p_blood_sugar, p_last_treatment, p_other_data, NOW(), NOW(), p_patient_id
        );
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_physical_evaluation(
    IN p_id INT,
    IN p_blood_pressure VARCHAR(10),
    IN p_blood_sugar VARCHAR(10),
    IN p_last_treatment TEXT,
    IN p_other_data TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM physical_evaluation
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Physical evaluation item does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Physical evaluation item exists but is logically deleted.';
    ELSE
        UPDATE physical_evaluation
        SET 
            blood_pressure = p_blood_pressure,
            blood_sugar = p_blood_sugar,
            last_treatment = p_last_treatment,
            other_data = p_other_data,
            updatedAt = NOW(),
            patient_id = p_patient_id
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;