USE dentistry_system_database;

DELIMITER // 
CREATE PROCEDURE procedure_to_register_clinical_history(
    IN p_patient_id INT,
    IN p_details TEXT,
    IN p_date DATE
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering clinical history.';
    END;
    START TRANSACTION; 
        INSERT INTO clinical_history (patient_id, details, date, createdAt, updatedAt)
        VALUES (p_patient_id, p_details, p_date, NOW(), NOW());
    COMMIT;
END //

DELIMITER //
CREATE PROCEDURE procedure_to_update_clinical_history(
    IN p_id INT,
    IN p_patient_id INT,
    IN p_details TEXT,
    IN p_date DATE
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM clinical_history
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clinical history does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clinical history exists but is logically deleted.';
    ELSE
        UPDATE clinical_history
        SET patient_id = p_patient_id,
            details = p_details,
            date = p_date,
            updatedAt = NOW()
        WHERE id = p_id;
    END IF;
END //

DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_clinical_history(
    IN p_id INT
)
BEGIN
    DECLARE clinical_history_exists INT;
    DECLARE clinical_history_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing clinical history logical deletion.';
    END;
    SELECT COUNT(*)
    INTO clinical_history_exists
    FROM clinical_history
    WHERE id = p_id;
    IF clinical_history_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clinical history does not exist.';
    ELSE
        SELECT status
        INTO clinical_history_status
        FROM clinical_history
        WHERE id = p_id;
        IF clinical_history_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Clinical history has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE clinical_history
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
