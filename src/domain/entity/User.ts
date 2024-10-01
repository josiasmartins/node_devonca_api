import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true, min: 4, max: 14 },
    documentNumber: { type: String, required: true, match: /\d/ },
    image_profile: { type: String, required: false }
})

const User = mongoose.model('User', UserSchema);

export default User;