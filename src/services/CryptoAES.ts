import crypto from "crypto";
import { key_private } from "../config/ReadKeysConfig";

export class CryptoAES {

    private key: Buffer;
    private iv: Buffer;

    constructor() {
        // this.key = crypto.randomBytes(32); // 256 bits para AES-256
        // this.iv = crypto.randomBytes(16); // 128 bits para AES

        this.key = Buffer.from("i_like_in_the_end_and_more_music"); // Exemplo de 32 bytes
        this.iv = Buffer.from("i_lik_in_the_end"); // Exemplo de 16 bytes
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

    public cryptoData(data: any) {

        let objeto = {};

        for (let field in data) {
            const nameField = field;
            const fieldValue = data[field];

            const encryptedValue = this.encrypt(fieldValue);
            objeto[field] = encryptedValue;
        }

        return objeto;

    }


}