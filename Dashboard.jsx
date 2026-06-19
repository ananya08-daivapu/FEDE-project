import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import "./Dashboard.css";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function LineChart({ id, labels, datasets }) {
  const ref = useRef(null);
  useEffect(() => {
    const c=ref.current; if(!c)return;
    const ctx=c.getContext("2d"), W=c.parentElement.offsetWidth-48||400, H=180;
    c.width=W; c.height=H;
    const pad={t:20,r:20,b:36,l:44}, cW=W-pad.l-pad.r, cH=H-pad.t-pad.b;
    const all=datasets.flatMap(d=>d.data), mn=Math.min(...all)*.9, mx=Math.max(...all)*1.1;
    const sy=v=>pad.t+cH-((v-mn)/(mx-mn))*cH, sx=i=>pad.l+(i/(labels.length-1))*cW;
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle="rgba(255,255,255,.05)"; ctx.lineWidth=1;
    for(let i=0;i<=4;i++){const y=pad.t+(i/4)*cH;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+cW,y);ctx.stroke();ctx.fillStyle="rgba(138,184,176,.5)";ctx.font="10px Inter";ctx.textAlign="right";ctx.fillText(Math.round(mx-(i/4)*(mx-mn)),pad.l-6,y+3);}
    ctx.fillStyle="rgba(138,184,176,.6)";ctx.font="10px Inter";ctx.textAlign="center";
    labels.forEach((l,i)=>ctx.fillText(l,sx(i),H-8));
    datasets.forEach(ds=>{
      ctx.beginPath();ds.data.forEach((v,i)=>i===0?ctx.moveTo(sx(i),sy(v)):ctx.lineTo(sx(i),sy(v)));
      ctx.strokeStyle=ds.color;ctx.lineWidth=2.5;ctx.lineJoin="round";ctx.stroke();
      ds.data.forEach((v,i)=>{ctx.beginPath();ctx.arc(sx(i),sy(v),4,0,Math.PI*2);ctx.fillStyle=ds.color;ctx.fill();});
    });
  },[]);
  return <canvas ref={ref} id={id}/>;
}

function Gauge({ label, value, pct, color }) {
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current; if(!c)return;
    const ctx=c.getContext("2d");c.width=180;c.height=100;
    const cx=90,cy=90,r=70,s=Math.PI;
    ctx.clearRect(0,0,180,100);
    ctx.beginPath();ctx.arc(cx,cy,r,s,2*Math.PI);ctx.strokeStyle="rgba(255,255,255,.07)";ctx.lineWidth=14;ctx.lineCap="round";ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,r,s,s+pct*Math.PI);ctx.strokeStyle=color;ctx.lineWidth=14;ctx.lineCap="round";ctx.stroke();
  },[pct,color]);
  return <div className="db-gauge"><canvas ref={ref}/><div className="db-gauge-value" style={{color}}>{value}</div><div className="db-gauge-label">{label}</div></div>;
}

export default function Dashboard({ setActiveTab }) {
  const { patients, alerts, vitalsLogged } = useApp();
  const critCount = alerts.filter(a=>a.type==="danger").length;
  return (
    <div className="db-root">
      <div className="db-hero">
        <div>
          <h1 className="db-hero-title">Chronic Disease<br/>Monitoring System</h1>
          <p className="db-hero-sub">Real-time patient health tracking — Hypertension · Diabetes · Cardiac Care</p>
        </div>
        <div className="db-hero-actions">
          <button className="btn-primary" onClick={()=>setActiveTab("vitals")}>+ Log Vitals</button>
          <button className="btn-outline" onClick={()=>setActiveTab("patients")}>View Patients</button>
        </div>
      </div>
      <div className="db-kpi">
        {[
          {label:"Active Patients",      val:patients.length, sub:"↑ 4 this week",           cls:"green"},
          {label:"Vitals Logged Today",  val:vitalsLogged,    sub:"across all patients",      cls:"blue"},
          {label:"Critical Alerts",      val:critCount,       sub:"require immediate action", cls:"warn"},
          {label:"Overdue Reviews",      val:2,               sub:"past scheduled date",      cls:"danger"},
        ].map(k=>(
          <div key={k.label} className={`db-kpi-card db-kpi-${k.cls}`}>
            <div className="db-kpi-label">{k.label}</div>
            <div className="db-kpi-value">{k.val}</div>
            <div className="db-kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-title">Blood Pressure – 7 Days <span className="card-badge badge-blue">mmHg</span></div><div style={{overflowX:"auto"}}><LineChart id="bpChart" labels={DAYS} datasets={[{data:[122,125,118,130,124,119,126],color:"#3ba8ff"},{data:[80,83,78,87,82,79,84],color:"#2dcc8f"}]}/></div></div>
        <div className="card"><div className="card-title">Blood Glucose – 7 Days <span className="card-badge badge-warn">mg/dL</span></div><div style={{overflowX:"auto"}}><LineChart id="gchart" labels={DAYS} datasets={[{data:[108,115,132,140,128,152,138],color:"#ffb347"}]}/></div></div>
      </div>
      <div className="grid-3">
        <div className="card"><div className="card-title">Heart Rate</div><Gauge label="Avg BPM Today" value="74 bpm" pct={0.58} color="#2dcc8f"/></div>
        <div className="card"><div className="card-title">SpO₂ Level</div><Gauge label="Blood Oxygen Avg" value="97%" pct={0.97} color="#3ba8ff"/></div>
        <div className="card"><div className="card-title">BMI Distribution</div><Gauge label="Avg Patient BMI" value="26.4" pct={0.62} color="#ffb347"/></div>
      </div>
      <div className="card">
        <div className="card-title">Recent Alerts <button className="btn-outline" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setActiveTab("alerts")}>View All →</button></div>
        <div className="db-alerts-mini">
          {alerts.slice(0,3).map(a=>(
            <div key={a.id} className={`db-alert-mini db-alert-${a.type}`}><span>{a.icon}</span><span className="db-alert-title">{a.title}</span><span className="db-alert-time">{a.time}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
