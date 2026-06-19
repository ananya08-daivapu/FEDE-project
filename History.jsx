import { useApp } from "../context/AppContext";
import "./History.css";

const mockHistory = [
  { date:"Jun 19, 2026", patient:"Mohammed Ali (P003)", event:"BP logged: 185/110 mmHg – Critical alert triggered", type:"danger" },
  { date:"Jun 19, 2026", patient:"Priya Sharma (P002)",  event:"Glucose: 240 mg/dL – Threshold exceeded", type:"danger" },
  { date:"Jun 19, 2026", patient:"Rajesh Kumar (P001)",  event:"BP: 124/82 mmHg – Normal range", type:"success" },
  { date:"Jun 18, 2026", patient:"Arjun Singh (P007)",   event:"Amlodipine 5mg – Missed dose recorded", type:"warn" },
  { date:"Jun 18, 2026", patient:"Sunita Patel (P006)",  event:"Glucose: 92 mg/dL – Stable", type:"success" },
  { date:"Jun 17, 2026", patient:"Venkat Rao (P005)",    event:"SpO₂: 91% – Below threshold, doctor alerted", type:"danger" },
  { date:"Jun 17, 2026", patient:"Lakshmi Devi (P004)", event:"Monthly BP review completed", type:"info" },
  { date:"Jun 16, 2026", patient:"Meena Reddy (P008)",  event:"Asthma inhaler usage logged", type:"info" },
];

const typeColor = t => t==="danger"?"var(--danger)":t==="warn"?"var(--warning)":t==="success"?"var(--success)":"var(--blue-accent)";
const typeBg    = t => t==="danger"?"rgba(255,92,114,.08)":t==="warn"?"rgba(255,179,71,.08)":t==="success"?"rgba(45,204,143,.08)":"rgba(59,168,255,.08)";

export default function History() {
  const { vitalLogs } = useApp();

  const combined = [
    ...vitalLogs.map(v=>({ date:"Today "+v.time, patient:v.patient, event:`BP: ${v.sys}/${v.dia||"—"} mmHg | HR: ${v.hr} bpm | Glucose: ${v.glucose||"—"} mg/dL`, type: parseInt(v.sys)>160?"danger":"success" })),
    ...mockHistory
  ];

  return (
    <div className="hs-root">
      <div className="card">
        <div className="card-title">Activity History <span className="card-badge badge-blue">{combined.length} Events</span></div>
        <div className="hs-timeline">
          {combined.map((h,i)=>(
            <div key={i} className="hs-row" style={{background:typeBg(h.type),borderLeft:`3px solid ${typeColor(h.type)}`}}>
              <div className="hs-dot" style={{background:typeColor(h.type)}}/>
              <div className="hs-body">
                <div className="hs-patient">{h.patient}</div>
                <div className="hs-event">{h.event}</div>
              </div>
              <span className="hs-date">{h.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
