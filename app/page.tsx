'use client';

import { useState } from 'react';
import { Bell, CalendarDays, CheckCircle2, Circle, FolderKanban, Home, ListTodo, NotebookPen, Search, Settings, Sparkles, Timer, TrendingUp, BarChart3, BookOpen, MoreHorizontal, Plus } from 'lucide-react';

const tasks = [
  ['Data Structures Assignment', 'High Priority · 2h'],
  ['Operating Systems Lecture', 'Medium Priority · 1.5h'],
  ['Database Normalization', 'Medium Priority · 1h'],
  ['DSA Practice', 'Low Priority · 1h'],
];

const projects = [
  ['Waypoint Web App', 75, 'violet'],
  ['Machine Learning', 60, 'blue'],
  ['DBMS Project', 25, 'amber'],
  ['Aptitude Prep', 40, 'green'],
];

function NavItem({ icon: Icon, label, active = false }: any) {
  return <div className={`nav-item ${active ? 'active' : ''}`}><Icon size={16}/><span>{label}</span></div>
}

export default function HomePage() {
  const [running, setRunning] = useState(false);
  const [minutes] = useState(25);
  const [done, setDone] = useState(2);

  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand-mark"><Sparkles size={16}/><span>WAYPOINT</span></div>
        <div className="rail-links">
          <NavItem icon={Home} label="Dashboard" active />
          <NavItem icon={CalendarDays} label="Today" />
          <NavItem icon={ListTodo} label="Tasks" />
          <NavItem icon={FolderKanban} label="Projects" />
          <NavItem icon={CalendarDays} label="Calendar" />
          <NavItem icon={Timer} label="Focus" />
          <NavItem icon={BookOpen} label="Notes" />
          <NavItem icon={NotebookPen} label="Resources" />
          <NavItem icon={BarChart3} label="Analytics" />
          <NavItem icon={Sparkles} label="AI Assistant" />
        </div>
        <div className="rail-footer"><NavItem icon={Settings} label="Settings"/><div className="mini-profile"><div className="avatar">A</div><div><b>Student</b><small>View profile</small></div></div></div>
      </aside>

      <section className="hero-column">
        <header className="topbar">
          <div><p className="eyebrow">WAYPOINT · TODAY</p><h1>Good morning, Student! 👋</h1><p className="sub">Let&apos;s make today productive.</p></div>
          <div className="top-actions"><div className="search"><Search size={15}/><span>Search anything...</span></div><Bell size={19}/><div className="avatar">A</div></div>
        </header>

        <div className="stats-row">
          <Stat label="FOCUS TIME" value="3h 42m" delta="+18% from yesterday" icon={<Timer size={14}/>} />
          <Stat label="TASKS COMPLETED" value={`${done} / 12`} delta="+33% from yesterday" icon={<CheckCircle2 size={14}/>} />
          <Stat label="STREAK" value="12" delta="days in a row" icon={<Sparkles size={14}/>} />
          <Stat label="PRODUCTIVITY" value="84%" delta="+12% from yesterday" icon={<TrendingUp size={14}/>} />
        </div>

        <div className="main-grid">
          <Panel title="Today&apos;s Plan" action="View all">
            <div className="task-list">{tasks.map(([title, meta], i)=><button className="task-row" key={title} onClick={()=>i<done?setDone(Math.max(0,done-1)):setDone(Math.min(12,done+1))}><span className={`task-check ${i<done?'checked':''}`}>{i<done?<CheckCircle2 size={16}/>:<Circle size={16}/>}</span><span className="task-copy"><b>{title}</b><small>{meta}</small></span><MoreHorizontal size={15}/></button>)}</div>
            <button className="add-link" type="button"><Plus size={14}/> Add new task</button>
          </Panel>

          <Panel title="Focus Session">
            <div className="focus-widget"><div className="focus-ring"><div><span>{String(minutes).padStart(2,'0')}:00</span><small>Deep Work</small></div></div><button className="primary" type="button" onClick={()=>setRunning(!running)}>{running?'Pause':'Start Focus'}</button><div className="focus-modes"><span className="pill active">Pomodoro</span><span className="pill">Short Break</span><span className="pill">Long Break</span></div></div>
          </Panel>

          <Panel title="Upcoming" action="View calendar"><div className="upcoming">{[['OS Lab','10:00 AM – 11:00 AM'],['Maths Lecture','11:30 AM – 12:30 PM'],['Project Meeting','02:00 PM – 03:00 PM'],['Aptitude Test','06:00 PM – 07:00 PM']].map(([a,b],i)=><div className="event-row" key={a}><div className={`event-dot d${i}`}></div><div><b>{a}</b><small>{b}</small></div><MoreHorizontal size={15}/></div>)}</div></Panel>

          <Panel title="Weekly Progress" wide><div className="chart"><div className="chart-grid"></div><svg viewBox="0 0 520 180" className="line-chart" aria-label="Weekly progress trend"><path d="M0,132 C35,98 48,130 78,108 S130,142 164,98 S208,118 242,76 S284,100 320,62 S368,88 404,48 S452,86 520,54" fill="none" stroke="url(#g)" strokeWidth="3"/><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%"/><stop offset="50%"/><stop offset="100%"/></linearGradient></defs></svg><div className="xlabels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></Panel>

          <Panel title="Tasks by Category"><div className="donut-wrap"><div className="donut"><div><strong>24</strong><small>Total</small></div></div><div className="legend"><span><i/>Academics <b>12 (50%)</b></span><span><i/>Projects <b>6 (25%)</b></span><span><i/>Practice <b>4 (17%)</b></span><span><i/>Personal <b>2 (8%)</b></span></div></div></Panel>
        </div>
      </section>

      <section className="right-column">
        <div className="feature-focus panel"><div className="feature-head"><span className="pill">Deep Work</span><span>◒</span></div><div className="scene"><div className="orb"><span>{minutes}:00</span><small>Focus on your goal</small><button type="button" onClick={()=>setRunning(!running)}>{running?'Ⅱ Pause':'▶ Start'}</button></div></div><div className="quote">“Make today count.”<small>— Waypoint</small></div></div>

        <Panel title="My Projects"><div className="projects-grid">{projects.map(([name,p,color])=><div className="project-card" key={name}><div className={`project-icon ${color}`}></div><div className="project-meta"><b>{name}</b><small>{p === 100 ? 'Completed':'In Progress'}</small><div className="progress"><span style={{width:`${p}%`}}></span></div></div><strong>{p}%</strong></div>)}</div></Panel>
      </section>

      <section className="bottom-row">
        <Panel title="Calendar"><div className="calendar-box"><div className="calendar-head"><span>May 2024</span><b>29</b></div><div className="cal-grid">{['27','28','29','30','31','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','1','2'].map((d,i)=><span className={d==='29' && i>25?'selected':''} key={i}>{d}</span>)}</div></div></Panel>
        <Panel title="Analytics"><div className="analytics-cards"><div><small>Total Focus Time</small><b>23h 45m</b><span>+15% from last week</span></div><div><small>Most Productive Day</small><b>Friday</b><span>6h 30m</span></div><div><small>Tasks Completed</small><b>42</b><span>+20% from last week</span></div></div><div className="bar-chart">{[48,72,56,86,64,92,58,78,66].map((h,i)=><i key={i} style={{height:`${h}%`}}/>)}</div></Panel>
        <Panel title="AI Study Assistant"><div className="assistant"><div className="assistant-msg"><div className="assistant-icon"><Sparkles size={14}/></div><div><b>Hi! 👋</b><p>How can I help you today?</p></div></div><div className="chips"><button type="button">Plan my day</button><button type="button">Suggest tasks</button><button type="button">Explain a concept</button><button type="button">Summarize notes</button></div><div className="ask"><span>Ask anything...</span><button type="button">➜</button></div></div></Panel>
        <Panel title="Notes"><div className="notes-grid"><div className="note violet"><b>DBMS Important Concepts</b><small>Today</small></div><div className="note teal"><b>OS Memory Management</b><small>Yesterday</small></div><div className="note purple"><b>DSA Patterns</b><small>2 days ago</small></div><div className="note brown"><b>Hyd DBMS Notes</b><small>3 days ago</small></div></div></Panel>
      </section>
    </main>
  )
}

function Stat({label,value,delta,icon}:any){return <div className="stat panel"><div className="stat-label">{icon}{label}</div><strong>{value}</strong><span>{delta}</span></div>}
function Panel({title,children,action,wide=false}:any){return <section className={`panel content-panel ${wide?'wide':''}`}><div className="panel-head"><h3>{title}</h3>{action&&<span>{action}</span>}</div>{children}</section>}
