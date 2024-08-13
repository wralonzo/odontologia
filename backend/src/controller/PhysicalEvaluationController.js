import PhysicalEvaluation from '../model/PhysicalEvaluation.js';

const sequelize = PhysicalEvaluation.sequelize;

export const registerPhysicalEvaluation = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      blood_pressure,
      blood_sugar,
      last_treatment,
      other_data,
      patient_id
    } = req.body;

    await sequelize.query('CALL procedure_to_register_physical_evaluation(:blood_pressure, :blood_sugar, :last_treatment, :other_data, :patient_id)', {
      replacements: {
        blood_pressure,
        blood_sugar,
        last_treatment,
        other_data,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Physical Evaluation registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering Physical Evaluation.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updatePhysicalEvaluation = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      id,
      blood_pressure,
      blood_sugar,
      last_treatment,
      other_data,
      patient_id
    } = req.body;

    const existingPhysicalEvaluation = await PhysicalEvaluation.findByPk(id, { transaction });
    if (!existingPhysicalEvaluation) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Physical Evaluation record does not exist.' });
    }

    await sequelize.query('CALL procedure_to_update_physical_evaluation(:id, :blood_pressure, :blood_sugar, :last_treatment, :other_data, :patient_id)', {
      replacements: {
        id,
        blood_pressure,
        blood_sugar,
        last_treatment,
        other_data,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Physical Evaluation updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating Physical Evaluation.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyPhysicalEvaluation = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;

    const existingPhysicalEvaluation = await PhysicalEvaluation.findByPk(id);
    if (!existingPhysicalEvaluation) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Physical Evaluation record does not exist.' });
    }
    if (!existingPhysicalEvaluation.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Physical Evaluation record has already been logically deleted.' });
    }

    await sequelize.query('CALL procedure_to_delete_logically_physical_evaluation(:id)', {
      replacements: { id: id },
      transaction: transaction
    });

    await transaction.commit();
    res.status(200).json({ message: 'Physical Evaluation record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting Physical Evaluation logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const physicalEvaluationList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalPhysicalEvaluations = await PhysicalEvaluation.count({ where: { status: true } });
    const records = await PhysicalEvaluation.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalPhysicalEvaluations / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No Physical Evaluation records found.' });
    }
    res.json({
      totalPhysicalEvaluations: totalPhysicalEvaluations,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of Physical Evaluation records', error);
    res.status(500).send('Internal Server Error.');
  }
};