import mongoose, { Schema } from "mongoose";
import { CryptoAES } from "../../services/CryptoAES";

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
    // this.name = cryptoAES.decrypt(this.name);
    this.password = cryptoAES.decrypt(this.password);
    this.documentNumber = cryptoAES.decrypt(this.documentNumber);
    // this.image_profile = cryptoAES.decrypt(this.image_profile || "");
    // this.birthday = cryptoAES.decrypt(this.birthday);

    next();
});

// Middleware para criptografar os dados antes de salvar
UserSchema.pre('save', function(next) {
    const cryptoAES = new CryptoAES();

    // Criptografa os campos novamente
    // this.name = cryptoAES.encrypt(this.name);
    this.password = cryptoAES.encrypt(this.password);
    this.documentNumber = cryptoAES.encrypt(this.documentNumber);
    // this.image_profile = cryptoAES.encrypt(this.image_profile || "");
    // this.birthday = cryptoAES.encrypt(this.birthday);

    next();
});

const User = mongoose.model('User', UserSchema);

export default User;