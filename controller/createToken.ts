import env from 'dotenv';
const jwt = require('jsonwebtoken');
import {payload} from '../interface/auth'

env.config();
const ENV = process.env;

const envkey = ENV.JWT_KEY;

export const createToken = (payload : payload) => {
    const token = jwt.sign({ email : payload.toString},envkey,{
        algorithm : 'HS256',
        expiresIn : '30m'
    })
    return token;
}