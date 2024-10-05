import fs from "fs";
import NodeRSA from "node-rsa";

let key_private = fs.readFileSync("../../../keys/private.pem", 'utf8');
let key_public = fs.readFileSync("../../../keys/public.pem", 'utf8');

export { key_private, key_public }

// const privateKeyNodeRsa = new NodeRSA(key_private);
// const publicKeyNodeRsa = new NodeRSA(key_public);

// const keys = { key_private_node_rsa: privateKeyNodeRsa, key_public_node_rsa: publicKeyNodeRsa }

// export { keys };