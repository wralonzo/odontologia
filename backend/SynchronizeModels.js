import { Sequelize } from 'sequelize'
import { bd, user, password, host, port } from './src/database/database.js'

// Import Models
import User from './src/model/User.js';

const sequelize = new Sequelize(bd, user, password, {
  host: host,
  port: port,
  dialect: 'mysql'
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection established with the database.');
    await User.sync();
    console.log('All tables have been created.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    await sequelize.close();
  }
})();