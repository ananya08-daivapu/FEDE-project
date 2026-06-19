import { useApp } from "../context/AppContext";
import { useEffect, useRef } from "react";
import "./Medications.css";

function AdherenceChart({ data }) {
  const ref = useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d"),W=c.parentElement.offsetWidth-48||360,H=200;
    c.width=W;c.height=H;
    const labels=data.map(d=>d.name.split(" ")[0]),pcts=data.map(d=>d.pct);
    const bW=32,gap=(W-80)/labels.length;
    ctx.clearRect(0,0,W,H);
    labels.forEach((m,i)=>{
      const x=40+i*gap+(gap-bW)/2,hgt=(pcts[i]/100)*150,y=170-hgt;
      const g=ctx.createLinearGradient(0,y,0,170);
      g.addColorStop(0,pcts[i]>80?"#2dcc8f":pcts[i]>60?"#ffb347":"#ff5c72");
      g.addColorStop(1,"rgba(0,0,0,.1)");
      ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(x,y,bW,hgt,5);ctx.fill();
      ctx.fillStyle="rgba(138,184,176,.7)";ctx.font="10px Inter";ctx.textAlign="center";
      ctx.fillText(m.substring(0,7),40+i*gap+gap/2,188);
      ctx.fillStyle="white";ctx.font="bold 11px Inter";
      ctx.fillText(pcts[i]+"%",40+i*gap+gap/2,y-6);
    });
  },[data]);
  return <canvas ref={ref}/>;
}

export default function Medications() {
  const { medications, setMedications, showToast } = useApp();

  const toggle = (id, newStatus) => {
    setMedications(prev=>prev.map(m=>m.id===id?{...m,status:newStatus}:m));
    showToast(`Medication marked as ${newStatus}.`);
  };

  const chartData = [
    {name:"Metformin",   pct:92},
    {name:"Amlodipine",  pct:55},
    {name:"Lisinopril",  pct:78},
    {name:"Atorvastatin",pct:95},
    {name:"Aspirin",     pct:88},
  ];

  const statusColor = s => s==="taken"?"var(--success)":s==="missed"?"var(--danger)":"var(--warning)";
  const statusLabel = s => s==="taken"?"✓ Taken":s==="missed"?"✗ Missed":"⏳ Pending";

  return (
    <div className="med-root">
      <div className="grid-2">
        <div className="card">
          <div className="card-title">Medication Schedule <span className="card-badge badge-green">Today</span></div>
          {medications.map(m=>(
            <div key={m.id} className="med-item">
              <div className="med-icon" style={{background:m.color}}>{m.icon}</div>
              <div className="med-info"><div className="med-name">{m.name}</div><div className="med-schedule">{m.schedule}</div></div>
              <div className="med-actions">
                <span style={{color:statusColor(m.status),fontWeight:600,fontSize:12,marginRight:8}}>{statusLabel(m.status)}</span>
                {m.status!=="taken"  && <button className="med-btn med-btn-green" onClick={()=>toggle(m.id,"taken")}>Mark Taken</button>}
                {m.status!=="missed" && <button className="med-btn med-btn-red"   onClick={()=>toggle(m.id,"missed")}>Mark Missed</button>}
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Adherence Overview <span className="card-badge badge-blue">This Week</span></div>
          <div style={{overflowX:"auto"}}><AdherenceChart data={chartData}/></div>
          <div className="med-stats">
            <div className="med-stat"><div className="med-stat-val" style={{color:"var(--success)"}}>82%</div><div className="med-stat-label">Overall Adherence</div></div>
            <div className="med-stat"><div className="med-stat-val" style={{color:"var(--warning)"}}>2</div><div className="med-stat-label">Missed Today</div></div>
            <div className="med-stat"><div className="med-stat-val" style={{color:"var(--blue-accent)"}}>5</div><div className="med-stat-label">Active Meds</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
