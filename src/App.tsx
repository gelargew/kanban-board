import { useEffect, useLayoutEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import Issues from './components/Issues'


import LexFridman from './assets/lex.jpg'
import Musk from './assets/musk.jpg'
import Aoba from './assets/ichi.jpg'




function App() {

  useLayoutEffect(() => {
  }, [])

  return (
    <>
      <Dashboard />

      <header>
        <h1>Kanban Prosa</h1>
        <div id='members'>
          <img src={LexFridman} className='profile-img' />
          <img src={Musk} className='profile-img' />
          <img src={Aoba} className='profile-img' />
          <p>50 Members</p>
        </div>
      </header>

      <Issues />
    </>
  )
}

export default App
