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