import "dotenv/config";
import jwt from "jsonwebtoken";

/**
 * @function generateToken
 * @param {string} userId - The ID of the user to generate a token for
 * @param {object} res - The Express response object to set the cookie
 * 
 * @description Generates a JWT token for the user with a 7-day expiration.
 * Sets the token as an HTTP-only cookie in the response.
 * 
 * Expects the following fields in req.body:
 * - userId (string): The ID of the user for whom the token is being generated.
 * - The token is signed with a secret key stored in the environment variable JWT_SECRET.
 * 
 * Returns:
 * - {string} token - The generated JWT token.
 */

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

  res.cookie("token", token , {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly:true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
  });

  return token;
};
