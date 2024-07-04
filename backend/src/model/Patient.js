import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const Patient = sequelize.define('patient', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  sex: {
    type: DataTypes.CHAR(1),
    allowNull: false
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  emergency_contact: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  emergency_phone: {
    type: DataTypes.STRING(8),
    allowNull: true,
    unique: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true
});

export default Patient;