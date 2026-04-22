import puter from "@heyputer/puter.js";

export const signIn = async () => {
    try {
        await puter.auth.signIn();
    } catch (error) {
        console.log(error);
    }
};

export const signOut = () => puter.auth.signOut();

export const getCurrentUser = () => {
    try {
        return puter.auth.getUser();
    } catch (error) {
        return null;
    }
};