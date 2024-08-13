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