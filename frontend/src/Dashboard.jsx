import { useState } from 'react'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Dashboard() {

  return (
    <div>
      <header className="relative bg-gray-800 after:pointer-events-none after:absolute after:inset-x-0 after:inset-y-0 after:border-y after:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">Ahoj{/* Your content */}</div>
      </main>
    </div>
  )
}

export default Dashboard