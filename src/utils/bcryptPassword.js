// import bcryptjs from 'bcrypt';

// export const createHash = (password) =>{
//     const salt = bcryptjs.genSaltSync (10);
//     const passHash = bcryptjs.hashSync( password, salt );
//     return passHash;
// };

// export const isValidPassword = (password, userPassword) =>{
//     const passValid = bcryptjs.compareSync( password , userPassword );
//     return passValid;
// }

import bcrypt from "bcrypt";

export async function createHash(password) {
  const hashPassword = await bcrypt.hash(password, bcrypt.genSaltSync(10));

  return hashPassword;
}

export async function comparePassword(password, hashPassword) {
  const isPasswordCorrect = await bcrypt.compare(password, hashPassword);

  return isPasswordCorrect;
}