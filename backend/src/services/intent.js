const { parseISO, addDays, formatISO } = require('date-fns');

// Very small intent parser: looks for keywords 'book' / 'confirm' / time / date and service names.
function parseIntent(text){
  const t = text.toLowerCase();
  if(t.includes('confirm') || t.startsWith('confirm') || t.startsWith('book') && t.includes('confirm')){
    // confirm booking with time
    const timeMatch = t.match(/(\d{1,2}(:\d{2})?\s?(am|pm)?)/);
    return { intent: 'CONFIRM_BOOKING', slots: { time: timeMatch ? timeMatch[0] : null } };
  }
  if(t.includes('book') || t.includes('appointment') || t.includes('i want') || t.includes('i need')){
    // try to extract service and date/time
    const serviceMatch = t.match(/(haircut|cut|color|spa|massage|trim|beard)/);
    const dateMatch = t.match(/(today|tomorrow|friday|saturday|sunday|monday|tuesday|wednesday|thursday)/);
    const timeMatch = t.match(/(\d{1,2}(:\d{2})?\s?(am|pm)?)/);
    let date = null;
    if(dateMatch){
      const w = dateMatch[0];
      // resolve relative weekday to next date (simple handling)
      const now = new Date();
      if(w === 'today') date = formatISO(now, { representation: 'date' });
      else if(w === 'tomorrow') date = formatISO(addDays(now,1), { representation: 'date' });
      else {
        // map weekday to next occurrence
        const map = { sunday:0,monday:1,tuesday:2,wednesday:3,thursday:4,friday:5,saturday:6 };
        const target = map[w];
        const delta = (target - now.getDay() + 7) % 7 || 7;
        date = formatISO(addDays(now, delta), { representation: 'date' });
      }
    }
    return { intent: 'BOOK_APPOINTMENT', slots: { service: serviceMatch ? serviceMatch[0] : null, date, time: timeMatch ? timeMatch[0] : null } };
  }
  return { intent: 'UNKNOWN' };
}

module.exports = { parseIntent };
