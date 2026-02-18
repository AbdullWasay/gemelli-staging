import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
/**
 * Hash a password using bcrypt
 *
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare a plain text password with a hashed password
 *
 * @param password - Plain text password to compare
 * @param hashedPassword - Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token for authentication
 *
 * @param payload - Data to include in the token
 * @returns JWT token string
 */
export const generateToken = (payload: object): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

/**
 * Verify and decode a JWT token
 *
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): unknown => {
  try {
    const secret = process.env.JWT_SECRET || "your-secret-key";
    return jwt.verify(token, secret);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    return null;
  }
};
