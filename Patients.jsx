import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Patients.css";

export default function Patients() {
  const { patients, addPatient, showToast } = useApp();
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name:"", age:"", disease:"" });
  const [showForm, setShowForm] = useState(false);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.disease.toLowerCase().includes(q.toLowerCase()) ||
    p.id.toLowerCase().includes(q.toLowerCase())
  );

  function submit() {
    if(!form.name||!form.disease||!form.age){ showToast("⚠️ Please fill all fields."); return; }
    addPatient({ name:form.name, age:parseInt(form.age), disease:form.disease });
    showToast(`✅ Patient ${form.name} added!`);
    setForm({ name:"", age:"", disease:"" });
    setShowForm(false);
  }

  const dotClass = s => s==="stable"?"dot-green":s==="watch"?"dot-yellow":"dot-red";

  return (
    <div className="pt-root">
      <div className="card">
        <div className="card-title">
          Patient Registry <span className="card-badge badge-green">{patients.length} Total</span>
          <button className="btn-primary" style={{fontSize:13,padding:"8px 16px"}} onClick={()=>setShowForm(!showForm)}>+ Add Patient</button>
        </div>

        {showForm && (
          <div className="pt-add-form">
            <div className="pt-form-row">
              <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Patient name"/></div>
              <div className="form-group"><label>Age</label><input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})} placeholder="Age"/></div>
              <div className="form-group"><label>Disease</label>
                <select value={form.disease} onChange={e=>setForm({...form,disease:e.target.value})}>
                  <option value="">Select…</option>
                  {["Hypertension","Type 2 Diabetes","Type 1 Diabetes","Cardiac Disease","COPD","Asthma","CKD"].map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="pt-form-btns">
                <button className="btn-primary" onClick={submit}>Save</button>
                <button className="btn-outline" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-search-row">
          <input className="pt-search" placeholder="🔍 Search by name, disease or ID…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>

        <div style={{overflowX:"auto"}}>
          <table className="data-table">
            <thead><tr><th>Patient</th><th>Age</th><th>Disease</th><th>Last Vital</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id}>
                  <td><strong>{p.name}</strong><br/><span style={{color:"var(--text-dim)",fontSize:11}}>{p.id}</span></td>
                  <td>{p.age}</td>
                  <td>{p.disease}</td>
                  <td style={{color:"var(--text-muted)"}}>{p.lastVital}</td>
                  <td><span className={`status-dot ${dotClass(p.status)}`}/>{p.status.charAt(0).toUpperCase()+p.status.slice(1)}</td>
                  <td><button className="pt-action-btn" onClick={()=>showToast(`Viewing ${p.name}`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
