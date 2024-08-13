import MedicalImage from '../model/MedicalImage.js';

const sequelize = MedicalImage.sequelize;

export const registerMedicalImage = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      image_base_64,
      description,
      patient_id
    } = req.body;

    await sequelize.query('CALL procedure_to_register_medical_image(:image_base_64, :description, :patient_id)', {
      replacements: {
        image_base_64,
        description,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Medical image registered successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering medical image.', error);
    res.status(500).send('Internal Server Error.');
  }
};