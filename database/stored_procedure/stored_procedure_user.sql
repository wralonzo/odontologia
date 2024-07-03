USE dentistry_system_database;

# Procedure to register user
DELIMITER // 
CREATE PROCEDURE procedure_to_register_user(
	IN p_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_phone VARCHAR(8),
    IN p_address VARCHAR(255),
    IN p_email VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_type_of_user VARCHAR(50)
)
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering user as administrator.';
	END;
    START TRANSACTION; 
		INSERT INTO user (name, last_name, phone, address, email, password, type_of_user, createdAt, updatedAt)
		VALUES (p_name, p_last_name, p_phone, p_address, p_email, p_password, p_type_of_user, NOW(), NOW());
	COMMIT;
END //

# Procedure to update user
DELIMITER //
CREATE PROCEDURE procedure_to_update_user(
    IN p_id INT,
    IN p_name VARCHAR(50),
    IN p_last_name VARCHAR(50),
    IN p_phone VARCHAR(8),
    IN p_address VARCHAR(255),
    IN p_email VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_type_of_user VARCHAR(50)
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM user
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User exists but is logically deleted.';
    ELSE
        UPDATE user
        SET name = p_name,
            last_name = p_last_name,
            phone = p_phone,
            address = p_address,
            email = p_email,
            password = p_password,
            type_of_user = p_type_of_user,
            updatedAt = NOW()
        WHERE id = p_id;
    END IF;
END //

# Procedure to login user
DELIMITER //
CREATE PROCEDURE procedure_login_user(
    IN p_email VARCHAR(50),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_type_of_user VARCHAR(50);
    DECLARE v_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error logging in user.';
    END;
    SELECT id, type_of_user, status INTO v_user_id, v_type_of_user, v_status
    FROM user
    WHERE email = p_email AND password = p_password_hash;
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email or password.';
    ELSEIF v_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User account is inactive.';
    END IF;
    SELECT v_user_id AS user_id, v_type_of_user AS type_of_user;    
END //

# Procedure to Delete logically user
DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_user(
    IN p_id INT
)
BEGIN
    DECLARE user_exists INT;
    DECLARE user_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing user logical deletion.';
    END;
    SELECT COUNT(*)
    INTO user_exists
    FROM user
    WHERE id = p_id;
    IF user_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User does not exist.';
    ELSE
        SELECT status
        INTO user_status
        FROM user
        WHERE id = p_id;
        IF user_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE user
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
