import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    status: string;
    phoneNumber: number;
    resetToken: string | undefined;
    resetTokenExpiration: number | undefined
}

const UserSchemaFields = {
    email: {
        //this is the id of the user that posted this property
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        required: true
    },
    // admin / nah
    status: {
        type: String,
        default: "basic"
    },
    phoneNumber: {
        type: String,
        required: false,
        default: "0000"
    }
};

const userSchema = new Schema(UserSchemaFields, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);
const User = model<IUser>("User", userSchema);

export { User, IUser };