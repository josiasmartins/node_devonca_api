import crypto from "crypto";
import { key_private } from "../config/ReadKeysConfig";
import { CryptoEnum } from "./CryptoEnum";

/**
 * Class for crypto simetric (AES)
 */
export class CryptoAES {

    private key: Buffer;
    private iv: Buffer;

    constructor() {
        // this.key = crypto.randomBytes(32); // 256 bits para AES-256
        // this.iv = crypto.randomBytes(16); // 128 bits para AES

        this.key = Buffer.from("i_like_in_the_end_and_more_music"); // Exemplo de 32 bytes
        this.iv = Buffer.from("i_lik_in_the_end"); // Exemplo de 16 bytes
    }

    public encrypt(text: string | number | boolean): string {
        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv);
        const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]).toString('base64');
        console.log(encrypted, " ibag encrypted")
        return encrypted;
    }

    public decrypt(encryptedText: string): string {
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'base64')), decipher.final()]).toString('utf8');
        console.log(decrypted, " ibag decryted")
        return decrypted;
    }

    public cryptoData(data: any, crypto: CryptoEnum, ignoreFields?: string[]) {
        // Verifica se o dado é um objeto e não é nulo
        if (typeof data === 'object' && data !== null) {
            // Percorre cada chave no objeto
            for (let key in data) {
                const fieldValue = data[key];

                // Verifica se o campo atual deve ser excluído
                if (ignoreFields.includes(key)) {
                    continue;  // Ignora a criptografia para este campo
                }

                // Verifica se o valor da chave é uma string, um número ou booleano
                if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {

                    // cryptografa o valor
                    data[key] = crypto === CryptoEnum.ENCRYPT ? this.encrypt(fieldValue)  : this.decrypt(String(fieldValue));
                } else {
                    // Se o valor é um objeto ou array, chama a função recursivamente
                    this.cryptoData(data[key], crypto, ignoreFields);
                }
            }
        }
    
        // Retorna o objeto ou array modificado
        return data;
    }
    


}

