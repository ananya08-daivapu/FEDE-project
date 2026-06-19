import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./DoctorNotes.css";

export default function DoctorNotes() {
  const { notes, patients, addNote, showToast } = useApp();
  const [f, setF] = useState({ patient:"", doctor:"", note:"", tag:"stable" });

  function submit() {
    if(!f.patient||!f.doctor||!f.note){ showToast("⚠️ Fill all fields."); return; }
    addNote({ ...f, date:"Just now" });
    showToast("✅ Note saved.");
    setF({ patient:"", doctor:"", note:"", tag:"stable" });
  }

  const tagColor = t => t==="critical"?"var(--danger)":t==="watch"?"var(--warning)":"var(--success)";
  const tagBadge = t => t==="critical"?"badge-danger":t==="watch"?"badge-warn":"badge-green";

  return (
    <div className="dn-root">
      <div className="card">
        <div className="card-title">Add Doctor Note</div>
        <div className="dn-form-grid">
          <div className="form-group">
            <label>Patient</label>
            <select value={f.patient} onChange={e=>setF({...f,patient:e.target.value})}>
              <option value="">Select patient…</option>
              {patients.map(p=><option key={p.id} value={`${p.name} (${p.id})`}>{p.name} ({p.id})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Doctor Name</label>
            <input value={f.doctor} onChange={e=>setF({...f,doctor:e.target.value})} placeholder="Dr. Name"/>
          </div>
          <div className="form-group">
            <label>Priority Tag</label>
            <select value={f.tag} onChange={e=>setF({...f,tag:e.target.value})}>
              <option value="stable">Stable</option>
              <option value="watch">Watch</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Clinical Note</label>
          <textarea rows={4} value={f.note} onChange={e=>setF({...f,note:e.target.value})} placeholder="Enter clinical observations, recommendations, dosage changes…" style={{resize:"vertical"}}/>
        </div>
        <button className="btn-primary" onClick={submit}>Save Note</button>
      </div>

      <div className="card">
        <div className="card-title">Notes History <span className="card-badge badge-blue">{notes.length} Notes</span></div>
        <div className="dn-notes-list">
          {notes.map(n=>(
            <div key={n.id} className="dn-note-item">
              <div className="dn-note-header">
                <div>
                  <span className="dn-note-patient">{n.patient}</span>
                  <span className={`card-badge ${tagBadge(n.tag)}`} style={{marginLeft:8}}>{n.tag}</span>
                </div>
                <span className="dn-note-date">{n.date}</span>
              </div>
              <div className="dn-note-doctor">{n.doctor}</div>
              <div className="dn-note-text">{n.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
