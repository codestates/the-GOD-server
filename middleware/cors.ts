import cors from 'cors';

const corsOption = {
  origin: true,
  method: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

export default cors(corsOption);
