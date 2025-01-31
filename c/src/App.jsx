import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './customComponents/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage';
import { Footer } from './customComponents/Footer';
import ResumeReview from './pages/ResumeReview';

function App() {

  return (
    <>
      <div className="dark:bg-black hide-scrollbar">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>

        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviewresume" element={<ResumeReview />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
<div className="z-50">
        <Footer />
        </div>
      </div>
    </>
  )
}

export default App;