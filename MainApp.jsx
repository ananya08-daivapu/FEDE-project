import { useApp } from "../context/AppContext";
import Header from "../components/Header";
import Dashboard    from "./Dashboard";
import Patients     from "./Patients";
import VitalsLog    from "./VitalsLog";
import Alerts       from "./Alerts";
import Medications  from "./Medications";
import DoctorNotes  from "./DoctorNotes";
import History      from "./History";
import Profile      from "./Profile";
import Notification from "./Notification";
import AdminPanel   from "./AdminPanel";
import { useState } from "react";
import "./MainApp.css";

export default function MainApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast, alerts } = useApp();
  const alertCount = alerts.filter(a => a.type === "danger").length;

  const pages = { dashboard:<Dashboard setActiveTab={setActiveTab}/>, patients:<Patients/>, vitals:<VitalsLog/>, alerts:<Alerts/>, medications:<Medications/>, notes:<DoctorNotes/>, history:<History/>, profile:<Profile onLogout={onLogout}/>, notification:<Notification/>, admin:<AdminPanel/> };

  return (
    <div className="main-app">
      <div className="aurora aurora-1"/><div className="aurora aurora-2"/><div className="aurora aurora-3"/>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} alertCount={alertCount} onLogout={onLogout}/>
      <main className="main-content">
        <div className="container">{pages[activeTab]}</div>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
