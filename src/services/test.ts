import fs from "fs";
import NodeRSA from "node-rsa";
let key_private = fs.readFileSync("../../../keys/private.pem", 'utf8');
let key_public = fs.readFileSync("../../../keys/public.pem", 'utf8');

let privateKey = new NodeRSA(key_private);
let publicKey = new NodeRSA(key_public);

// console.log(key_private, " ibag private key")
// console.log(key_public, " ibag public key")


let secret = "hello word";

function encrypt() {
    // console.log(`KEYS ${fs.readFileSync('/c/Users/josias.m.caitano/Documents/keys/private.pem', 'utf8')}`);
    let encrypted = publicKey.encrypt(secret, 'base64');
    console.log(encrypted, " IBAG CRYPTO");
}

function decrypt() {
    let decrypted = privateKey.decrypt('VVzmQMKhS02J6Y7NiySScIH6z60LkKT27WyIudQGc3l3WWNwbXD+YIgOef20E57KECEy0DWWXfrqjgbQrSt9NAo2CBjJ2m2O4hDqYCjQEu3k/QZ1S/oks8WEIny33ZDOCTLB4ob59pcDGO18epNG6ckugNrkkbp10PVDDJqw1tPFapI4MWLEohTAWXTv6EY69YhfIlYzc4k6d/MPw+rRCDL85XxgwHMLZBOA/tGhnyuIKHjj6qK55tdurCGnu9com7FysLVye6r3PyTrnZhAzEsVFtWt0ojPxhQsxuAudIsHwgY4x9tbrMurfHRgkQ41yBf4za/5OTcdkIMhwj80dg==');
    console.log(decrypted + " IBAG DECRYPTED")
}


encrypt();

decrypt();