import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const PhysicalEvaluation = sequelize.define('physical_evaluation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blood_pressure: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  blood_sugar: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  last_treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  other_data: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

export default PhysicalEvaluation;