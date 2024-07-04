import { Sequelize, DataTypes } from 'sequelize';
import { bd, user, password, host, port } from '../database/database.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

const RootCanalTreatment = sequelize.define('root_canal_treatment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tooth_number: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  conductometry: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  restoration: {
    type: DataTypes.BOOLEAN,
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

export default RootCanalTreatment;