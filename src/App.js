import 'bootstrap/dist/css/bootstrap.min.css'
import LandingPage from './landingPage'
import JobsList from './jobsList';
 import { Route, Routes } from 'react-router-dom';

function App() {
  return <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='myJobs/:searchTerm' element={<JobsList/>}/>
  </Routes>
}

export default App;
