import bycript from 'bcryptjs';

 

export const hashPassword = async (password: string, salt:number = 10): Promise<string> => {
    return await bycript.hash(password,salt);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bycript.compare(password, hashedPassword);
};