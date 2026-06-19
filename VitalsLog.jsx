import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./VitalsLog.css";

const DEF = { patient:"", sys:"", dia:"", hr:"", glucose:"", spo2:"", weight:"" };

export default function VitalsLog() {
  const { patients, vitalLogs, addVitalLog, showToast } = useApp();
  const [f, setF] = useState(DEF);

  function submit() {
    if(!f.patient||f.patient==="Select patient…"||!f.sys||!f.hr){ showToast("⚠️ Please fill required fields."); return; }
    const now=new Date(), time=now.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    addVitalLog({ ...f, time });
    showToast("✅ Vitals saved successfully!");
    setF(DEF);
  }

  const field=(id,label,type="text",ph="")=>(
    <div className="form-group"><label>{label}</label><input type={type} placeholder={ph} value={f[id]} onChange={e=>setF({...f,[id]:e.target.value})}/></div>
  );

  return (
    <div className="vl-root">
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Log Vitals <span className="card-badge badge-green">New Entry</span></div>
          <div className="form-group">
            <label>Patient *</label>
            <select value={f.patient} onChange={e=>setF({...f,patient:e.target.value})}>
              <option value="">Select patient…</option>
              {patients.map(p=><option key={p.id} value={`${p.name} (${p.id})`}>{p.name} ({p.id})</option>)}
            </select>
          </div>
          <div className="vl-form-grid">
            {field("sys","Systolic BP (mmHg) *","number","e.g. 120")}
            {field("dia","Diastolic BP (mmHg)","number","e.g. 80")}
            {field("hr","Heart Rate (bpm) *","number","e.g. 72")}
            {field("glucose","Blood Glucose (mg/dL)","number","e.g. 110")}
            {field("spo2","SpO₂ (%)","number","e.g. 98")}
            {field("weight","Weight (kg)","number","e.g. 70")}
          </div>
          <div className="vl-actions">
            <button className="btn-primary" onClick={submit}>Save Vitals</button>
            <button className="btn-outline" onClick={()=>setF(DEF)}>Clear</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Today's Log <span className="card-badge badge-blue">{vitalLogs.length} entries</span></div>
          {vitalLogs.length===0
            ? <div className="vl-empty">No vitals logged yet today.<br/><span style={{color:"var(--text-dim)",fontSize:12}}>Submit the form to see entries here.</span></div>
            : <div style={{overflowX:"auto"}}><table className="data-table">
                <thead><tr><th>Patient</th><th>BP</th><th>HR</th><th>Glucose</th><th>Time</th></tr></thead>
                <tbody>
                  {vitalLogs.slice(0,10).map((v,i)=>(
                    <tr key={i}>
                      <td>{v.patient.split(" (")[0]}</td>
                      <td>{v.sys}/{v.dia||"—"}</td>
                      <td>{v.hr}</td>
                      <td>{v.glucose||"—"}</td>
                      <td style={{color:"var(--text-dim)"}}>{v.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
          }
        </div>
      </div>

      <div className="card">
        <div className="card-title">Threshold Reference</div>
        <div className="vl-thresholds">
          {[
            {label:"BP Normal",  val:"< 120/80 mmHg", color:"var(--success)"},
            {label:"BP High",    val:"> 140/90 mmHg", color:"var(--warning)"},
            {label:"BP Critical",val:"> 160/100 mmHg",color:"var(--danger)"},
            {label:"Glucose Normal",val:"70–100 mg/dL",color:"var(--success)"},
            {label:"Glucose High",  val:"> 180 mg/dL", color:"var(--danger)"},
            {label:"SpO₂ Normal",   val:"95–100%",     color:"var(--blue-accent)"},
          ].map(t=>(
            <div key={t.label} className="vl-threshold-item">
              <span className="vl-threshold-label">{t.label}</span>
              <span style={{color:t.color,fontWeight:600,fontSize:13}}>{t.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
