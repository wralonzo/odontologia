import Patient from '../model/Patient.js';

import sequelize from '../database/database.js';

export const registerPatientRecord = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      full_name, address, gender, age, emergency_contact, emergency_phone, hypertension, hypertension_control,
      diabetes, diabetes_control, hospitalization, allergy_medication, bleeding, serious_illness, pregnancy,
      pregnancy_months, recent_food, recent_symptoms, blood_pressure, blood_sugar, last_treatment,
      other_physical_data, treatment, cost, treatment_date, tooth_number, conductometry, restoration,
      other_root_canal_data
    } = req.body;
    const existingPatient = await Patient.findOne({ where: { full_name }, transaction });
    if (existingPatient) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The patient is already registered in the system.' });
    } else {
      await sequelize.query(`
        CALL procedure_to_register_patient(
          :full_name, :address, :gender, :age, :emergency_contact, :emergency_phone, :hypertension,
          :hypertension_control, :diabetes, :diabetes_control, :hospitalization, :allergy_medication, :bleeding,
          :serious_illness, :pregnancy, :pregnancy_months, :recent_food, :recent_symptoms, :blood_pressure,
          :blood_sugar, :last_treatment, :other_physical_data, :treatment, :cost, :treatment_date, :tooth_number,
          :conductometry, :restoration, :other_root_canal_data
        )`, {
        replacements: {
          full_name, address, gender, age, emergency_contact, emergency_phone, hypertension, hypertension_control,
          diabetes, diabetes_control, hospitalization, allergy_medication, bleeding, serious_illness, pregnancy,
          pregnancy_months, recent_food, recent_symptoms, blood_pressure, blood_sugar, last_treatment,
          other_physical_data, treatment, cost, treatment_date, tooth_number, conductometry, restoration,
          other_root_canal_data
        },
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