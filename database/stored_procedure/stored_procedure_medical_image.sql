USE dentistry_system_database;

DELIMITER //
CREATE PROCEDURE procedure_to_register_medical_image(
    IN p_image_base_64 LONGBLOB,
    IN p_description TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering medical image.';
    END;
    START TRANSACTION; 
        INSERT INTO medical_image (
            image_base_64, description, createdAt, updatedAt, patient_id
        ) VALUES (
            p_image_base_64, p_description, NOW(), NOW(), p_patient_id
        );
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_medical_image(
    IN p_id INT,
    IN p_image_base_64 LONGBLOB,
    IN p_description TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM medical_image
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Medical image item does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Medical image item exists but is logically deleted.';
    ELSE
        UPDATE medical_image
        SET 
            image_base_64 = p_image_base_64,
            description = p_description,
            updatedAt = NOW(),
            patient_id = p_patient_id
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_medical_image(
    IN p_id INT
)
BEGIN
    DECLARE medical_image_exists INT;
    DECLARE medical_image_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing medical image logical deletion.';
    END;
    SELECT COUNT(*)
    INTO medical_image_exists
    FROM medical_image
    WHERE id = p_id;
    IF medical_image_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Medical image item does not exist.';
    ELSE
        SELECT status
        INTO medical_image_status
        FROM medical_image
        WHERE id = p_id;
        IF medical_image_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Medical image item has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE medical_image
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
DELIMITER ;