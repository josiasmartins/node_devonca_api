import fs from "fs";
import path from "path";
import NodeRSA from "node-rsa";

/**
 *  Class for cryptography asimetric (RSA) in node, used lib node-rsa;
 */
export class CryptoRSA {

    private privateKey;
    private publicKey;

    constructor() {
        try {
            let key_private = fs.readFileSync("../../../keys/private.pem", 'utf8');
            let key_public = fs.readFileSync("../../../keys/public.pem", 'utf8');

            this.privateKey = new NodeRSA(key_private);
            this.publicKey = new NodeRSA(key_public);
        } catch (error) {
            console.log(error);
        }
    }
    
    public encrypt(messageSecret: string | number | boolean): string {

        const encrypted = this.publicKey.encrypt(messageSecret, 'base64');
        console.log(encrypted);
        return encrypted;
    }

    public decrypt(messageSecret: string): string {
        const decrypted = this.privateKey.decrypt(messageSecret);
        if (Buffer.isBuffer(decrypted)) {
            console.log(decrypted.toString(), "ibag IS_BUFEER")
            return decrypted.toString(); // Converte o buffer para string
        }
        console.log(decrypted, " ibag DECRYPTED VALUE");
        return decrypted;
    }

}