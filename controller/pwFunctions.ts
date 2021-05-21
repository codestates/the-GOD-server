import crypto from 'crypto';

export const createPWD = (email: string, password: string) => {
  const hashedPWD: string = crypto
    .createHash('sha512')
    .update(password)
    .digest('base64'); // 사용자가 입력한 비밀번호 해싱(크립토)               // 사용자가 입력한 이메일 솔팅
  crypto.pbkdf2(
    password,
    email,
    100000,
    64,
    'sha512',
    (err: Error | null, key: Buffer) => {
      console.log(key.toString('base64'));
      return key.toString('base64');
    }
  );
  return hashedPWD + password;
};
