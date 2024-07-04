USE dentistry_system_database;

# Procedure to register patient
USE dentistry_system_database;

DELIMITER //

CREATE PROCEDURE procedure_to_register_appo(
    IN p_patient_id INT,
    IN p_appointment_datetime DATETIME,
    IN p_reason VARCHAR(255),
    IN p_notes TEXT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering appointment.';
    END;
    DECLARE v_schedule_id INT;
    START TRANSACTION;
        INSERT INTO appointment (patient_id, appointment_datetime, reason, notes, createdAt, updatedAt)
        VALUES (p_patient_id, p_appointment_datetime, p_reason, p_notes, NOW(), NOW());
        SELECT LAST_INSERT_ID() INTO v_schedule_id;
        INSERT INTO schedule (appointment_id, date, status, createdAt, updatedAt)
        VALUES (v_schedule_id, DATE(p_appointment_datetime), true, NOW(), NOW());        
    COMMIT;
END //
