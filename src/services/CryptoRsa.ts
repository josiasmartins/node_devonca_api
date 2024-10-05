import fs from "fs";
import { NodeRSA } from "node-rsa";

export class CryptoRSA {

    private privateKey: NodeRSA;
    private publicKey: NodeRSA;
    secret = "hello";

    constructor() {
        this.privateKey = new NodeRSA(fs.readFileSync('/c/Users/josias.m.caitano/Documents/keys/private.pem', 'utf8'));
        this.publicKey = new NodeRSA(fs.readFileSync('/c/Users/josias.m.caitano/Documents/keys/private.pem', 'utf8'));
    }
    
    public encrypt(secret?: string) {
        console.log(`KEYS ${fs.readFileSync('/c/Users/josias.m.caitano/Documents/keys/private.pem', 'utf8')}`);
        let encrypted = this.publicKey.encrypt(this.secret, 'base64');
        console.log(encrypted);
    }

    public decrypt() {
        const decrypted = this.privateKey.decrypt(this.secret);
        console.log(decrypted);
    }

}