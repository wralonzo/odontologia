import { Sequelize } from 'sequelize'
import { bd, user, password, host, port } from './src/database/database.js'

// Import Models
import User from './src/model/User.js';
import Patient from './src/model/Patient.js';
import HealthQuestionnaire from './src/model/HealthQuestionnaire.js';
import PhysicalEvaluation from './src/model/PhysicalEvaluation.js';
import Treatment from './src/model/Treatment.js';
import RootCanalTreatment from './src/model/RootCanalTreatment.js';
import Appointment from './src/model/Appointment.js';
import Schedule from './src/model/Schedule.js';
import ClinicalHistory from './src/model/ClinicalHistory.js';
import Inventory from './src/model/Inventory.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

Patient.hasOne(HealthQuestionnaire, { foreignKey: 'patient_id' });
HealthQuestionnaire.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasOne(PhysicalEvaluation, { foreignKey: 'patient_id' });
PhysicalEvaluation.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Treatment, { foreignKey: 'patient_id' });
Treatment.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(RootCanalTreatment, { foreignKey: 'patient_id' });
RootCanalTreatment.belongsTo(Patient, { foreignKey: 'patient_id' });
Patient.hasMany(Appointment, { foreignKey: 'patient_id' });
Appointment.belongsTo(Patient, { foreignKey: 'patient_id' });
Appointment.hasOne(Schedule, { foreignKey: 'appointment_id' });
Schedule.belongsTo(Appointment, { foreignKey: 'appointment_id' });
Patient.hasMany(ClinicalHistory, {foreignKey: 'patient_id'});
ClinicalHistory.belongsTo(Patient, { foreignKey: 'patient_id' });

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established with the database.');
    await User.sync();
    await Patient.sync();
    await HealthQuestionnaire.sync();
    await PhysicalEvaluation.sync();
    await Treatment.sync();
    await RootCanalTreatment.sync();
    await Appointment.sync();
    await Schedule.sync();
    await ClinicalHistory.sync();
    await Inventory.sync();
    console.log('All tables have been created.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await sequelize.close();
  }
})();