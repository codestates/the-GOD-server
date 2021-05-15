import axios from 'axios';
import { iGoogleLoginProps, iGoogleLoginResult } from '@interface';

// NOTE : example for creating Axios instance
const api = axios.create({
  baseURL: 'baseURL',
});

// NOTE: example API this function is not work
const googleLogin = async ({
  token,
}: iGoogleLoginProps): Promise<iGoogleLoginResult> => {
  const { status, data } = await api.get('URL', {
    params: {
      token,
    },
  });

  return {
    userName: 'tester',
    profileUrl: 'imageURL',
  };
};

export default { googleLogin };
