import TreatmentPlan from '../model/TreatmentPlan.js';

const sequelize = TreatmentPlan.sequelize;

export const registerTreatmentPlan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { plan_details, estimated_cost } = req.body;
    await sequelize.query('CALL procedure_to_register_treatment_plan(:plan_details, :estimated_cost)', {
      replacements: { plan_details: plan_details, estimated_cost: estimated_cost },
      transaction: transaction
    });
    await transaction.commit();
    res.json({ message: 'Treatment Plan registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering Treatment Plan.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateTreatmentPlan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, plan_details, estimated_cost } = req.body;
    const existingTreatmentPlan = await TreatmentPlan.findByPk(id, { transaction });
    if (!existingTreatmentPlan) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment Plan record does not exist.' });
    }
    await sequelize.query('CALL procedure_to_update_treatment_plan(:id, :plan_details, :estimated_cost)', {
      replacements: { id: id, plan_details: plan_details, estimated_cost: estimated_cost },
      transaction: transaction
    });
    await transaction.commit();
    res.json({ message: 'Treatment Plan updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating Treatment Plan.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyTreatmentPlan = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingTreatmentPlan = await TreatmentPlan.findByPk(id);
    if (!existingTreatmentPlan) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Treatment Plan record does not exist.' });
    }
    if (!existingTreatmentPlan.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Treatment Plan record has already been logically deleted.' });
    }
    await sequelize.query('CALL procedure_to_delete_logically_treatment_plan(:id)', {
      replacements: { id: id },
      transaction: transaction
    });
    await transaction.commit();
    res.status(200).json({ message: 'Treatment Plan record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting Treatment Plan logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const treatmentPlanList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 30);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalTreatmentPlans = await TreatmentPlan.count({ where: { status: true } });
    const records = await TreatmentPlan.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalTreatmentPlans / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No Treatments Plan records found.' });
    }
    res.json({
      totalTreatmentPlans: totalTreatmentPlans,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of Treatments Plan records', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const treatmentPlanListNotPage = async (req, res, next) => {
  try {
    const records = await TreatmentPlan.findAll({
      where: { status: true }
    });
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No se encontraron registros de Planes de Tratamiento.' });
    }
    res.json({
      totalTreatmentPlans: records.length,
      records: records
    });
  } catch (error) {
    console.error('Error al mostrar la lista de registros de Planes de Tratamiento', error);
    res.status(500).send('Error Interno del Servidor.');
  }
};