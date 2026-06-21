// Daily supplement schedule. Edit times/items here — no other file needs to change.
// time: 24-hour "HH:MM" used for sorting and current/next slot detection.
// label: what's displayed to the user (can include a note like "(breakfast)").
const SCHEDULE = [
  { time: "05:00", label: "5:00 AM", items: ["Ovasitol (morning dose)", "Vitamin C", "Prenatal"] },
  { time: "07:30", label: "7:30 AM (breakfast)", items: ["DHEA (with food)", "CoQ10"] },
  { time: "08:30", label: "8:30 AM", items: ["Astaxanthin"] },
  { time: "09:30", label: "9:30 AM", items: ["EGCG"] },
  { time: "10:30", label: "10:30 AM", items: ["Resveratrol"] },
  { time: "11:30", label: "11:30 AM", items: ["L-leucine"] },
  { time: "12:30", label: "12:30 PM", items: ["L-arginine", "Vitamin D3"] },
  { time: "13:30", label: "1:30 PM (lunch)", items: ["DHEA (with food)"] },
  { time: "14:30", label: "2:30 PM", items: ["Acai berry", "Vitamin E"] },
  { time: "15:30", label: "3:30 PM", items: ["Resveratrol"] },
  { time: "16:30", label: "4:30 PM", items: ["B Complex"] },
  { time: "17:30", label: "5:30 PM", items: ["Omega-3"] },
  { time: "18:30", label: "6:30 PM (dinner)", items: ["DHEA (with food)", "Ovanad+ (with food)"] },
  { time: "19:30", label: "7:30 PM", items: ["CoQ10"] },
  { time: "20:30", label: "8:30 PM", items: ["L-leucine", "L-arginine"] },
  { time: "21:30", label: "9:30 PM", items: ["Ovasitol (evening dose)", "Astaxanthin"] },
];
