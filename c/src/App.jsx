import { Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './customComponents/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage';

function App() {

  return (
    <>
      <div className='dark:bg-black hide-scrollbar'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App;