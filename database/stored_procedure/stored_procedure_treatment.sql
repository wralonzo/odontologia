USE dentistry_system_database;

DELIMITER //
CREATE PROCEDURE procedure_to_register_treatment(
    IN p_treatment VARCHAR(255),
    IN p_cost DECIMAL(10, 2),
    IN p_date DATE,
    IN p_patient_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering treatment.';
    END;
    START TRANSACTION; 
        INSERT INTO treatment (
            treatment, cost, date, createdAt, updatedAt, patient_id
        ) VALUES (
            p_treatment, p_cost, p_date, NOW(), NOW(), p_patient_id
        );
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_treatment(
    IN p_id INT,
    IN p_treatment VARCHAR(255),
    IN p_cost DECIMAL(10, 2),
    IN p_date DATE,
    IN p_patient_id INT
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM treatment
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Treatment item does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Treatment item exists but is logically deleted.';
    ELSE
        UPDATE treatment
        SET 
            treatment = p_treatment,
            cost = p_cost,
            date = p_date,
            updatedAt = NOW(),
            patient_id = p_patient_id
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_treatment(
    IN p_id INT
)
BEGIN
    DECLARE treatment_exists INT;
    DECLARE treatment_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing treatment logical deletion.';
    END;
    SELECT COUNT(*)
    INTO treatment_exists
    FROM treatment
    WHERE id = p_id;
    IF treatment_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Treatment item does not exist.';
    ELSE
        SELECT status
        INTO treatment_status
        FROM treatment
        WHERE id = p_id;
        IF treatment_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Treatment item has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE treatment
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
DELIMITER ;