import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './Dashboard/Dashboard';
import Participants from './Participant/Participants';
import Lessons from './Lesson/Lessons';
import LessonDetail from './Lesson/LessonDetail';
import LoginToLessonModal from './LessonParticipant/LoginToLessonModal';
import ToastProvider from './ToastProvider';


const navigation = [
  { name: 'Dashboard', href: '/'},
  { name: 'Lekce', href: '/lesson'},
  { name: 'Uživatelé', href: '/participant'},
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (

    <ToastProvider>
    <div className="container">
      <LoginToLessonModal show={showLogin} onHide={() => setShowLogin(false)} />
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <svg className="bi me-2" width="40" height="32" aria-hidden="true"><use href="/favicon.svg"></use></svg>
        <span className="fs-4">Zapiste.se</span>
        </a>

        <ul className="nav nav-pills">
          <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => setShowLogin(true)}>+ Přihlásit na lekci</button></li>
          <li className="nav-item"><NavLink to="/" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Dashboard</NavLink></li>
          <li className="nav-item"><NavLink to="/participant" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Účastníci</NavLink></li>
          <li className="nav-item"><NavLink to="/lesson" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>Lekce</NavLink></li>
        </ul>
      </header> 

      <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/participant" element={<Participants />} />
          <Route path="/lesson" element={<Lessons />} />
          <Route path="/lesson/detail" element={<LessonDetail />} />
        </Routes>
    </div>
    </ToastProvider>
  )
}

export default App
