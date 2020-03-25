import { connect } from '../_db';
import { withAuth } from '../_utils/auth';

// make sure we connect to the database first
connect();

export default withAuth(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(400).send('Invalid request format');
  }

  const { account } = req.session;
  res.json(account.toObject());
});
