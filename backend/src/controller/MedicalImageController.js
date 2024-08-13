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

export const updateMedicalImage = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      id,
      image_base_64,
      description,
      patient_id
    } = req.body;

    const existingMedicalImage = await MedicalImage.findByPk(id, { transaction });
    if (!existingMedicalImage) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Medical image record does not exist.' });
    }

    await sequelize.query('CALL procedure_to_update_medical_image(:id, :image_base_64, :description, :patient_id)', {
      replacements: {
        id,
        image_base_64,
        description,
        patient_id
      },
      transaction: transaction
    });

    await transaction.commit();
    res.json({ message: 'Medical image updated successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating medical image.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const deleteLogicallyMedicalImage = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.body;

    const existingMedicalImage = await MedicalImage.findByPk(id);
    if (!existingMedicalImage) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Medical image record does not exist.' });
    }
    if (!existingMedicalImage.status) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Medical image record has already been logically deleted.' });
    }

    await sequelize.query('CALL procedure_to_delete_logically_medical_image(:id)', {
      replacements: { id: id },
      transaction: transaction
    });

    await transaction.commit();
    res.status(200).json({ message: 'Medical image record logically deleted successfully.' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting medical image logically.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const medicalImageList = async (req, res, next) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalMedicalImages = await MedicalImage.count({ where: { status: true } });
    const records = await MedicalImage.findAll({
      where: { status: true },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalMedicalImages / numericLimit);
    if (!records || (Array.isArray(records) && records.length === 0)) {
      return res.status(404).json({ message: 'No medical image records found.' });
    }
    res.json({
      totalMedicalImages: totalMedicalImages,
      totalPages: totalPages,
      currentPage: numericPage,
      records: records
    });
  } catch (error) {
    console.error('Error when displaying the list of medical image records', error);
    res.status(500).send('Internal Server Error.');
  }
};