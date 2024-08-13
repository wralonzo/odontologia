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