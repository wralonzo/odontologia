import Patient from '../model/Patient.js';

const sequelize = Patient.sequelize;

export const registerPatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { full_name, address, gender, age, emergency_contact, emergency_phone } = req.body;
    const existingPatient = await Patient.findOne({ where: { full_name }, transaction });
    if (existingPatient) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The patient is already registered in the system.' });
    } else {
      await sequelize.query('CALL procedure_to_register_patient_record(:full_name, :address, :gender, :age, :emergency_contact, :emergency_phone)', {
        replacements: { full_name, address, gender, age, emergency_contact, emergency_phone },
        transaction: transaction
      });
    }
    await transaction.commit();
    res.status(201).json({ message: 'Patient record created successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering patient record.', error);
    res.status(500).send('Internal Server Error.');
  }
};