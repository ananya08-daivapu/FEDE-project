import { useState, useEffect, useRef } from "react";
import "./LoginPage.css";

function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, animId;
    const COLORS = ["rgba(45,204,143,","rgba(59,168,255,","rgba(0,220,180,","rgba(100,120,255,"];
    const particles = Array.from({length:70}, () => ({
      x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
      r:Math.random()*1.6+.3, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3,
      alpha:Math.random()*.5+.15, color:COLORS[Math.floor(Math.random()*COLORS.length)],
      pulse:Math.random()*Math.PI*2
    }));
    function resize() { W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    function draw() {
      ctx.clearRect(0,0,W,H);
      const t=Date.now()/1000;
      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        const a=p.alpha*(0.7+0.3*Math.sin(t*1.2+p.pulse));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=p.color+a+")"; ctx.fill();
      });
      for(let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++) {
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){ ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle="rgba(45,204,143,"+(0.07*(1-d/110))+")"; ctx.lineWidth=.5; ctx.stroke(); }
      }
      animId=requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}} />;
}

function strengthCheck(val) {
  let s=0;
  if(val.length>=8)s++; if(/[A-Z]/.test(val))s++; if(/[0-9]/.test(val))s++; if(/[^A-Za-z0-9]/.test(val))s++;
  const lvls=[{w:"25%",color:"#ff5c72",text:"Weak"},{w:"50%",color:"#ffb347",text:"Fair"},{w:"75%",color:"#3ba8ff",text:"Good"},{w:"100%",color:"#2dcc8f",text:"Strong 💪"}];
  return lvls[s-1]||lvls[0];
}

