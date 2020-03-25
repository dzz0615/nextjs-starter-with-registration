import Router from 'next/router';
import { Button } from 'antd';
import { getWithAuth, setToken } from '../utils/request';

const onLogOut = () => {
  setToken(null);
  Router.push('/');
};

const Profile = () => {
  return (
    <>
      <Button onClick={onLogOut} danger>
        Log out
      </Button>
    </>
  );
};

export default Profile;
