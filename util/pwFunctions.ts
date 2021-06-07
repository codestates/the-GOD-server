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

export const getDateTimeString = (): string => {
  const dateTime = new Date();
  const year = dateTime.getFullYear().toString().padStart(4, '0');
  const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
  const date = dateTime.getDate().toString().padStart(2, '0');
  const hours = dateTime.getHours().toString().padStart(2, '0');
  const minutes = dateTime.getMinutes().toString().padStart(2, '0');
  const seconds = dateTime.getSeconds().toString().padStart(2, '0');

  const dateTimeString = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  return dateTimeString;
};
