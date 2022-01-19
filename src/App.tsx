import { useEffect, useLayoutEffect, useState } from 'react'
import Issues from './components/Issues'
import useFetch from './components/useFetch'
import data from './ISSUES.json'




function App() {

  useLayoutEffect(() => {
  }, [])

  return (
    <>
      <h1>KANBAN PROSA</h1>
      <Issues />
    </>
  )
}

export default App
