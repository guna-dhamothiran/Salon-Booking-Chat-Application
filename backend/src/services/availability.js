const Appointment = require('../models/Appointment');
const Stylist = require('../models/Stylist');
const Service = require('../models/Service');
const { addMinutes } = require('date-fns');

// Find available slots for a given request { service, date, time }
async function findAvailableSlots(request){
  // find service duration
  const service = request.service ? await Service.findOne({ name: new RegExp(request.service, 'i') }) : null;
  const duration = service ? service.duration_minutes : 30;

  // load stylists
  const stylists = await Stylist.find();
  const candidates = [];
  const dateStr = request.date; // expected 'yyyy-mm-dd'

  for(const s of stylists){
    // for demo: generate slots between 09:00 to 18:00 every 30 minutes
    for(let hour=9; hour<18; hour++){
      for(let minute of [0,30]){
        const start = new Date(dateStr + 'T' + String(hour).padStart(2,'0') + ':' + String(minute).padStart(2,'0') + ':00');
        const end = addMinutes(start, duration);
        // check overlap
        const overlap = await Appointment.exists({ stylistId: s._id, $or: [ { start: { $lt: end, $gte: start } }, { end: { $gt: start, $lte: end } } ] });
        if(!overlap){
          candidates.push({ stylist: s.name, stylistId: s._id, start: start.toISOString(), end: end.toISOString(), serviceIds: service ? [service._id] : [] });
        }
      }
    }
  }
  // if user provided preferred time try to filter
  if(request.time){
    const pref = request.time.replace(/\s+/g,'');
    const filtered = candidates.filter(c=> c.start.includes(pref) || c.start.includes(request.time));
    return filtered.length ? filtered : candidates;
  }
  return candidates;
}

module.exports = { findAvailableSlots };
