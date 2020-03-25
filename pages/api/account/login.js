import bcrypt from 'bcrypt';
import { connect } from '../_db';
import { generateToken } from '../_utils/auth';
import Account from '../_db/account';

// make sure we connect to the database first
connect();

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).send('Invalid request format');
  }

  const { email, password } = req.body;

  const account = await Account.findOne({ email });
  if (!account) {
    return res.status(400).send('Account not found.');
  }

  if (bcrypt.compareSync(password, account.password)) {
    // login success, generate token and send back
    const token = generateToken(account._id);
    return res.json({ token });
  } else {
    // login failed
    return res.status(400).send('Incorrect password.');
  }
};
