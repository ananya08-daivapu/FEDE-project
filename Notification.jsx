import { useApp } from "../context/AppContext";
import "./Notification.css";

export default function Notification() {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter(n=>!n.read).length;

  return (
    <div className="nt-root">
      <div className="card">
        <div className="card-title">
          Notifications {unread>0 && <span className="card-badge badge-danger">{unread} New</span>}
          <button className="btn-outline" style={{fontSize:12,padding:"6px 14px"}} onClick={markAllRead}>Mark all read</button>
        </div>
        {notifications.length===0
          ? <div style={{textAlign:"center",padding:"40px",color:"var(--text-muted)"}}>No notifications.</div>
          : notifications.map(n=>(
            <div key={n.id} className={`nt-item ${!n.read?"nt-unread":""}`}>
              <div className="nt-dot" style={{background:n.read?"var(--text-dim)":"var(--green-bright)"}}/>
              <div className="nt-text">{n.text}</div>
              <span className="nt-time">{n.time}</span>
            </div>
          ))
        }
      </div>

      <div className="card">
        <div className="card-title">Alert Preferences</div>
        <div className="nt-prefs">
          {[["🚨","Critical BP Alerts","Notify when BP exceeds 160/100 mmHg","danger"],["🩸","High Glucose Alerts","Notify when glucose exceeds 180 mg/dL","warn"],["💊","Missed Medication","Alert when patient skips medication","warn"],["📋","Overdue Reviews","Remind for overdue monthly reviews","info"],["📧","Email Digest","Daily summary email at 7:00 AM","info"]].map(([icon,label,desc,type])=>(
            <div key={label} className="nt-pref-row">
              <span className="nt-pref-icon">{icon}</span>
              <div className="nt-pref-info"><div className="nt-pref-label">{label}</div><div className="nt-pref-desc">{desc}</div></div>
              <div className="nt-toggle"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
