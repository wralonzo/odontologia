USE dentistry_system_database;

DELIMITER // 
CREATE PROCEDURE procedure_to_register_inventory(
    IN p_item_name VARCHAR(255),
    IN p_quantity INT,
    IN p_description TEXT
)
BEGIN 
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error registering inventory item.';
    END;
    START TRANSACTION; 
        INSERT INTO inventory (item_name, quantity, description, createdAt, updatedAt)
        VALUES (p_item_name, p_quantity, p_description, NOW(), NOW());
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_update_inventory(
    IN p_id INT,
    IN p_item_name VARCHAR(255),
    IN p_quantity INT,
    IN p_description TEXT
)
BEGIN 
    DECLARE v_existing_status BOOLEAN;
    SELECT IFNULL(status, TRUE) INTO v_existing_status
    FROM inventory
    WHERE id = p_id;
    IF v_existing_status IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory item does not exist.';
    ELSEIF v_existing_status = FALSE THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory item exists but is logically deleted.';
    ELSE
        UPDATE inventory
        SET item_name = p_item_name,
            quantity = p_quantity,
            description = p_description,
            updatedAt = NOW()
        WHERE id = p_id;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE procedure_to_delete_logically_inventory(
    IN p_id INT
)
BEGIN
    DECLARE inventory_exists INT;
    DECLARE inventory_status BOOLEAN;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error processing inventory logical deletion.';
    END;
    SELECT COUNT(*)
    INTO inventory_exists
    FROM inventory
    WHERE id = p_id;
    IF inventory_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory item does not exist.';
    ELSE
        SELECT status
        INTO inventory_status
        FROM inventory
        WHERE id = p_id;
        IF inventory_status = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Inventory item has already been logically deleted.';
        ELSE
            START TRANSACTION;
                UPDATE inventory
                SET status = false
                WHERE id = p_id;
            COMMIT;
        END IF;
    END IF;
END //
DELIMITER ;