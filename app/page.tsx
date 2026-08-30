'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  FolderKanban,
  Home,
  ListTodo,
  LogOut,
  Menu,
  MoreHorizontal,
  NotebookPen,
  Pause,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type View = 'dashboard' | 'today' | 'tasks' | 'projects' | 'calendar' | 'focus' | 'notes' | 'resources' | 'analytics' | 'assistant' | 'settings'
type Task = { id: number; title: string; subject: string; priority: 'High' | 'Medium' | 'Low'; minutes: number; done: boolean }
type Project = { id: number; name: string; description: string; progress: number; color: string }
type Note = { id: number; title: string; body: string; updated: string }

const initialTasks: Task[] = [
  { id: 1, title: 'Finish Data Structures assignment', subject: 'DSA', priority: 'High', minutes: 120, done: true },
  { id: 2, title: 'Review Operating Systems lecture', subject: 'Operating Systems', priority: 'Medium', minutes: 90, done: true },
  { id: 3, title: 'Practice database normalization', subject: 'DBMS', priority: 'Medium', minutes: 60, done: false },
  { id: 4, title: 'Complete 20 DSA problems', subject: 'Practice', priority: 'Low', minutes: 60, done: false },
]

const initialProjects: Project[] = [
  { id: 1, name: 'Waypoint', description: 'Student productivity workspace', progress: 76, color: 'purple' },
  { id: 2, name: 'Machine Learning', description: 'Semester project', progress: 61, color: 'blue' },
  { id: 3, name: 'DBMS Project', description: 'Database design & API', progress: 34, color: 'amber' },
  { id: 4, name: 'Aptitude Prep', description: 'Placement preparation', progress: 48, color: 'green' },
]

const initialNotes: Note[] = [
  { id: 1, title: 'DBMS Important Concepts', body: 'Normalization, indexing, transactions and ACID.', updated: 'Today' },
  { id: 2, title: 'OS Memory Management', body: 'Paging, segmentation and virtual memory.', updated: 'Yesterday' },
  { id: 3, title: 'DSA Patterns', body: 'Two pointers, sliding window and binary search.', updated: '2 days ago' },
]

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'focus', label: 'Focus', icon: Timer },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
]

