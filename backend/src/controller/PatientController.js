import Patient from '../model/Patient.js';

const sequelize = Patient.sequelize;

export const registerPatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { full_name, address, sex, birth_date, emergency_contact, emergency_phone } = req.body;
    const existingPatient = await Patient.findOne({ where: { full_name }, transaction });
    if (existingPatient) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The patient is already registered in the system.' });
    } else {
      await sequelize.query('CALL procedure_to_register_patient(:full_name, :address, :sex, :birth_date, :emergency_contact, :emergency_phone)', {
        replacements: { full_name, address, sex, birth_date, emergency_contact, emergency_phone },
        transaction
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

export const updatePatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id, full_name, address, sex, birth_date, emergency_contact, emergency_phone } = req.body;
    const existingPatient = await Patient.findByPk(id, { transaction });
    if (!existingPatient) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Patient does not exist.' });
    }
    if (existingPatient.status === false) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Patient exists but is logically deleted.' });
    }
    await sequelize.query('CALL procedure_to_update_patient(:id, :full_name, :address, :sex, :birth_date, :emergency_contact, :emergency_phone)', {
      replacements: { id, full_name, address, sex, birth_date, emergency_contact, emergency_phone },
      transaction
    });
    await transaction.commit();
    res.json({ message: 'Patient updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating patient.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyPatient = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;
    const existingPatient = await Patient.findByPk(id);
    if (!existingPatient) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Patient does not exist.' });
    }
    if (!existingPatient.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Patient has already been logically deleted.' });
    }
    await sequelize.query('CALL procedure_to_delete_logically_patient(:id)', {
      replacements: { id },
      transaction
    });
    await transaction.commit();
    res.status(200).json({ message: 'Patient logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting patient logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const patientList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalPatients = await Patient.count({ where: { status: true } });
    const patients = await Patient.findAll({
      where: { status: true },
      limit: numericLimit,
      offset
    });
    const totalPages = Math.ceil(totalPatients / numericLimit);
    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: 'No patients found.' });
    }
    res.json({
      totalPatients,
      totalPages,
      currentPage: numericPage,
      patients
    });
  } catch (error) {
    console.error('Error when displaying the list of patients', error);
    res.status(500).send('Internal Server Error.');
  }
};