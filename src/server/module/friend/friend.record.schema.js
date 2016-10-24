var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


var FriendRecordSchema = new mongoose.Schema({
    from:{
        type:ObjectId,
        ref:"User"
    },
    to:{
        type:ObjectId,
        ref:"User"
    },
    msg:{
        type:String
    },
    state:{
        type:Number,
        default:0    //0默认 1接受 2拒绝
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

FriendRecordSchema.pre('save', function (next) {
    var user = this;

    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    next();


});


FriendRecordSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};



module.exports = FriendRecordSchema;