export default function HomePage() {
  const [view, setView] = useState<View>('dashboard')
  const [mobileNav, setMobileNav] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [query, setQuery] = useState('')
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [focusSeconds, setFocusSeconds] = useState(25 * 60)
  const [focusRunning, setFocusRunning] = useState(false)
  const [focusMode, setFocusMode] = useState<'Focus' | 'Short break' | 'Long break'>('Focus')
  const [assistantInput, setAssistantInput] = useState('')
  const [assistantReply, setAssistantReply] = useState('Tell me what you need to get done. I can turn it into a realistic study plan.')

  useEffect(() => {
    const saved = window.localStorage.getItem('waypoint-tasks')
    if (saved) setTasks(JSON.parse(saved) as Task[])
  }, [])

  useEffect(() => {
    window.localStorage.setItem('waypoint-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (!focusRunning) return
    const timer = window.setInterval(() => {
      setFocusSeconds((value) => {
        if (value <= 1) {
          setFocusRunning(false)
          return focusMode === 'Focus' ? 5 * 60 : 25 * 60
        }
        return value - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [focusRunning, focusMode])

  const completed = tasks.filter((task) => task.done).length
  const filteredTasks = useMemo(() => tasks.filter((task) => `${task.title} ${task.subject}`.toLowerCase().includes(query.toLowerCase())), [tasks, query])
  const focusLabel = `${String(Math.floor(focusSeconds / 60)).padStart(2, '0')}:${String(focusSeconds % 60).padStart(2, '0')}`

  function toggleTask(id: number) {
    setTasks((items) => items.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  function addTask() {
    const title = newTask.trim()
    if (!title) return
    setTasks((items) => [...items, { id: Date.now(), title, subject: 'Personal', priority: 'Medium', minutes: 60, done: false }])
    setNewTask('')
    setShowAddTask(false)
  }

  function selectFocusMode(mode: 'Focus' | 'Short break' | 'Long break') {
    setFocusMode(mode)
    setFocusRunning(false)
    setFocusSeconds(mode === 'Focus' ? 25 * 60 : mode === 'Short break' ? 5 * 60 : 15 * 60)
  }

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  function askAssistant() {
    const text = assistantInput.trim()
    if (!text) return
    const lower = text.toLowerCase()
    if (lower.includes('plan') || lower.includes('day')) {
      setAssistantReply('Start with the unfinished DBMS task for 60 minutes, take a 10-minute break, then do 45 minutes of DSA practice. Keep the evening free for your project work.')
    } else if (lower.includes('dsa')) {
      setAssistantReply('For DSA today: warm up with two-pointer problems, then do one binary-search problem and finish with a 10-minute review of mistakes.')
    } else if (lower.includes('dbms')) {
      setAssistantReply('For DBMS, focus on normalization first: 1NF → 2NF → 3NF → BCNF. Then solve two decomposition examples without looking at your notes.')
    } else {
      setAssistantReply(`For “${text}”, I would break the work into a 25-minute focused block, a short review, and one concrete next action. Start small and finish the first block before planning more.`)
    }
    setAssistantInput('')
  }

  return (
    <div className="waypoint-app">
      <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
        <div className="brand"><div className="brand-icon"><Sparkles size={17} /></div><div><strong>WAYPOINT</strong><span>Student workspace</span></div></div>
        <div className="workspace-switcher"><div className="workspace-avatar">A</div><div><small>WORKSPACE</small><b>My semester</b></div><ChevronRight size={15} /></div>
        <nav>
          <span className="nav-section">WORKSPACE</span>
          {navItems.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'nav-button active' : 'nav-button'} onClick={() => { setView(id); setMobileNav(false) }}><Icon size={17} /><span>{label}</span>{id === 'assistant' && <em>AI</em>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <button className={view === 'settings' ? 'nav-button active' : 'nav-button'} onClick={() => setView('settings')}><Settings size={17} /><span>Settings</span></button>
          <button className="profile" onClick={() => setView('settings')}><div className="avatar">A</div><div><b>Student</b><small>Personal workspace</small></div><MoreHorizontal size={16} /></button>
        </div>
      </aside>

      <div className="page-wrap">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)}><Menu size={20} /></button>
          <div className="breadcrumbs"><span>WAYPOINT</span><ChevronRight size={13} /><b>{navItems.find((item) => item.id === view)?.label ?? 'Settings'}</b></div>
          <div className="topbar-actions">
            <label className="global-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, projects..." /><kbd>⌘ K</kbd></label>
            <button className="icon-button"><Bell size={18} /></button>
            <button className="avatar top-avatar" onClick={() => setView('settings')}>A</button>
          </div>
        </header>

        <main className="content">
          {view === 'dashboard' && <Dashboard tasks={tasks} projects={projects} completed={completed} onToggle={toggleTask} onView={setView} onAdd={() => setShowAddTask(true)} />}
          {view === 'today' && <Today tasks={filteredTasks} onToggle={toggleTask} onAdd={() => setShowAddTask(true)} />}
          {view === 'tasks' && <Tasks tasks={filteredTasks} onToggle={toggleTask} onAdd={() => setShowAddTask(true)} />}
          {view === 'projects' && <Projects projects={projects} setProjects={setProjects} />}
          {view === 'calendar' && <Calendar />}
          {view === 'focus' && <Focus focusLabel={focusLabel} running={focusRunning} mode={focusMode} onToggle={() => setFocusRunning((value) => !value)} onMode={selectFocusMode} onReset={() => { setFocusRunning(false); setFocusSeconds(focusMode === 'Focus' ? 25 * 60 : focusMode === 'Short break' ? 5 * 60 : 15 * 60) }} />}
          {view === 'notes' && <Notes notes={notes} setNotes={setNotes} />}
          {view === 'resources' && <Resources />}
          {view === 'analytics' && <Analytics completed={completed} total={tasks.length} />}
          {view === 'assistant' && <Assistant input={assistantInput} reply={assistantReply} setInput={setAssistantInput} ask={askAssistant} />}
          {view === 'settings' && <SettingsView onSignOut={signOut} />}
        </main>
      </div>

      {showAddTask && <div className="modal-backdrop" onMouseDown={() => setShowAddTask(false)}><div className="modal" onMouseDown={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">QUICK CAPTURE</span><h2>Add a task</h2></div><button className="icon-button" onClick={() => setShowAddTask(false)}><X size={18} /></button></div><input autoFocus value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addTask()} placeholder="What needs to get done?" /><button className="primary-button" onClick={addTask}>Create task <ArrowRight size={16} /></button></div></div>}
      {mobileNav && <button className="nav-overlay" aria-label="Close menu" onClick={() => setMobileNav(false)} />}
    </div>
  )
}

function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>
}

function Panel({ title, action, children, className = '' }: { title: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}><div className="card-head"><h2>{title}</h2>{action}</div>{children}</section>
}

function Dashboard({ tasks, projects, completed, onToggle, onView, onAdd }: { tasks: Task[]; projects: Project[]; completed: number; onToggle: (id: number) => void; onView: (view: View) => void; onAdd: () => void }) {
  return <>
    <PageHeader eyebrow="SUNDAY · 30 AUGUST" title="Good evening, Student." subtitle="Here’s a clear view of what matters next." action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> Add task</button>} />
    <div className="stat-grid"><Stat icon={<Clock3 />} label="Focus time" value="3h 42m" trend="+18%" /><Stat icon={<CheckCircle2 />} label="Completed" value={`${completed}/${tasks.length}`} trend="+33%" /><Stat icon={<Zap />} label="Current streak" value="12 days" trend="+2" /><Stat icon={<TrendingUp />} label="Productivity" value="84%" trend="+12%" /></div>
    <div className="dashboard-grid">
      <Panel title="Today’s plan" action={<button className="text-button" onClick={() => onView('tasks')}>View all <ArrowRight size={13} /></button>} className="tasks-card"><div className="task-progress"><div><b>{completed} of {tasks.length} complete</b><span>Keep the momentum going.</span></div><strong>{Math.round((completed / Math.max(tasks.length, 1)) * 100)}%</strong></div><div className="progress-track"><span style={{ width: `${(completed / Math.max(tasks.length, 1)) * 100}%` }} /></div><div className="task-list">{tasks.slice(0, 4).map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} />)}</div><button className="add-row" onClick={onAdd}><Plus size={15} /> Add another task</button></Panel>
      <Panel title="Focus session" action={<button className="text-button" onClick={() => onView('focus')}>Open focus <ArrowRight size={13} /></button>}><MiniFocus /></Panel>
      <Panel title="Upcoming" action={<button className="text-button" onClick={() => onView('calendar')}>Calendar <ArrowRight size={13} /></button>}><div className="events"><Event time="10:00" period="AM" title="OS Lab" type="green" /><Event time="11:30" period="AM" title="Maths Lecture" type="amber" /><Event time="02:00" period="PM" title="Project Meeting" type="purple" /><Event time="06:00" period="PM" title="Aptitude Test" type="red" /></div></Panel>
      <Panel title="Projects" action={<button className="text-button" onClick={() => onView('projects')}>Manage <ArrowRight size={13} /></button>} className="projects-card"><div className="project-list">{projects.map((project) => <ProjectRow key={project.id} project={project} />)}</div></Panel>
      <Panel title="Weekly progress" action={<span className="muted-label">Last 7 days</span>} className="weekly-card"><WeeklyChart /></Panel>
      <Panel title="AI study assistant" action={<button className="text-button" onClick={() => onView('assistant')}>Open AI <Sparkles size={13} /></button>} className="ai-card"><div className="ai-preview"><div className="ai-avatar"><Sparkles size={16} /></div><div><b>Ready when you are.</b><p>Plan your day, break down a topic, or turn a deadline into a study plan.</p></div></div><button className="assistant-prompt" onClick={() => onView('assistant')}>Ask Waypoint anything <ArrowRight size={15} /></button></Panel>
    </div>
  </>
}

function Stat({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string; trend: string }) { return <div className="stat-card"><div className="stat-icon">{icon}</div><div className="stat-copy"><span>{label}</span><b>{value}</b><small>{trend} from last week</small></div></div> }

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) { return <button className="task-row" onClick={() => onToggle(task.id)}><span className={`check ${task.done ? 'done' : ''}`}>{task.done ? <Check size={13} /> : null}</span><span className="task-main"><b className={task.done ? 'strike' : ''}>{task.title}</b><small>{task.subject} · {task.minutes} min</small></span><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span></button> }

function MiniFocus() { const [seconds, setSeconds] = useState(25 * 60); const [running, setRunning] = useState(false); useEffect(() => { if (!running) return; const timer = window.setInterval(() => setSeconds((s) => s > 0 ? s - 1 : 25 * 60), 1000); return () => window.clearInterval(timer) }, [running]); const progress = 1 - seconds / (25 * 60); return <div className="mini-focus"><div className="timer-circle" style={{ '--progress': `${progress * 360}deg` } as React.CSSProperties}><div><strong>{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</strong><span>Deep work</span></div></div><button className="primary-button compact" onClick={() => setRunning((v) => !v)}>{running ? <Pause size={15} /> : <Timer size={15} />}{running ? 'Pause' : 'Start focus'}</button></div> }

function Event({ time, period, title, type }: { time: string; period: string; title: string; type: string }) { return <div className="event"><span className={`event-dot ${type}`} /><div><b>{title}</b><small>{time} {period} · Today</small></div><MoreHorizontal size={16} /></div> }

function ProjectRow({ project }: { project: Project }) { return <div className="project-row"><div className={`project-logo ${project.color}`}>{project.name.slice(0, 1)}</div><div className="project-info"><b>{project.name}</b><small>{project.description}</small><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div></div><strong>{project.progress}%</strong></div> }

function WeeklyChart() { const bars = [42, 62, 48, 78, 66, 91, 72]; return <div className="weekly"><div className="chart-summary"><div><b>18h 35m</b><span>total focus</span></div><div className="chart-change">↑ 15%</div></div><div className="bar-grid">{bars.map((height, i) => <div className="bar-col" key={i}><span style={{ height: `${height}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</small></div>)}</div></div> }

function Today({ tasks, onToggle, onAdd }: { tasks: Task[]; onToggle: (id: number) => void; onAdd: () => void }) { return <><PageHeader eyebrow="TODAY" title="Your day, organized." subtitle="One place for tasks, focus blocks, and what’s coming up." action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> Add task</button>} /><div className="two-col"><Panel title="Priority tasks" action={<span className="muted-label">{tasks.filter(t => !t.done).length} remaining</span>}><div className="task-list spacious">{tasks.map((task) => <TaskRow key={task.id} task={task} onToggle={onToggle} />)}</div></Panel><Panel title="Suggested rhythm"><div className="timeline"><div><b>Now</b><span>25 min deep work</span></div><div><b>+25 min</b><span>10 min break</span></div><div><b>+35 min</b><span>45 min practice</span></div><div><b>Evening</b><span>Review & plan tomorrow</span></div></div></Panel></div></> }

function Tasks({ tasks, onToggle, onAdd }: { tasks: Task[]; onToggle: (id: number) => void; onAdd: () => void }) { return <><PageHeader eyebrow="TASKS" title="Everything you need to do." subtitle="Capture it once, then work from the list instead of your head." action={<button className="primary-button" onClick={onAdd}><Plus size={17} /> New task</button>} /><Panel title="All tasks" action={<span className="muted-label">{tasks.length} tasks</span>}><div className="task-table"><div className="table-head"><span>Task</span><span>Priority</span><span>Time</span><span>Status</span></div>{tasks.map((task) => <div className="table-row" key={task.id}><button className={`check ${task.done ? 'done' : ''}`} onClick={() => onToggle(task.id)}>{task.done && <Check size={13} />}</button><div><b className={task.done ? 'strike' : ''}>{task.title}</b><small>{task.subject}</small></div><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span><span className="time-cell">{task.minutes} min</span><span className={task.done ? 'status done-status' : 'status'}>{task.done ? 'Completed' : 'To do'}</span></div>)}</div></Panel></> }

function Projects({ projects, setProjects }: { projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>> }) { const [name, setName] = useState(''); function add() { if (!name.trim()) return; setProjects((items) => [...items, { id: Date.now(), name: name.trim(), description: 'New project', progress: 0, color: 'purple' }]); setName('') } return <><PageHeader eyebrow="PROJECTS" title="Build toward something bigger." subtitle="Keep semester work, side projects, and goals moving forward." /><div className="project-toolbar"><input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} placeholder="Name a new project..." /><button className="secondary-button" onClick={add}><Plus size={16} /> Create</button></div><div className="project-grid">{projects.map((project) => <div className="large-project card" key={project.id}><div className={`project-logo large ${project.color}`}>{project.name.slice(0, 1)}</div><div className="large-project-head"><div><h3>{project.name}</h3><p>{project.description}</p></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="large-progress"><div><span>Progress</span><b>{project.progress}%</b></div><div className="progress-track"><span style={{ width: `${project.progress}%` }} /></div></div><div className="project-foot"><span><Target size={14} /> Active goal</span><button className="text-button">Open <ArrowRight size={13} /></button></div></div>)}</div></> }

function Calendar() { const days = Array.from({ length: 35 }, (_, i) => i - 4); return <><PageHeader eyebrow="CALENDAR" title="Your week at a glance." subtitle="Classes, meetings, deadlines, and focus blocks in one view." action={<button className="secondary-button"><Plus size={16} /> Add event</button>} /><Panel title="August 2026" action={<div className="calendar-nav"><button className="icon-button"><ChevronLeft size={16} /></button><button className="icon-button"><ChevronRight size={16} /></button></div>}><div className="calendar-grid"><div className="calendar-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <b key={d}>{d}</b>)}</div><div className="calendar-days">{days.map((day, i) => { const current = day === 30; const muted = day < 1 || day > 31; return <div className={`calendar-day ${current ? 'today-day' : ''} ${muted ? 'muted-day' : ''}`} key={i}><span>{muted ? (day < 1 ? 27 + i : day - 31) : day}</span>{!muted && day % 5 === 0 && <i className="calendar-dot" />}</div> })}</div></div><div className="calendar-events"><Event time="10:00" period="AM" title="OS Lab" type="green" /><Event time="02:00" period="PM" title="Project Meeting" type="purple" /><Event time="06:00" period="PM" title="Aptitude Test" type="red" /></div></Panel></> }

function Focus({ focusLabel, running, mode, onToggle, onMode, onReset }: { focusLabel: string; running: boolean; mode: 'Focus' | 'Short break' | 'Long break'; onToggle: () => void; onMode: (mode: 'Focus' | 'Short break' | 'Long break') => void; onReset: () => void }) { return <><PageHeader eyebrow="FOCUS" title="Make distraction expensive." subtitle="A simple timer for doing one important thing at a time." /><div className="focus-layout"><Panel title="Timer" className="focus-main"><div className="focus-tabs">{(['Focus', 'Short break', 'Long break'] as const).map((item) => <button className={mode === item ? 'active' : ''} onClick={() => onMode(item)} key={item}>{item}</button>)}</div><div className="big-timer"><div className="timer-circle huge"><div><span>{focusLabel}</span><small>{mode === 'Focus' ? 'Deep work' : 'Recharge'}</small></div></div><div className="timer-actions"><button className="primary-button" onClick={onToggle}>{running ? <Pause size={17} /> : <Timer size={17} />}{running ? 'Pause timer' : 'Start focus'}</button><button className="secondary-button" onClick={onReset}>Reset</button></div></div></Panel><Panel title="Focus habits"><div className="habit-list"><div><CheckCircle2 size={17} /><span>Phone away</span><b>Ready</b></div><div><CheckCircle2 size={17} /><span>One task selected</span><b>Ready</b></div><div><CheckCircle2 size={17} /><span>Next break planned</span><b>5 min</b></div></div></Panel></div></> }

function Notes({ notes, setNotes }: { notes: Note[]; setNotes: React.Dispatch<React.SetStateAction<Note[]>> }) { function add() { setNotes((items) => [{ id: Date.now(), title: 'New note', body: 'Start writing your thoughts here.', updated: 'Just now' }, ...items]) } return <><PageHeader eyebrow="NOTES" title="Keep your learning close." subtitle="Short notes are easier to revisit than scattered tabs and screenshots." action={<button className="primary-button" onClick={add}><Plus size={17} /> New note</button>} /><div className="notes-grid">{notes.map((note) => <article className="note-card card" key={note.id}><div className="note-top"><span>{note.updated}</span><button className="icon-button" onClick={() => setNotes(items => items.filter(n => n.id !== note.id))}><Trash2 size={15} /></button></div><h3>{note.title}</h3><p>{note.body}</p><button className="text-button">Open note <ArrowRight size={13} /></button></article>)}</div></> }

function Resources() { const resources = [['DSA Roadmap', 'A practical sequence for arrays → graphs → DP.', 'DSA'], ['Exam Checklist', 'Revision, past papers, weak topics, and final review.', 'Exams'], ['Project Template', 'Turn an idea into milestones and weekly deliverables.', 'Projects'], ['Study Method', 'Use active recall, spaced repetition, and focused blocks.', 'Learning']]; return <><PageHeader eyebrow="RESOURCES" title="Your personal study shelf." subtitle="Useful references without the clutter of a dozen browser tabs." /><div className="resource-grid">{resources.map(([title, body, tag]) => <article className="resource-card card" key={title}><span className="resource-tag">{tag}</span><BookOpen size={21} /><h3>{title}</h3><p>{body}</p><button className="text-button">Open resource <ArrowRight size={13} /></button></article>)}</div></> }

function Analytics({ completed, total }: { completed: number; total: number }) { return <><PageHeader eyebrow="ANALYTICS" title="See how you’re actually working." subtitle="Use the signal to adjust your week, not to judge yourself." /><div className="stat-grid"><Stat icon={<Clock3 />} label="Focus this week" value="18h 35m" trend="15%" /><Stat icon={<CheckCircle2 />} label="Tasks completed" value={`${completed}`} trend="20%" /><Stat icon={<Activity />} label="Consistency" value="82%" trend="8%" /><Stat icon={<Target />} label="Goal progress" value="68%" trend="11%" /></div><div className="two-col"><Panel title="Focus by day"><WeeklyChart /></Panel><Panel title="Completion health"><div className="health"><div className="health-ring"><strong>{Math.round((completed / Math.max(total, 1)) * 100)}%</strong><span>complete</span></div><div><b>Good momentum</b><p>You’re finishing more tasks than you did last week. Keep the daily list small and specific.</p><div className="legend-line"><i /> Completed <span>{completed}</span></div><div className="legend-line"><i /> Remaining <span>{Math.max(total - completed, 0)}</span></div></div></div></Panel></div></> }

function Assistant({ input, reply, setInput, ask }: { input: string; reply: string; setInput: (value: string) => void; ask: () => void }) { return <><PageHeader eyebrow="AI ASSISTANT" title="Think with Waypoint." subtitle="A focused study copilot for planning, explaining, and getting unstuck." /><div className="assistant-layout"><Panel title="Conversation" className="assistant-main"><div className="assistant-message"><div className="ai-avatar"><Sparkles size={16} /></div><div><b>Waypoint AI</b><p>{reply}</p></div></div><div className="suggestion-row"><button onClick={() => { setInput('Plan my day'); setTimeout(ask, 0) }}>Plan my day</button><button onClick={() => { setInput('Help me with DSA'); setTimeout(ask, 0) }}>DSA help</button><button onClick={() => { setInput('Explain DBMS'); setTimeout(ask, 0) }}>Explain DBMS</button></div><div className="assistant-input"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()} placeholder="Ask anything about your studies..." /><button onClick={ask}><ArrowRight size={17} /></button></div></Panel><Panel title="What I can do"><div className="capabilities"><div><Sparkles size={17} /><b>Plan</b><span>Turn deadlines into realistic sessions.</span></div><div><BookOpen size={17} /><b>Explain</b><span>Break difficult concepts into steps.</span></div><div><Target size={17} /><b>Review</b><span>Help you decide what to study next.</span></div></div></Panel></div></> }

function SettingsView({ onSignOut }: { onSignOut: () => void }) { return <><PageHeader eyebrow="SETTINGS" title="Make Waypoint yours." subtitle="Your workspace preferences and account controls." /><div className="settings-grid"><Panel title="Workspace"><SettingRow title="Daily planning" body="Show your plan first when opening Waypoint." enabled /><SettingRow title="Focus reminders" body="Keep focus sessions visible while you work." enabled /><SettingRow title="Weekly review" body="Prepare a summary of completed and remaining work." enabled={false} /></Panel><Panel title="Account"><div className="account-box"><div className="avatar large-avatar">A</div><div><b>Student</b><p>Google account connected</p></div></div><button className="danger-button" onClick={onSignOut}><LogOut size={16} /> Sign out</button></Panel></div></> }

function SettingRow({ title, body, enabled }: { title: string; body: string; enabled: boolean }) { const [on, setOn] = useState(enabled); return <div className="setting-row"><div><b>{title}</b><p>{body}</p></div><button className={`switch ${on ? 'on' : ''}`} onClick={() => setOn(v => !v)}><span /></button></div> }
