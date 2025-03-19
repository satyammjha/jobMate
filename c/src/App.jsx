import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './customComponents/Navbar/Navbar';
import ErrorPage from './pages/ErrorPage';
import { Footer } from './customComponents/Footer';
import ResumeReview from './pages/ResumeReview';
import Blogs from './pages/Blogs';
import Refferal from './pages/Refferal';
import Onboard from './pages/Onboard';
import JobDetails from './pages/JobDetails';
import { FloatingDockDemo } from './customComponents/FloatingNav';
import { SavedJobsProvider } from './Context/SavedJobContext';
import SavedJobs from './pages/Track';
import { ChatPopup } from './customComponents/Chatbot/chatbot';
import useUserData from './Context/UserContext';

const singleBlog = {
  id: 1,
  title: 'Introduction to React',
  description:
    'Learn the basics of React and how to build modern web applications. React is a JavaScript library for building user interfaces, particularly single-page applications where data changes over time.',
  image: '../src/assets/glassdoor.jpg',
  referenceLinks: [
    { text: 'React Official Docs', url: 'https://reactjs.org/' },
    { text: 'React Tutorial', url: 'https://react-tutorial.app/' },
  ],
};

function App() {
  const { email } = useUserData();
  console.log("emm2", email);
  return (
    <SavedJobsProvider>
      <div className="dark:bg-black hide-scrollbar">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
          <FloatingDockDemo />
          <ChatPopup />
        </div>
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ref/:referralCode" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviewresume" element={<ResumeReview />} />
            <Route path="/tracker" element={<SavedJobs />} />
            <Route path="/blogs" element={<Blogs blog={singleBlog} />} />
            <Route path="/refferals" element={<Refferal />} />
            <Route path="/onboard/refer" element={<Onboard />} />
            <Route path="/job-details/:jobId" element={<JobDetails />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
        <div className="z-50">
          <Footer />
        </div>
      </div>
    </SavedJobsProvider>
  )
}

export default App;