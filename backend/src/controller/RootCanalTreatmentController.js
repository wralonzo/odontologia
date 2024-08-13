import RootCanalTreatment from '../model/RootCanalTreatment.js';

const sequelize = RootCanalTreatment.sequelize;

export const registerRootCanalTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      tooth_number,
      conductometry,
      restoration,
      other_data,
      patient_id
    } = req.body;

    await sequelize.query('CALL procedure_to_register_root_canal_treatment(:tooth_number, :conductometry, :restoration, :other_data, :patient_id)', {
      replacements: {
        tooth_number,
        conductometry,
        restoration,
        other_data,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Root canal treatment registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering root canal treatment.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateRootCanalTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      id,
      tooth_number,
      conductometry,
      restoration,
      other_data,
      patient_id
    } = req.body;

    const existingRootCanalTreatment = await RootCanalTreatment.findByPk(id, { transaction });
    if (!existingRootCanalTreatment) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Root canal treatment record does not exist.' });
    }

    await sequelize.query('CALL procedure_to_update_root_canal_treatment(:id, :tooth_number, :conductometry, :restoration, :other_data, :patient_id)', {
      replacements: {
        id,
        tooth_number,
        conductometry,
        restoration,
        other_data,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Root canal treatment updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating root canal treatment.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyRootCanalTreatment = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;

    const existingRootCanalTreatment = await RootCanalTreatment.findByPk(id);
    if (!existingRootCanalTreatment) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Root canal treatment record does not exist.' });
    }
    if (!existingRootCanalTreatment.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Root canal treatment record has already been logically deleted.' });
    }

    await sequelize.query('CALL procedure_to_delete_logically_root_canal_treatment(:id)', {
      replacements: { id: id },
      transaction: transaction
    });

    await transaction.commit();
    res.status(200).json({ message: 'Root canal treatment record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting root canal treatment logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const rootCanalTreatmentList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalRootCanalTreatments = await RootCanalTreatment.count({ where: { status: true } });
    const records = await RootCanalTreatment.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalRootCanalTreatments / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No root canal treatment records found.' });
    }
    res.json({
      totalRootCanalTreatments: totalRootCanalTreatments,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of root canal treatment records', error);
    res.status(500).send('Internal Server Error.');
  }
};