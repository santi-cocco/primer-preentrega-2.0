import { Schema, model } from 'mongoose';

const nameCollection = 'User';

const UserSchema = new Schema({
    first_name:{ type: String, required : [true, 'el nombre es obligatorio']},
    last_name:{ type: String},
    email:{ type: String, required : [true, 'el correo es obligatorio'], unique: true},
    password:{ type: String, required : [true, 'La contraseña es obligatoria']},
    rol:{ type: String, default:'user', enum: ['user', 'admin']},
    cart: { type: Schema.Types.ObjectId, ref: "cart" },
    status:{ type: Boolean, default : true},
    fechaCreacion:{type: Date, default:Date.now},
    image:{type: String},
    github:{type: Boolean, default: false},
    google:{type: Boolean, default: false},
    facebook:{type: Boolean, default: false},
});

UserSchema.set('toJSON',{
    transform: function (doc, ret){
        delete ret.__v;
        return ret;
    }
});

export const userModel = model (nameCollection, UserSchema);