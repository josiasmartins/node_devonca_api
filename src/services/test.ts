import fs from "fs";
import NodeRSA from "node-rsa";
let key_private = fs.readFileSync("../../../keys/private.pem", 'utf8');
let key_public = fs.readFileSync("../../../keys/public.pem", 'utf8');

let privateKey = new NodeRSA(key_private);
let publicKey = new NodeRSA(key_public);

// console.log(key_private, " ibag private key")
// console.log(key_public, " ibag public key")


let secret = "hello word";

function encrypt(message) {
    // console.log(`KEYS ${fs.readFileSync('/c/Users/josias.m.caitano/Documents/keys/private.pem', 'utf8')}`);
    let encrypted = publicKey.encrypt(message, 'base64');
    console.log(encrypted, " IBAG CRYPTO");
    return encrypted;
}

function decrypt(message) {
    let decrypted = privateKey.decrypt(message);
    console.log(decrypted + " IBAG DECRYPTED");
    return decrypted;
}

export { encrypt, decrypt };


// encrypt();

// decrypt();