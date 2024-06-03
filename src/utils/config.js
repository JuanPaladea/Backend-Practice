import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI
export const GHCLIENT_ID = process.env.GHCLIENT_ID
export const GHCLIENT_SECRET = process.env.GHCLIENT_SECRET 
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
export const GOOGLE_SECRET = process.env.GOOGLE_SECRET
export const JWT_SECRET = process.env.JWT_SECRET
export const SECRET_SESSION = process.env.SECRET_SESSION
export const EMAIL = process.env.EMAIL
export const PASSWORD = process.env.PASSWORD