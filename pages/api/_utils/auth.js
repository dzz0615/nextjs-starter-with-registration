import jwt from 'jsonwebtoken';
import Account from '../_db/account';
import { connect } from '../_db';

const JwtSecret = 'eko-sophia-secret';

// make sure we are connected to db
connect();

export function generateToken(accountId) {
  return jwt.sign({ accountId }, JwtSecret, {
    expiresIn: '365d', // expires in a year
  });
}

// higher order function for processing api requests
export const withAuth = fn => async (req, res) => {
  if (!req.headers || !('authorization' in req.headers)) {
    return res.status(401).send('Authorization header missing');
  }

  const auth = req.headers.authorization;

  try {
    const { token } = JSON.parse(auth);
    const { accountId } = jwt.verify(token, JwtSecret);

    const account = await Account.findById(accountId).exec();
    if (!account) {
      return res.status(401).send('Account does not exist');
    }

    // attach account to session object so request handler can access it
    req.session = { account };
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).send('Token expired');
    }

    console.warn('Authorizing error', e);
    return res.status(401).send('Error authorizing');
  }

  return fn(req, res);
};
