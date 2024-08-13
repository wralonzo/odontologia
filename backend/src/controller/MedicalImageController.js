import formidable from 'formidable';
import fs from 'fs/promises';
import MedicalImage from '../model/MedicalImage.js';

const sequelize = MedicalImage.sequelize;

export const registerMedicalImage = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  const form = formidable({
    keepExtensions: true,
    multiples: false
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: 'Error parsing the form data.' });
    }
    console.log('Fields:', fields);
    console.log('Files:', files);
    try {
      const { description, patient_id } = fields;
      const imageFile = files.image_base_64;
      if (!imageFile) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }
      let imageBuffer;
      if (imageFile.filepath) {
        imageBuffer = await fs.readFile(imageFile.filepath);
      } else {
        imageBuffer = imageFile;
      }
      await sequelize.query(
        'CALL procedure_to_register_medical_image(:image_base_64, :description, :patient_id)',
        {
          replacements: {
            image_base_64: imageBuffer,
            description,
            patient_id
          },
          transaction: transaction
        }
      );
      await transaction.commit();
      res.json({ message: 'Medical image registered successfully.' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error registering medical image.', error);
      res.status(500).send('Internal Server Error.');
    }
  });
};