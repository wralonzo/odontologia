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