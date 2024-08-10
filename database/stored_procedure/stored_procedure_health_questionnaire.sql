USE dentistry_system_database;

DELIMITER //
CREATE PROCEDURE procedure_to_register_health_questionnaire(
    IN p_hypertension BOOLEAN,
    IN p_hypertension_control BOOLEAN,
    IN p_diabetes BOOLEAN,
    IN p_diabetes_control BOOLEAN,
    IN p_hospitalization BOOLEAN,
    IN p_medicine_allergy BOOLEAN,
    IN p_bleeding BOOLEAN,
    IN p_serious_illnesses TEXT,
    IN p_pregnancy BOOLEAN,
    IN p_pregnancy_months INT,
    IN p_recent_meal BOOLEAN,
    IN p_recent_symptoms BOOLEAN,
    IN p_patient_id INT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering health questionnaire.';
    END;
    START TRANSACTION; 
        INSERT INTO health_questionnaire (
            hypertension, hypertension_control, diabetes, diabetes_control, hospitalization,
            medicine_allergy, bleeding, serious_illnesses, pregnancy, pregnancy_months,
            recent_meal, recent_symptoms, createdAt, updatedAt, patient_id
        ) VALUES (
            p_hypertension, p_hypertension_control, p_diabetes, p_diabetes_control, p_hospitalization,
            p_medicine_allergy, p_bleeding, p_serious_illnesses, p_pregnancy, p_pregnancy_months,
            p_recent_meal, p_recent_symptoms, NOW(), NOW(), p_patient_id
        );
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_health_questionnaire(
    IN p_id INT,
    IN p_hypertension BOOLEAN,
    IN p_hypertension_control BOOLEAN,
    IN p_diabetes BOOLEAN,
    IN p_diabetes_control BOOLEAN,
    IN p_hospitalization BOOLEAN,
    IN p_medicine_allergy BOOLEAN,
    IN p_bleeding BOOLEAN,
    IN p_serious_illnesses TEXT,
    IN p_pregnancy BOOLEAN,
    IN p_pregnancy_months INT,
    IN p_recent_meal BOOLEAN,
    IN p_recent_symptoms BOOLEAN, 
    IN p_patient_id INT
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM health_questionnaire
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Health questionnaire item does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Health questionnaire item exists but is logically deleted.';
    ELSE
        UPDATE health_questionnaire
        SET 
            hypertension = p_hypertension,
            hypertension_control = p_hypertension_control,
            diabetes = p_diabetes,
            diabetes_control = p_diabetes_control,
            hospitalization = p_hospitalization,
            medicine_allergy = p_medicine_allergy,
            bleeding = p_bleeding,
            serious_illnesses = p_serious_illnesses,
            pregnancy = p_pregnancy,
            pregnancy_months = p_pregnancy_months,
            recent_meal = p_recent_meal,
            recent_symptoms = p_recent_symptoms,
            updatedAt = NOW(),
            patient_id = p_patient_id
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_health_questionnaire(
    IN p_id INT
)
BEGIN
    DECLARE health_questionnaire_exists INT;
    DECLARE health_questionnaire_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing health questionnaire logical deletion.';
    END;
    SELECT COUNT(*)
    INTO health_questionnaire_exists
    FROM health_questionnaire
    WHERE id = p_id;
    IF health_questionnaire_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Health questionnaire item does not exist.';
    ELSE
        SELECT status
        INTO health_questionnaire_status
        FROM health_questionnaire
        WHERE id = p_id;
        IF health_questionnaire_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Health questionnaire item has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE health_questionnaire
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
DELIMITER ;