import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { secret } from '../config/config.js'
import User from '../model/User.js'

const sequelize = User.sequelize;

export const registerUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, last_name, phone, address, email, password, type_of_user } = req.body;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      await transaction.rollback();
      return res.status(400).json({ message: 'The email is already registered in the system.' });
    } else {
      await sequelize.query('CALL procedure_to_register_user(:name, :last_name, :phone, :address, :email, :password, :type_of_user)', {
        replacements: { name: name, last_name: last_name, phone: phone, address: address, email: email, password: hashedPassword, type_of_user: type_of_user },
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

export const userList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const numericLimit = parseInt(limit, 10);
    const numericPage = parseInt(page, 10);
    const offset = (numericPage - 1) * numericLimit;
    const totalUsers = await User.count({ where: { status: true } });
    const users = await User.findAll({
      where: { status: true },
      attributes: { exclude: ['password'] },
      limit: numericLimit,
      offset: offset
    });
    const totalPages = Math.ceil(totalUsers / numericLimit);
    if (!users || (Array.isArray(users) && users.length === 0)) {
      return res.status(404).json({ message: 'No users found.' });
    }
    res.json({
      totalUsers: totalUsers,
      totalPages: totalPages,
      currentPage: numericPage,
      users: users
    });
  } catch (error) {
    console.error('Error when displaying the list of users', error);
    res.status(500).send('Internal Server Error.');
  }
};