import mongoose, { Schema } from "mongoose";
import { CryptoAES } from "../../services/CryptoAES";
import { CryptoEnum } from "../../services/CryptoEnum";

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, minLength: 4, maxLength: 14 },
    documentNumber: { type: String, required: true, match: /\d+$/ },
    image_profile: { type: String, required: false },
    birthday: { type: String, required: true }
});

// Middleware para decriptar os dados antes da validação
UserSchema.pre('validate', function(next) {
    const cryptoAES = new CryptoAES();

    // Decripta os campos
    this.name = cryptoAES.decrypt(this.name);
    this.password = cryptoAES.decrypt(this.password);
    this.documentNumber = cryptoAES.decrypt(this.documentNumber);
    this.image_profile = cryptoAES.decrypt(this.image_profile || "");
    this.birthday = cryptoAES.decrypt(this.birthday);

    // Decripta os campos usando cryptoData
    // const decryptedData = cryptoAES.cryptoData(this.toObject(), CryptoEnum.DECRYPT, ["_id", "_iv"]);

    // console.log(decryptedData);

    // Atualiza os campos da instância com os valores decriptados
    // Object.assign(this, decryptedData);



    next();
});

// Middleware para criptografar os dados antes de salvar
UserSchema.pre('save', function(next) {
    const cryptoAES = new CryptoAES();

    // Criptografa os campos novamente
    // this.name = cryptoAES.encrypt(this.name);
    // this.password = cryptoAES.encrypt(this.password);
    // this.documentNumber = cryptoAES.encrypt(this.documentNumber);
    // this.image_profile = cryptoAES.encrypt(this.image_profile);
    // this.birthday = cryptoAES.encrypt(this.birthday);

    // Decripta os campos usando cryptoData
    const encryptedData = cryptoAES.cryptoData(this.toObject(), CryptoEnum.ENCRYPT, ["_id", "name", "birthday", "image_profile"]);

    console.log(encryptedData);

    // Atualiza os campos da instância com os valores decriptados
    Object.assign(this, encryptedData);

    next();
});

const User = mongoose.model('User', UserSchema);

export default User;