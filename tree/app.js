var mongoose = require('mongoose');
//connection
mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },(err)=>{})
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
//Schema
var Schema = mongoose.Schema;
var schemaMember = new Schema({
        id: {type: String},
        parent: {type: String},
        balance:{type: Number, default: 0},
        revenue: {type: Number, default: 0},
        address:{type: String, default: '0x0'},
        time: { type: Date, default: Date.now },
      },
      {
        versionKey: false,
        timestamps: false
      });
//virtual
schemaMember.virtual('ver').get(function () {
    return this.tree.limit.v;
  });
//Model
var Member = mongoose.model('Member', schemaMember,'members'); // members: name of collection
//Event Connected
db.once('open', function() {
  console.log('we are connected!');
  //Create Object
  var member = new Member({
    id: '', 
    parent: '',
    address: ''
  });
  //member.save()
  //Deposit('0x01F8505B9B33e88c339E02C7338F7d95DDeb1b48',10)
  //viewOne(1,(doc)=>{})
});

function viewOne(id,fn){
  Member.find({'parent': id},'id balance revenue address',function (err, doc) {
  fn(doc)
 });
}

function Deposit(address,amount){
  Member.findOneAndUpdate({address:address},{$inc:{balance: amount}},{new: true},(err,doc)=>{
    AddRevenue(doc.parent,amount)
  })
}

function AddRevenue(parent,add){
  if (parent != '0') {
    Member.findOneAndUpdate({id: parent},{$inc:{revenue: add}},{new: true},(err,doc)=>{
      AddRevenue(doc.parent,add)
    })
  }
}