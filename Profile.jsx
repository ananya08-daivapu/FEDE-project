import { useState } from "react";
import { useApp } from "../context/AppContext";
import "./Profile.css";

export default function Profile({ onLogout }) {
  const { showToast } = useApp();
  const [profile, setProfile] = useState({ name:"Dr. Rajesh Kumar", email:"dr.rajesh@apollohospitals.com", hospital:"Apollo Hospitals, Hyderabad", phone:"+91 98765 43210", speciality:"General Physician", license:"MCI-2019-HYD-00421" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  function save() { setProfile(draft); setEditing(false); showToast("✅ Profile updated."); }

  return (
    <div className="pf-root">
      <div className="card pf-hero-card">
        <div className="pf-avatar">👨‍⚕️</div>
        <div className="pf-hero-info">
          <h2 className="pf-name">{profile.name}</h2>
          <div className="pf-role">{profile.speciality} · {profile.hospital}</div>
          <div className="pf-license">License: {profile.license}</div>
        </div>
        <button className="btn-outline" style={{fontSize:13,padding:"8px 16px",marginLeft:"auto"}} onClick={()=>{ setDraft(profile); setEditing(!editing); }}>
          {editing ? "Cancel" : "✏️ Edit"}
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Personal Info</div>
          {editing ? (
            <>
              {[["name","Full Name"],["email","Email"],["phone","Phone"],["speciality","Speciality"],["hospital","Hospital"],["license","License No."]].map(([k,l])=>(
                <div className="form-group" key={k}><label>{l}</label><input value={draft[k]} onChange={e=>setDraft({...draft,[k]:e.target.value})}/></div>
              ))}
              <button className="btn-primary" onClick={save}>Save Changes</button>
            </>
          ) : (
            <div className="pf-info-grid">
              {[["📧","Email",profile.email],["📱","Phone",profile.phone],["🏥","Hospital",profile.hospital],["🩺","Speciality",profile.speciality]].map(([icon,label,val])=>(
                <div key={label} className="pf-info-item"><span className="pf-info-icon">{icon}</span><div><div className="pf-info-label">{label}</div><div className="pf-info-val">{val}</div></div></div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Account Settings</div>
          <div className="pf-settings">
            {[["🔔","Email Alerts","Receive critical threshold alerts via email"],["📱","SMS Alerts","Get SMS for critical patient events"],["🌙","Dark Mode","App always uses dark mode"],["🔒","2FA","Two-factor authentication enabled"]].map(([icon,label,desc])=>(
              <div key={label} className="pf-setting-row">
                <span className="pf-setting-icon">{icon}</span>
                <div className="pf-setting-info"><div className="pf-setting-label">{label}</div><div className="pf-setting-desc">{desc}</div></div>
                <div className="pf-toggle pf-toggle-on"/>
              </div>
            ))}
          </div>
          <button className="pf-logout-btn" onClick={()=>{showToast("Signed out.");setTimeout(onLogout,800);}}>🚪 Sign Out</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Stats This Month</div>
        <div className="pf-stats">
          {[{val:248,label:"Vitals Logged",color:"var(--green-bright)"},{val:31,label:"Patients Reviewed",color:"var(--blue-accent)"},{val:12,label:"Notes Added",color:"var(--warning)"},{val:3,label:"Critical Cases",color:"var(--danger)"}].map(s=>(
            <div key={s.label} className="pf-stat"><div className="pf-stat-val" style={{color:s.color}}>{s.val}</div><div className="pf-stat-label">{s.label}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
