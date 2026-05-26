import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './Dashboard';
import Participants from './Participant/Participants';
import Lessons from './Lesson/Lessons';
import LessonDetail from './Lesson/LessonDetail';
import LoginToLessonModal from './LessonParticipant/LoginToLessonModal';


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

    /**
      <div className="min-h-full">
        
        <Disclosure as="nav" className="bg-gray-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="shrink-0">
                  <img
                    alt="Zapiste.se"
                    src="/favicon.svg"
                    className="size-8"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) => classNames(
                          isActive
                            ? 'bg-gray-950/50 text-white'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium',
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                {/* Mobile menu button }
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                  <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium',
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>

        
      </div>
      */
  )
}

export default App
