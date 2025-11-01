const {Schema, model} = import('../connection');
const mySchema = new Schema({
    name: String,
    email: {type : String, unique: true},
    password: {type: String, required: true, minlength: 6},
    
}, {timestamps: true});

module.exports = model('users', mySchema);




