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