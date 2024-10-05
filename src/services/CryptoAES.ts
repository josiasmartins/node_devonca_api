import crypto from "crypto";
import { key_private } from "../config/ReadKeysConfig";

export class CryptoAES {

    private key: Buffer;
    private iv: Buffer;

    constructor() {
        this.key = crypto.randomBytes(32); // 256 bits para AES-256
        this.iv = crypto.randomBytes(16); // 128 bits para AES
    }

    public encrypt(text: string): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('base64');
        console.log(encrypted, " ibag encrypted")
        return encrypted;
    }

    public decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'base64')), decipher.final()]).toString('utf8');
        console.log(decrypted, " ibag decryted")
        return decrypted;
    }

    // private readonly ALG_AES_256_CTR = "aes-256-ctr";

    // encrypt(message: string): string {
    //     const iv = crypto.randomBytes(16);
    //     const crypted = crypto.createCipheriv(this.ALG_AES_256_CTR, "teste", iv).update(message, "utf-8", "base64");
    //     console.log(crypted, " ibag crypted")
    //     return crypted;
    // }

    // decrypt(message: string) {
    //     const iv = crypto.randomBytes(16);
    //     const decrypted = crypto.createDecipheriv(this.ALG_AES_256_CTR, "teste", iv).update(message, 'base64', 'utf-8');
    //     console.log(decrypted, " ibag decrypted")
    //     return decrypted;
    // }

}