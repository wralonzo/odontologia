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