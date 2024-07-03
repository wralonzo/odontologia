USE dentistry_system_database;

# Procedure to register user with administrator role
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

# Procedure to login user
DELIMITER //
CREATE PROCEDURE procedure_login_user(
    IN p_email VARCHAR(50),
    IN p_password_hash VARCHAR(255)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_type_of_user VARCHAR(50);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error logging in user.';
    END;
    SELECT id, type_of_user INTO v_user_id, v_type_of_user
    FROM user
    WHERE email = p_email AND password = p_password_hash;
    IF v_user_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid email or password.';
    END IF;
    SELECT v_user_id AS user_id, v_type_of_user AS type_of_user;    
END //

# Procedure to user list 
DELIMITER // 
CREATE PROCEDURE procedure_to_user_list()
BEGIN 
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering user as administrator.';
	END;
    START TRANSACTION; 
		SELECT id, name, last_name, phone, address, email, password, type_of_user
        FROM user;
	COMMIT;
END //
