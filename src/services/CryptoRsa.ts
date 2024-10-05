import NodeRSA from "node-rsa";
import { key_private, key_public } from "../config/ReadKeysConfig";
import { InternalError } from "../error_handler/InternalError";

/**
 *  Class for cryptography asimetric (RSA) in node, used lib node-rsa;
 */
export class CryptoRSA {

    private privateKey: NodeRSA;
    private publicKey: NodeRSA;

    constructor() {
        this.privateKey = new NodeRSA(key_private);
        this.publicKey = new NodeRSA(key_public);
    }
    
    public encrypt(messageSecret: string | number | boolean): string {

        if (messageSecret == null || messageSecret === "" || messageSecret === undefined) {
            throw new InternalError("messageSecret not allow empty, null or undefined");
        }

        const encrypted = this.publicKey.encrypt(Buffer.from(String(messageSecret)), 'base64');
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