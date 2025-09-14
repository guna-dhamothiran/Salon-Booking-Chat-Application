const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Service = require('../models/Service');
const Stylist = require('../models/Stylist');
const Appointment = require('../models/Appointment');
const { findAvailableSlots } = require('../services/availability');
const { parseIntent } = require('../services/intent');

// POST /api/agent/message
router.post('/message', async (req, res) => {
  try{
    const { userId, message } = req.body;
    const user = userId ? await User.findById(userId) : null;

    // simple intent parse (no external LLM)
    const intent = parseIntent(message);

    if(intent.intent === 'BOOK_APPOINTMENT'){
      // find slots
      const candidates = await findAvailableSlots(intent.slots);
      if(candidates.length === 0){
        return res.json({ reply: 'Sorry, no slots available on that date. Would you like another date?' });
      }
      // propose top 3
      const top = candidates.slice(0,3).map(s => ({ start: s.start, stylist: s.stylist }));
      return res.json({ reply: `I found available slots: ${top.map(t=> t.start + ' with ' + t.stylist).join(' | ')}. Reply with 'confirm <time>' to book.`, candidates: top });
    }

    if(intent.intent === 'CONFIRM_BOOKING'){
      // expecting time in slots param
      const chosen = intent.slots.time;
      const candidates = await findAvailableSlots(intent.slots);
      const pick = candidates.find(c => c.start.startsWith(chosen));
      if(!pick) return res.json({ reply: 'Could not find that slot; please pick from the available suggestions.' });
      // create basic appointment
      const appt = await Appointment.create({
        userId: user ? user._id : null,
        stylistId: pick.stylistId,
        serviceIds: pick.serviceIds,
        start: new Date(pick.start),
        end: new Date(pick.end),
        notes: intent.slots.notes || ''
      });
      return res.json({ reply: `Booked! Appointment id ${appt._id} on ${appt.start.toISOString()}` , appointment: appt });
    }

    // fallback
    res.json({ reply: 'Sorry, I did not understand. Try: "I want a haircut this Friday at 4pm"' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
