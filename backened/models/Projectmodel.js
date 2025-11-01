const {Schema, model} = import('../connection');
const mySchema = new Schema({
    prompt:String,
    review:String,
    
}, {timestamps: true});

module.exports = model('users', mySchema);




