USE dentistry_system_database;

DELIMITER //
CREATE PROCEDURE procedure_to_register_root_canal_treatment(
    IN p_tooth_number VARCHAR(50),
    IN p_conductometry TEXT,
    IN p_restoration BOOLEAN,
    IN p_other_data TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering root canal treatment.';
    END;
    START TRANSACTION; 
        INSERT INTO root_canal_treatment (
            tooth_number, conductometry, restoration, other_data, createdAt, updatedAt, patient_id
        ) VALUES (
            p_tooth_number, p_conductometry, p_restoration, p_other_data, NOW(), NOW(), p_patient_id
        );
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_root_canal_treatment(
    IN p_id INT,
    IN p_tooth_number VARCHAR(50),
    IN p_conductometry TEXT,
    IN p_restoration BOOLEAN,
    IN p_other_data TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM root_canal_treatment
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Root canal treatment item does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Root canal treatment item exists but is logically deleted.';
    ELSE
        UPDATE root_canal_treatment
        SET 
            tooth_number = p_tooth_number,
            conductometry = p_conductometry,
            restoration = p_restoration,
            other_data = p_other_data,
            updatedAt = NOW(),
            patient_id = p_patient_id
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_root_canal_treatment(
    IN p_id INT
)
BEGIN
    DECLARE root_canal_treatment_exists INT;
    DECLARE root_canal_treatment_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing root canal treatment logical deletion.';
    END;
    SELECT COUNT(*)
    INTO root_canal_treatment_exists
    FROM root_canal_treatment
    WHERE id = p_id;
    IF root_canal_treatment_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Root canal treatment item does not exist.';
    ELSE
        SELECT status
        INTO root_canal_treatment_status
        FROM root_canal_treatment
        WHERE id = p_id;
        IF root_canal_treatment_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Root canal treatment item has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE root_canal_treatment
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
DELIMITER ;