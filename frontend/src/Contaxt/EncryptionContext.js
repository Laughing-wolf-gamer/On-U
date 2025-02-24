import React, { createContext, useContext } from 'react';
import CryptoJS from 'crypto-js';
import { SECREAT_KEY } from '../config';

const EncryptionDecryption = createContext();


export const useEncryptionDecryptionContext = ()=> useContext(EncryptionDecryption);


export const EncryptionDecryptionProvider = ({children})=>{
    const key = SECREAT_KEY
    const encrypt = (data) => {
        return CryptoJS.AES.encrypt(data, key).toString();
    };
    const decrypt = (encryptedData) => {
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return bytes.toString(CryptoJS.enc.Utf8); // Convert decrypted data back to string
    };
    return (
        <EncryptionDecryption.Provider value={{
            encrypt,
            decrypt
        }}>
            {children}
        </EncryptionDecryption.Provider>
    )
}