export default function LoginPage({ onLogin }) {
  const [tab, setTab]         = useState("login");
  const [success, setSuccess] = useState(null);
  const [loginErr, setLoginErr]   = useState("");
  const [regErr, setRegErr]       = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showPw2, setShowPw2]     = useState(false);
  const [pw, setPw]               = useState("");
  const [strength, setStrength]   = useState(null);

  const [loginFields, setLogin]   = useState({ email:"", password:"" });
  const [regFields, setReg]       = useState({ fname:"", lname:"", email:"", hospital:"", phone:"", password:"", confirm:"" });

  function doLogin() {
    setLoginErr("");
    if(!loginFields.email||!loginFields.password){ setLoginErr("Please enter your email and password."); return; }
    if(!loginFields.email.includes("@")){ setLoginErr("Please enter a valid email address."); return; }
    setSuccess({ title:"Welcome back, Doctor!", sub:"Redirecting to your dashboard…" });
    setTimeout(onLogin, 1400);
  }

  function doRegister() {
    setRegErr("");
    const {fname,lname,email,password,confirm}=regFields;
    if(!fname||!lname){ setRegErr("Please enter your full name."); return; }
    if(!email.includes("@")){ setRegErr("Please enter a valid email address."); return; }
    if(password.length<6){ setRegErr("Password must be at least 6 characters."); return; }
    if(password!==confirm){ setRegErr("Passwords do not match."); return; }
    setSuccess({ title:"Account created!", sub:`Welcome, Dr. ${fname} ${lname}. Your account is ready.` });
    setTimeout(onLogin, 1400);
  }

  return (
    <div className="lp-root">
      <ParticleCanvas />
      <div className="aurora aurora-1" /><div className="aurora aurora-2" /><div className="aurora aurora-3" />
      <div className="lp-page">
        <div className="lp-card">
          <div className="lp-logo">
            <div className="lp-logo-icon">🫀</div>
            <div className="lp-logo-text">Chrono<span>Health</span></div>
          </div>

          {success ? (
            <div className="lp-success">
              <div className="lp-success-icon">✅</div>
              <div className="lp-success-title">{success.title}</div>
              <div className="lp-success-sub">{success.sub}</div>
              <button className="lp-submit" onClick={onLogin}>Open Dashboard →</button>
            </div>
          ) : (<>
            <div className="lp-tabs">
              <button className={`lp-tab ${tab==="login"?"active":""}`} onClick={()=>setTab("login")}>Sign In</button>
              <button className={`lp-tab ${tab==="register"?"active":""}`} onClick={()=>setTab("register")}>Register</button>
            </div>

            {tab==="login" && (
              <div className="lp-form">
                <div className="lp-form-title">Welcome back</div>
                <div className="lp-form-sub">Sign in to your ChronoHealth account</div>
                {loginErr && <div className="lp-error">{loginErr}</div>}
                <div className="lp-input-group">
                  <label>Email Address</label>
                  <div className="lp-input-wrap">
                    <span className="lp-icon">📧</span>
                    <input type="email" placeholder="doctor@hospital.com" value={loginFields.email} onChange={e=>setLogin({...loginFields,email:e.target.value})} />
                  </div>
                </div>
                <div className="lp-input-group">
                  <label>Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-icon">🔒</span>
                    <input type={showPw?"text":"password"} placeholder="Your password" value={loginFields.password} onChange={e=>setLogin({...loginFields,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
                    <button className="lp-toggle-pw" type="button" onClick={()=>setShowPw(!showPw)}>{showPw?"🙈":"👁"}</button>
                  </div>
                </div>
                <div className="lp-forgot"><a href="#" onClick={e=>{e.preventDefault();alert("Password reset link sent! (Demo)")}}>Forgot password?</a></div>
                <button className="lp-submit" onClick={doLogin}>Sign In</button>
                <div className="lp-divider">or continue with</div>
                <div className="lp-social-row">
                  <button className="lp-social-btn" onClick={()=>{setSuccess({title:"Signed in with Google!",sub:"Redirecting…"});setTimeout(onLogin,1400)}}>🌐 Google</button>
                  <button className="lp-social-btn" onClick={()=>{setSuccess({title:"Signed in with Microsoft!",sub:"Redirecting…"});setTimeout(onLogin,1400)}}>🪟 Microsoft</button>
                </div>
              </div>
            )}

            {tab==="register" && (
              <div className="lp-form">
                <div className="lp-form-title">Create account</div>
                <div className="lp-form-sub">Join ChronoHealth — HIPAA-compliant & secure</div>
                {regErr && <div className="lp-error">{regErr}</div>}
                <div className="lp-two-col">
                  <div className="lp-input-group">
                    <label>First Name</label>
                    <div className="lp-input-wrap"><span className="lp-icon">👤</span><input type="text" placeholder="Rajesh" value={regFields.fname} onChange={e=>setReg({...regFields,fname:e.target.value})} /></div>
                  </div>
                  <div className="lp-input-group">
                    <label>Last Name</label>
                    <div className="lp-input-wrap"><span className="lp-icon">👤</span><input type="text" placeholder="Kumar" value={regFields.lname} onChange={e=>setReg({...regFields,lname:e.target.value})} /></div>
                  </div>
                </div>
                <div className="lp-input-group">
                  <label>Email Address</label>
                  <div className="lp-input-wrap"><span className="lp-icon">📧</span><input type="email" placeholder="doctor@hospital.com" value={regFields.email} onChange={e=>setReg({...regFields,email:e.target.value})} /></div>
                </div>
                <div className="lp-input-group">
                  <label>Hospital / Organisation</label>
                  <div className="lp-input-wrap"><span className="lp-icon">🏥</span><input type="text" placeholder="Apollo Hospitals, Hyderabad" value={regFields.hospital} onChange={e=>setReg({...regFields,hospital:e.target.value})} /></div>
                </div>
                <div className="lp-input-group">
                  <label>Password</label>
                  <div className="lp-input-wrap">
                    <span className="lp-icon">🔒</span>
                    <input type={showPw?"text":"password"} placeholder="Create a strong password" value={regFields.password} onChange={e=>{setReg({...regFields,password:e.target.value});setStrength(e.target.value?strengthCheck(e.target.value):null)}} />
                    <button className="lp-toggle-pw" type="button" onClick={()=>setShowPw(!showPw)}>{showPw?"🙈":"👁"}</button>
                  </div>
                  {strength && <div className="lp-strength"><div className="lp-strength-bar"><div style={{width:strength.w,background:strength.color}} /></div><span style={{color:strength.color,fontSize:11}}>{strength.text}</span></div>}
                </div>
                <div className="lp-input-group">
                  <label>Confirm Password</label>
                  <div className="lp-input-wrap"><span className="lp-icon">🔒</span><input type={showPw2?"text":"password"} placeholder="Re-enter password" value={regFields.confirm} onChange={e=>setReg({...regFields,confirm:e.target.value})} /><button className="lp-toggle-pw" type="button" onClick={()=>setShowPw2(!showPw2)}>{showPw2?"🙈":"👁"}</button></div>
                </div>
                <button className="lp-submit" onClick={doRegister}>Create Account</button>
                <div className="lp-terms">By registering you agree to our <a href="#">Terms</a> & <a href="#">Privacy Policy</a>. Patient data is HIPAA-compliant.</div>
              </div>
            )}
          </>)}
        </div>
      </div>
    </div>
  );
}
