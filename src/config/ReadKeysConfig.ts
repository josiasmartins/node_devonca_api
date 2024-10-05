import fs from "fs";

const path_key_public = process.env.PATH_KEY_PUBLIC || "../../../keys/private.pem";
const path_key_private = process.env.PATH_KEY_PRIVATE || "../../../keys/public.pem";

let key_private = fs.readFileSync(path_key_private, 'utf8');
let key_public = fs.readFileSync(path_key_public, 'utf8');

export { key_private, key_public };