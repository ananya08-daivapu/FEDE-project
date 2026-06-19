import { useApp } from "../context/AppContext";
import "./AdminPanel.css";

const systemStats = [
  { label:"Total Users",      val:"12",   icon:"👥", color:"var(--green-bright)" },
  { label:"DB Storage Used",  val:"2.4GB",icon:"🗄️",  color:"var(--blue-accent)" },
  { label:"API Calls Today",  val:"1,840",icon:"⚡",  color:"var(--warning)" },
  { label:"Uptime",           val:"99.9%",icon:"🟢",  color:"var(--success)" },
];

const users = [
  { name:"Dr. Rajesh Kumar", role:"Doctor",        email:"dr.rajesh@apollo.com",  status:"active" },
  { name:"Dr. Priya Menon",  role:"Specialist",    email:"priya.m@apollo.com",    status:"active" },
  { name:"Nurse Sita Devi",  role:"Nurse",         email:"sita.devi@apollo.com",  status:"active" },
  { name:"Admin Vikram",     role:"Administrator", email:"admin@apollo.com",      status:"active" },
  { name:"Dr. Arun Patel",   role:"Doctor",        email:"arun.p@apollo.com",     status:"inactive" },
];

export default function AdminPanel() {
  const { patients, alerts } = useApp();

  return (
    <div className="ap-root">
      <div className="ap-kpi">
        {systemStats.map(s=>(
          <div key={s.label} className="card ap-stat">
            <div className="ap-stat-icon">{s.icon}</div>
            <div className="ap-stat-val" style={{color:s.color}}>{s.val}</div>
            <div className="ap-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">User Management <span className="card-badge badge-blue">{users.length} Users</span></div>
          <table className="data-table">
            <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.email}>
                  <td><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{color:"var(--text-dim)",fontSize:11}}>{u.email}</div></td>
                  <td><span className="card-badge badge-blue" style={{fontSize:10}}>{u.role}</span></td>
                  <td><span className={`status-dot ${u.status==="active"?"dot-green":"dot-red"}`}/>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-title">System Health</div>
          <div className="ap-health-list">
            {[
              { label:"Database",      pct:72, color:"var(--blue-accent)" },
              { label:"API Server",    pct:45, color:"var(--green-bright)" },
              { label:"Storage",       pct:58, color:"var(--warning)" },
              { label:"Alert Engine",  pct:91, color:"var(--danger)" },
            ].map(h=>(
              <div key={h.label} className="ap-health-row">
                <div className="ap-health-label">{h.label}</div>
                <div className="ap-health-bar">
                  <div className="ap-health-fill" style={{width:`${h.pct}%`,background:h.color}}/>
                </div>
                <span style={{color:h.color,fontSize:12,fontWeight:600,minWidth:32}}>{h.pct}%</span>
              </div>
            ))}
          </div>

          <div className="ap-system-info">
            <div className="ap-sys-row"><span>Active Patients</span><span style={{color:"var(--green-bright)"}}>{patients.length}</span></div>
            <div className="ap-sys-row"><span>Open Alerts</span><span style={{color:"var(--danger)"}}>{alerts.length}</span></div>
            <div className="ap-sys-row"><span>Last Backup</span><span style={{color:"var(--text-muted)"}}>Today 03:00 AM</span></div>
            <div className="ap-sys-row"><span>App Version</span><span style={{color:"var(--blue-accent)"}}>v2.4.1</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Audit Log <span className="card-badge badge-warn">Recent</span></div>
        <table className="data-table">
          <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Target</th></tr></thead>
          <tbody>
            {[
              ["09:10","Dr. Rajesh","Vitals Logged","Mohammed Ali (P003)"],
              ["08:55","Dr. Priya","Alert Dismissed","High BP Alert"],
              ["08:30","Admin Vikram","User Created","Dr. Arun Patel"],
              ["08:00","Dr. Rajesh","Note Added","Priya Sharma (P002)"],
              ["07:45","System","Backup Completed","Full DB Snapshot"],
            ].map(([time,user,action,target],i)=>(
              <tr key={i}><td style={{color:"var(--text-dim)"}}>{time}</td><td>{user}</td><td>{action}</td><td style={{color:"var(--text-muted)"}}>{target}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
