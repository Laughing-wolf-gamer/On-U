/* import React, { createContext, useContext, useState } from 'react';
import CryptoJS from 'crypto-js';
import { ENCRYPTION_KEY } from '@/constants';

const EncryptionDecryption = createContext();


export const useEncryptionDecryptionContext = ()=> useContext(EncryptionDecryption);


export const EncryptionDecryptionProvider = ({children})=>{
    const key = ENCRYPTION_KEY
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
} */