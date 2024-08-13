import HealthQuestionnaire from '../model/HealthQuestionnaire.js';

const sequelize = HealthQuestionnaire.sequelize;

export const registerHealthQuestionnaire = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      hypertension,
      hypertension_control,
      diabetes,
      diabetes_control,
      hospitalization,
      medicine_allergy,
      bleeding,
      serious_illnesses,
      pregnancy,
      pregnancy_months,
      recent_meal,
      recent_symptoms,
      patient_id
    } = req.body;

    await sequelize.query('CALL procedure_to_register_health_questionnaire(:hypertension, :hypertension_control, :diabetes, :diabetes_control, :hospitalization, :medicine_allergy, :bleeding, :serious_illnesses, :pregnancy, :pregnancy_months, :recent_meal, :recent_symptoms, :patient_id)', {
      replacements: {
        hypertension,
        hypertension_control,
        diabetes,
        diabetes_control,
        hospitalization,
        medicine_allergy,
        bleeding,
        serious_illnesses,
        pregnancy,
        pregnancy_months,
        recent_meal,
        recent_symptoms,
        patient_id
      },
      transaction: transaction
    });
    await transaction.commit();
    res.json({ message: 'Health Questionnaire registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering Health Questionnaire.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const updateHealthQuestionnaire = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      id,
      hypertension,
      hypertension_control,
      diabetes,
      diabetes_control,
      hospitalization,
      medicine_allergy,
      bleeding,
      serious_illnesses,
      pregnancy,
      pregnancy_months,
      recent_meal,
      recent_symptoms,
      patient_id
    } = req.body;

    const existingHealthQuestionnaire = await HealthQuestionnaire.findByPk(id, { transaction });
    if (!existingHealthQuestionnaire) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Health Questionnaire record does not exist.' });
    }

    await sequelize.query('CALL procedure_to_update_health_questionnaire(:id, :hypertension, :hypertension_control, :diabetes, :diabetes_control, :hospitalization, :medicine_allergy, :bleeding, :serious_illnesses, :pregnancy, :pregnancy_months, :recent_meal, :recent_symptoms, :patient_id)', {
      replacements: {
        id,
        hypertension,
        hypertension_control,
        diabetes,
        diabetes_control,
        hospitalization,
        medicine_allergy,
        bleeding,
        serious_illnesses,
        pregnancy,
        pregnancy_months,
        recent_meal,
        recent_symptoms,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Health Questionnaire updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating Health Questionnaire.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyHealthQuestionnaire = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;

    const existingHealthQuestionnaire = await HealthQuestionnaire.findByPk(id);
    if (!existingHealthQuestionnaire) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Health Questionnaire record does not exist.' });
    }
    if (!existingHealthQuestionnaire.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Health Questionnaire record has already been logically deleted.' });
    }

    await sequelize.query('CALL procedure_to_delete_logically_health_questionnaire(:id)', {
      replacements: { id: id },
      transaction: transaction
    });

    await transaction.commit();
    res.status(200).json({ message: 'Health Questionnaire record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting Health Questionnaire logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const healthQuestionnaireList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalHealthQuestionnaires = await HealthQuestionnaire.count({ where: { status: true } });
    const records = await HealthQuestionnaire.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalHealthQuestionnaires / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No Health Questionnaire records found.' });
    }
    res.json({
      totalHealthQuestionnaires: totalHealthQuestionnaires,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of Health Questionnaire records', error);
    res.status(500).send('Internal Server Error.');
  }
};