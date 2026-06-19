import { useApp } from "../context/AppContext";
import "./Alerts.css";

export default function Alerts() {
  const { alerts, dismissAlert, showToast } = useApp();
  const dismiss = (id) => { dismissAlert(id); showToast("Alert dismissed."); };

  return (
    <div className="al-root">
      <div className="card">
        <div className="card-title">
          Active Alerts
          <span className="card-badge badge-danger">{alerts.filter(a=>a.type==="danger").length} Critical</span>
        </div>
        {alerts.length===0
          ? <div className="al-empty">✅ No active alerts. All patients are stable.</div>
          : alerts.map(a=>(
            <div key={a.id} className={`al-item al-${a.type}`}>
              <div className={`al-icon al-icon-${a.type}`}>{a.icon}</div>
              <div className="al-body">
                <div className="al-title">{a.title}</div>
                <div className="al-desc">{a.desc}</div>
                <div className="al-time">{a.time}</div>
              </div>
              <button className="al-dismiss" onClick={()=>dismiss(a.id)}>✕</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
