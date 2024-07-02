import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { secret } from '../config/config.js'
import User from '../model/User.js'

const sequelize = User.sequelize;

export const registerUserAdministrator = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, last_name, phone, address, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The email is already registered in the system.' });
    } else {
      await sequelize.query('CALL procedure_to_register_user_with_administrator_role(:name, :last_name, :phone, :address, :email, :password)', {
        replacements: { name: name, last_name: last_name, phone: phone, address: address, email: email, password: hashedPassword },
        transaction: transaction
      });
    }
    const userCreated = await User.findOne({ where: { email }, transaction });
    const token = jwt.sign({
      id: userCreated.id,
      email: userCreated.email,
      type_of_user: userCreated.type_of_user
    }, secret, { expiresIn: 60 * 30 }
    );
    await transaction.commit();
    res.json({ auth: true, token: token });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering user as administrator.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const registerUserSecretary = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, last_name, phone, address, email, password } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The email is already registered in the system.' });
    } else {
      await sequelize.query('CALL procedure_to_register_user_with_secretary_role(:name, :last_name, :phone, :address, :email, :password)', {
        replacements: { name: name, last_name: last_name, phone: phone, address: address, email: email, password: hashedPassword },
        transaction: transaction
      });
    }
    const userCreated = await User.findOne({ where: { email }, transaction });
    const token = jwt.sign({
      id: userCreated.id,
      email: userCreated.email,
      type_of_user: userCreated.type_of_user
    }, secret, { expiresIn: 60 * 30 }
    );
    await transaction.commit();
    res.json({ auth: true, token: token });
  } catch (error) {
    await transaction.rollback();
    console.error('Error registering user as administrator.', error);
    res.status(500).send('Internal Server Error.');
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const passwordIsValid = await bcryptjs.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }
    const [results] = await sequelize.query('CALL procedure_login_user(:email, :password_hash)', {
      replacements: { email: email, password_hash: user.password }
    });
    const token = jwt.sign({
      id: results.user_id,
      email: email,
      type_of_user: results.type_of_user
    }, secret, { expiresIn: 60 * 30 });
    res.json({ auth: true, token: token });
  } catch (error) {
    console.error('Error logging in user.', error);
    res.status(500).send('Internal Server Error.');
  }
};