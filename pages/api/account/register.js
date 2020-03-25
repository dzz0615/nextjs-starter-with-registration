import bcrypt from 'bcrypt';
import { connect } from '../_db';
import { generateToken } from '../_utils/auth';
import Account from '../_db/account';

// make sure we connect to the database first
connect();

// make sure password meets min requirement
// returns true if valid
function validatePassword(password) {
  return password && password.length >= 6;
}

function validateEmail(email = '') {
  // just do a stupidly simple email validator
  return email.indexOf('@') !== -1;
}

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).send('Invalid request format');
  }

  const { name, email, password } = req.body;

  if (!validatePassword(password)) {
    return res.status(400).send('Password invalid.');
  }

  if (!validateEmail(email)) {
    return res.status(400).send('Email invalid.');
  }

  let hash = bcrypt.hashSync(password, 10);

  const account = new Account({
    name: name,
    email: email,
    password: hash,
  });

  try {
    await account.save();
  } catch (e) {
    return res
      .status(400)
      .send(
        'Cannot register account, please make sure the email is not already used.',
      );
  }

  // if registeration is successful, auto log in by sendinb back token
  const token = generateToken(account._id);
  return res.json({ token });
};
