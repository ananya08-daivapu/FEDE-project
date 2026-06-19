import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const initialPatients = [
  { id:"P001", name:"Rajesh Kumar",  age:58, disease:"Hypertension",    lastVital:"Today 08:30", status:"stable" },
  { id:"P002", name:"Priya Sharma",  age:45, disease:"Type 2 Diabetes", lastVital:"Today 09:10", status:"watch" },
  { id:"P003", name:"Mohammed Ali",  age:63, disease:"Cardiac Disease", lastVital:"Today 07:55", status:"critical" },
  { id:"P004", name:"Lakshmi Devi", age:52, disease:"Hypertension",    lastVital:"Yesterday",   status:"stable" },
  { id:"P005", name:"Venkat Rao",   age:70, disease:"COPD",            lastVital:"Today 10:00", status:"watch" },
  { id:"P006", name:"Sunita Patel", age:39, disease:"Type 1 Diabetes", lastVital:"Today 09:45", status:"stable" },
  { id:"P007", name:"Arjun Singh",  age:55, disease:"Hypertension",    lastVital:"2 days ago",  status:"critical" },
  { id:"P008", name:"Meena Reddy",  age:48, disease:"Asthma",          lastVital:"Today 08:00", status:"stable" },
];

export const initialAlerts = [
  { id:1, type:"danger", icon:"🚨", title:"Critical BP – Mohammed Ali (P003)",      desc:"Systolic reached 185 mmHg at 07:55. Immediate review required.", time:"2 min ago" },
  { id:2, type:"danger", icon:"⚠️", title:"High Blood Sugar – Priya Sharma (P002)", desc:"Fasting glucose: 240 mg/dL — threshold exceeded.",               time:"18 min ago" },
  { id:3, type:"warn",   icon:"💊", title:"Missed Medication – Arjun Singh (P007)",  desc:"Amlodipine 5mg not marked as taken for 2 consecutive days.",     time:"1 hr ago" },
  { id:4, type:"info",   icon:"📋", title:"Routine Check Due – Lakshmi Devi (P004)", desc:"Monthly BP review is overdue by 3 days.",                        time:"3 hr ago" },
];

export const initialMedications = [
  { id:1, name:"Metformin 500mg",   schedule:"Twice daily with meals", status:"taken",   icon:"💊", color:"rgba(45,204,143,.15)" },
  { id:2, name:"Amlodipine 5mg",    schedule:"Once daily – morning",  status:"missed",  icon:"💊", color:"rgba(255,92,114,.15)" },
  { id:3, name:"Lisinopril 10mg",   schedule:"Once daily – evening",  status:"pending", icon:"💊", color:"rgba(255,179,71,.15)" },
  { id:4, name:"Atorvastatin 20mg", schedule:"Once daily – night",    status:"taken",   icon:"💊", color:"rgba(45,204,143,.15)" },
  { id:5, name:"Aspirin 75mg",      schedule:"Once daily – morning",  status:"taken",   icon:"💊", color:"rgba(45,204,143,.15)" },
];

export const initialNotes = [
  { id:1, patient:"Mohammed Ali (P003)", doctor:"Dr. Sharma", note:"Patient shows irregular BP spikes. Increase Amlodipine dosage to 10mg. Follow-up in 3 days.", date:"Today 08:00", tag:"critical" },
  { id:2, patient:"Priya Sharma (P002)", doctor:"Dr. Reddy",  note:"HbA1c at 8.2%. Dietary counselling recommended. Recheck glucose in 1 week.",                  date:"Today 09:15", tag:"watch" },
  { id:3, patient:"Rajesh Kumar (P001)", doctor:"Dr. Patel",  note:"BP controlled at 124/82. Maintain current medication regime. Next review in 1 month.",         date:"Yesterday",   tag:"stable" },
];

export function AppProvider({ children }) {
  const [patients, setPatients]         = useState(initialPatients);
  const [alerts, setAlerts]             = useState(initialAlerts);
  const [medications, setMedications]   = useState(initialMedications);
  const [notes, setNotes]               = useState(initialNotes);
  const [vitalLogs, setVitalLogs]       = useState([]);
  const [toast, setToast]               = useState(null);
  const [vitalsLogged, setVitalsLogged] = useState(318);
  const [notifications, setNotifications] = useState([
    { id:1, text:"Mohammed Ali's BP critically high", time:"2 min ago", read:false },
    { id:2, text:"Priya Sharma missed morning insulin", time:"1 hr ago", read:false },
    { id:3, text:"System backup completed successfully", time:"3 hr ago", read:true },
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addVitalLog = (log) => {
    setVitalLogs(prev => [log, ...prev]);
    setVitalsLogged(n => n + 1);
    if (parseInt(log.sys) > 160) {
      setAlerts(prev => [{ id:Date.now(), type:"danger", icon:"🚨", title:`High BP – ${log.patient}`, desc:`Systolic: ${log.sys} mmHg.`, time:"Just now" }, ...prev]);
      setNotifications(prev => [{ id:Date.now(), text:`High BP alert: ${log.patient} — ${log.sys}/${log.dia} mmHg`, time:"Just now", read:false }, ...prev]);
    }
  };

  const dismissAlert  = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
  const addPatient    = (p)  => setPatients(prev => [...prev, { id:`P${String(prev.length+1).padStart(3,"0")}`, ...p, lastVital:"Just now", status:"stable" }]);
  const addNote       = (n)  => setNotes(prev => [{ id:Date.now(), ...n }, ...prev]);
  const markAllRead   = ()   => setNotifications(prev => prev.map(n => ({ ...n, read:true })));

  return (
    <AppContext.Provider value={{ patients, alerts, medications, notes, vitalLogs, toast, vitalsLogged, notifications, showToast, addVitalLog, dismissAlert, addPatient, addNote, setMedications, markAllRead }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
