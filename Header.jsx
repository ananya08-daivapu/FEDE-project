import "./Header.css";

const NAV = [
  { id:"dashboard",   label:"Dashboard" },
  { id:"patients",    label:"Patients" },
  { id:"vitals",      label:"Log Vitals" },
  { id:"alerts",      label:"Alerts", badge:true },
  { id:"medications", label:"Medications" },
  { id:"notes",       label:"Doctor Notes" },
  { id:"history",     label:"History" },
  { id:"profile",     label:"Profile" },
  { id:"notification",label:"Notifications" },
  { id:"admin",       label:"Admin" },
];

export default function Header({ activeTab, setActiveTab, alertCount, onLogout }) {
  return (
    <header className="app-header">
      <div className="hdr-logo">
        <div className="hdr-logo-icon">🫀</div>
        <div className="hdr-logo-text">Chrono<span>Health</span></div>
      </div>
      <nav className="hdr-nav">
        {NAV.map(item => (
          <button key={item.id} className={`hdr-nav-btn ${activeTab===item.id?"active":""}`} onClick={()=>setActiveTab(item.id)}>
            {item.label}
            {item.badge && alertCount>0 && <span className="hdr-badge">{alertCount}</span>}
          </button>
        ))}
      </nav>
      <div className="hdr-right">
        <span className="hdr-live"><span className="live-dot"/>Live</span>
        <div className="hdr-avatar" title="Logout" onClick={onLogout}>DR</div>
      </div>
    </header>
  );
}
