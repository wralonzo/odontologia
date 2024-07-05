USE dentistry_system_database;

# Procedure to register appointment and schedule
DELIMITER //
CREATE PROCEDURE procedure_to_register_appointment_schedule(
    IN p_appointment_datetime DATETIME,
    IN p_reason VARCHAR(255),
    IN p_notes TEXT,
    IN p_patient_id INT
)
BEGIN 
    DECLARE v_appointment_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering appointment and schedule.';
    END;
    START TRANSACTION;
        INSERT INTO appointment (appointment_datetime, reason, notes, createdAt, updatedAt, patient_id)
        VALUES (p_appointment_datetime, p_reason, p_notes, NOW(), NOW(), p_patient_id);
        SELECT LAST_INSERT_ID() INTO v_appointment_id;
        INSERT INTO schedule (date, createdAt, updatedAt, appointment_id)
        VALUES (DATE(p_appointment_datetime), NOW(), NOW(), v_appointment_id);        
    COMMIT;
END //

# Procedure to update appointment and schedule
DELIMITER //
CREATE PROCEDURE procedure_to_update_appointment_schedule(
    IN p_id INT,
    IN p_appointment_datetime DATETIME,
    IN p_reason VARCHAR(255),
    IN p_notes TEXT,
    IN p_state ENUM('SCHEDULED', 'CANCELED', 'COMPLETED')
)
BEGIN 
    DECLARE v_schedule_id INT;
    DECLARE v_old_status ENUM('SCHEDULED', 'CANCELED', 'COMPLETED');
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error updating appointment and schedule.';
    END;
    START TRANSACTION;
    SELECT state INTO v_old_status
    FROM appointment
    WHERE id = p_id;
    UPDATE appointment
    SET appointment_datetime = p_appointment_datetime,
        reason = p_reason,
        notes = p_notes,
        state = p_state,
        updatedAt = NOW()
    WHERE id = p_id;
    IF v_old_status = 'SCHEDULED' AND p_state = 'SCHEDULED' THEN
        SELECT id INTO v_schedule_id
        FROM schedule
        WHERE appointment_id = p_id;
        IF v_schedule_id IS NOT NULL THEN
            UPDATE schedule
            SET date = p_appointment_datetime,
                updatedAt = NOW()
            WHERE id = v_schedule_id;
        END IF;
    END IF;
    IF v_old_status = 'SCHEDULED' AND p_state = 'CANCELED' THEN
        SELECT id INTO v_schedule_id
        FROM schedule
        WHERE appointment_id = p_id;
        IF v_schedule_id IS NOT NULL THEN
            UPDATE schedule
            SET status = FALSE,
                updatedAt = NOW()
            WHERE id = v_schedule_id;
        END IF;
    END IF;
    IF v_old_status = 'SCHEDULED' AND p_state = 'COMPLETED' THEN
        SELECT id INTO v_schedule_id
        FROM schedule
        WHERE appointment_id = p_id;
        IF v_schedule_id IS NOT NULL THEN
            UPDATE schedule
            SET status = FALSE,
                updatedAt = NOW()
            WHERE id = v_schedule_id;
        END IF;
        UPDATE appointment
        SET status = FALSE,
            updatedAt = NOW()
        WHERE id = p_id;
    END IF;
    IF v_old_status = 'CANCELED' AND p_state = 'SCHEDULED' THEN
        SELECT id INTO v_schedule_id
        FROM schedule
        WHERE appointment_id = p_id;
        IF v_schedule_id IS NOT NULL THEN
            UPDATE schedule
            SET status = TRUE,
                updatedAt = NOW()
            WHERE id = v_schedule_id;
        END IF;
    END IF;
    COMMIT;
END //

# Procedure to Delete logically appointment and schedule
DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_appointment_schedule(
    IN p_appointment_id INT
)
BEGIN
    DECLARE appointment_exists INT;
    DECLARE appointment_status BOOLEAN;
    DECLARE v_schedule_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing appointment logical deletion.';
    END;
    SELECT COUNT(*)
    INTO appointment_exists
    FROM appointment
    WHERE id = p_appointment_id;
    IF appointment_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment does not exist.';
    ELSE
        SELECT status
        INTO appointment_status
        FROM appointment
        WHERE id = p_appointment_id;
        IF appointment_status = false THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE appointment
                SET status = false,
                    updatedAt = NOW()
                WHERE id = p_appointment_id;
                SELECT id INTO v_schedule_id
                FROM schedule
                WHERE appointment_id = p_appointment_id;
                IF v_schedule_id IS NOT NULL THEN
                    UPDATE schedule
                    SET status = false,
                        updatedAt = NOW()
                    WHERE id = v_schedule_id;
                END IF;                
            COMMIT;
        END IF;
    END IF;
END //
