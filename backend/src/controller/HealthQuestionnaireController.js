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

export const findHealthQuestionnaireByPatientId = async (req, res, next) => {
  try {
    const { patient_id } = req.params;
    const healthQuestionnaire = await HealthQuestionnaire.findOne({
      where: { patient_id: patient_id }
    });
    if (!healthQuestionnaire) {
      return res.status(404).json({ message: 'No se encontró un registro de Health Questionnaire para el patient_id proporcionado.' });
    }
    res.json(healthQuestionnaire);
  } catch (error) {
    console.error('Error al buscar el Health Questionnaire por patient_id.', error);
    res.status(500).send('Internal Server Error.');
  }
};