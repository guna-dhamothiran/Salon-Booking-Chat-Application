const Stylist = require("../models/Stylist");
const Appointment = require("../models/Appointment");

// Generate dynamic time slots (every 30 minutes between 9am-6pm)
const generateSlots = (startHour = 9, endHour = 18, interval = 30) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
      const hourStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      slots.push(`${hourStr}:${minStr}`);
    }
  }
  return slots;
};

const services = ["Haircut", "Shaving", "Trimming", "Facewash", "Manicure", "Pedicure"];

exports.handleMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.json({ reply: "⚠️ I didn’t get your message." });
    }

    const stylist = await Stylist.findOne({ name: "Arjun" });
    if (!stylist) return res.json({ reply: "⚠️ No stylist found in DB." });

    const lower = message.toLowerCase();

    // Confirm booking
    if (lower.startsWith("confirm")) {
      const parts = message.split(" ");
      const time = parts[1];
      const service = parts.slice(2).join(" "); // confirm HH:mm Haircut
      if (!time || !service) return res.json({ reply: "⚠️ Please include time and service: 'confirm 14:30 Haircut'" });

      const [hours, minutes] = time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return res.json({ reply: "⚠️ Invalid time format. Use HH:mm" });

      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);
      const end = new Date(start.getTime() + 30 * 60 * 1000);

      const existing = await Appointment.findOne({ stylistId: stylist._id, start });
      if (existing) return res.json({ reply: `⚠️ Slot at ${time} is already booked.` });

      await Appointment.create({ stylistId: stylist._id, service, start, end });
      return res.json({
        reply: `✅ ${service} booked with ${stylist.name} at ${time}. You can book another appointment!`,
        suggestions: ["Book another", "View appointments", "Cancel appointment"]
      });
    }

    // Cancel appointment
    if (lower.includes("cancel appointment")) {
      const today = new Date();
      const appointments = await Appointment.find({
        stylistId: stylist._id,
        start: { $gte: new Date(today.setHours(0,0,0,0)), $lt: new Date(today.setHours(23,59,59,999)) }
      }).sort({ start: 1 });

      if (!appointments.length) return res.json({ reply: "⚠️ No appointments to cancel today." });

      const quickReplies = appointments.map(a => {
        const hours = a.start.getHours().toString().padStart(2, "0");
        const mins = a.start.getMinutes().toString().padStart(2, "0");
        return `cancel ${hours}:${mins}`;
      });

      return res.json({
        reply: "Select appointment to cancel:",
        suggestions: quickReplies
      });
    }

    // Cancel specific slot
    if (lower.startsWith("cancel ")) {
      const parts = message.split(" ");
      const time = parts[1];
      const [hours, minutes] = time.split(":").map(Number);
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, 0);

      const appointment = await Appointment.findOne({ stylistId: stylist._id, start });
      if (!appointment) return res.json({ reply: `⚠️ No appointment found at ${time}` });

      await Appointment.deleteOne({ _id: appointment._id });
      return res.json({
        reply: `✅ Appointment at ${time} canceled.`,
        suggestions: ["Book another", "View appointments"]
      });
    }

    // View appointments
    if (lower.includes("view appointments")) {
      const today = new Date();
      const appointments = await Appointment.find({
        stylistId: stylist._id,
        start: { $gte: new Date(today.setHours(0,0,0,0)), $lt: new Date(today.setHours(23,59,59,999)) }
      }).sort({ start: 1 });

      if (!appointments.length) return res.json({ reply: "📋 No appointments scheduled today." });

      const replyText = appointments.map(a => {
        const hours = a.start.getHours().toString().padStart(2,"0");
        const mins = a.start.getMinutes().toString().padStart(2,"0");
        return `- ${hours}:${mins} | ${a.service}`;
      }).join("\n");

      return res.json({
        reply: `📋 Today's Appointments:\n${replyText}`,
        suggestions: ["Book another", "Cancel appointment"]
      });
    }

    // Booking new appointment
    if (services.some(s => lower.includes(s.toLowerCase())) || lower.includes("book another")) {
      // Ask for service first
      if (!services.some(s => lower.includes(s.toLowerCase()))) {
        return res.json({
          reply: "Which service would you like to book?",
          suggestions: services
        });
      }

      const service = services.find(s => lower.includes(s.toLowerCase()));

      let allSlots = generateSlots(9, 18, 30);
      const booked = await Appointment.find({
        stylistId: stylist._id,
        start: { $gte: new Date(new Date().setHours(0,0,0,0)), $lt: new Date(new Date().setHours(23,59,59,999)) }
      });
      const bookedTimes = booked.map(a => a.start.getHours().toString().padStart(2,'0') + ":" + a.start.getMinutes().toString().padStart(2,'0'));
      const availableSlots = allSlots.filter(s => !bookedTimes.includes(s));

      if (!availableSlots.length) return res.json({ reply: "⚠️ All slots are booked today. Try another day." });

      return res.json({
        reply: `Available slots for ${service}: ${availableSlots.join(" | ")}\nReply with 'confirm <time> ${service}'`,
        suggestions: availableSlots.slice(0, 10).map(s => `confirm ${s} ${service}`)
      });
    }

    // Default response
    return res.json({ reply: "🤖 I can help you book a service. Try asking for Haircut, Shaving, or Manicure!" });

  } catch (err) {
    console.error("Agent error:", err);
    return res.status(500).json({ reply: `⚠️ Something went wrong on server: ${err.message}` });
  }
};
