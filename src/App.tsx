// import './App.css';
import { Link, useRoutes} from 'react-router-dom'
import routes from './route/index.tsx'
import { useEffect, lazy, Suspense } from 'react'
import './App.css'

function App() {
  // debugger
  let element = useRoutes(routes)
  console.log('useRoutes', element)
  // useEffect(() => {
  //    element = useRoutes(routes)

  // }, [])
  return (
    <div id="appElement">
      {element}
    </div>
  );
}

export default App;
