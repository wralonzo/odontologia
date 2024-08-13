import Treatment from '../model/Treatment.js';

const sequelize = Treatment.sequelize;

export const registerTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      treatment,
      cost,
      date,
      patient_id
    } = req.body;

    await sequelize.query('CALL procedure_to_register_treatment(:treatment, :cost, :date, :patient_id)', {
      replacements: {
        treatment,
        cost,
        date,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Treatment registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering treatment.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      id,
      treatment,
      cost,
      date,
      patient_id
    } = req.body;

    const existingTreatment = await Treatment.findByPk(id, { transaction });
    if (!existingTreatment) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment record does not exist.' });
    }

    await sequelize.query('CALL procedure_to_update_treatment(:id, :treatment, :cost, :date, :patient_id)', {
      replacements: {
        id,
        treatment,
        cost,
        date,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Treatment updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating treatment.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;

    const existingTreatment = await Treatment.findByPk(id);
    if (!existingTreatment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Treatment record does not exist.' });
    }
    if (!existingTreatment.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment record has already been logically deleted.' });
    }

    await sequelize.query('CALL procedure_to_delete_logically_treatment(:id)', {
      replacements: { id: id },
      transaction: transaction
    });

    await transaction.commit();
    res.status(200).json({ message: 'Treatment record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting treatment logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const treatmentList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalTreatments = await Treatment.count({ where: { status: true } });
    const records = await Treatment.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalTreatments / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No treatment records found.' });
    }
    res.json({
      totalTreatments: totalTreatments,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of treatment records', error);
    res.status(500).send('Internal Server Error.');
  }
};