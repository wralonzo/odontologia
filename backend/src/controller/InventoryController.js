import Inventory from '../model/Inventory.js';

const sequelize = Inventory.sequelize;

export const registerInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { item_name, quantity, description } = req.body;
    await sequelize.query('CALL procedure_to_register_inventory(:item_name, :quantity, :description)', {
      replacements: { item_name: item_name, quantity: quantity, description: description },
      transaction: transaction
    });
    await transaction.commit();
    res.json({ message: 'Inventory registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering inventory.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, item_name, quantity, description } = req.body;
    const existingRecord = await Inventory.findByPk(id, { transaction });
    if (!existingRecord) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Inventory record does not exist.' });
    }
    await sequelize.query('CALL procedure_to_update_inventory(:id, :item_name, :quantity, :description)', {
      replacements: { id: id, item_name: item_name, quantity: quantity, description: description },
      transaction: transaction
    });
    await transaction.commit();
    res.json({ message: 'Inventory updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating inventory.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingRecord = await Inventory.findByPk(id);
    if (!existingRecord) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Inventory record does not exist.' });
    }
    if (!existingRecord.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Inventory record has already been logically deleted.' });
    }
    await sequelize.query('CALL procedure_to_delete_logically_inventory(:id)', {
      replacements: { id: id },
      transaction: transaction
    });
    await transaction.commit();
    res.status(200).json({ message: 'Inventory record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting inventory logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const inventoryList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 30);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalRecords = await Inventory.count({ where: { status: true } });
    const records = await Inventory.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalRecords / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No inventory records found.' });
    }
    res.json({
      totalRecords: totalRecords,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of inventory records', error);
    res.status(500).send('Internal Server Error.');
  }
};