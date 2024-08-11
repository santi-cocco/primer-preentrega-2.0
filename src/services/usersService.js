import { userModel } from "../models/usersModel.js"


export const getUserById = async (id) => {
    try {
        return await userModel.findById(id);
    } catch (error) {
        console.error('getUserById', error);
        throw error;
    }
};

export const getUserEmail = async ( email )=> {

    try {
        return await userModel.findOne({email});
    } catch (error) {
        console.log('getUserEmail ->', error);
        throw error
    }
}

export const registerUser = async ( user )=> {

    try {
        return await userModel.create({...user });
    } catch (error) {
        console.log('registerUser ->', error);
        throw error
    }
}