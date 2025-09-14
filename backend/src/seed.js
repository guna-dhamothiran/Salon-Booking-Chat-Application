// Simple DB seed to create services and stylists
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');
const Stylist = require('./models/Stylist');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/salon';
mongoose.set('strictQuery', true);

async function seed(){
  await mongoose.connect(MONGO);
  await Service.deleteMany({});
  await Stylist.deleteMany({});
  await Service.insertMany([
    { name: 'Men Haircut', duration_minutes: 30, price: 300, category: 'cut', description:'Classic men haircut' },
    { name: 'Women Haircut', duration_minutes: 45, price: 500, category: 'cut', description:'Stylish women haircut' },
    { name: 'Beard Trim', duration_minutes: 15, price: 150, category: 'groom', description:'Beard shaping' }
  ]);
  await Stylist.insertMany([
    { name: 'Arjun', skills:['cut','beard'], schedule:[] },
    { name: 'Priya', skills:['cut','color'], schedule:[] }
  ]);
  console.log('Seeded DB');
  process.exit(0);
}

seed().catch(e=>{ console.error(e); process.exit(1); });
