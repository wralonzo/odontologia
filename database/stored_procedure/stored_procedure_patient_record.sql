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
