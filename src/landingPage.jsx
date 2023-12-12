import React from 'react'
import { Container } from 'react-bootstrap';
import { SearchBox } from './searchBox'
import { Navbar } from './navbar'
import { RecentlyPostedJobs } from './recentlyPostedJobs';
import { useNavigate } from 'react-router-dom';
import img from './p.png'

function LandingPage() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/jobsList/*');
  };
  return (
    <>
      <Navbar />
      <Container className=" justify-content-center align-items-center" style={{ backgroundColor: '#F5FAFD', padding: '50px 0' }}>
        <div>
          <h1 className="text-center">Let’s support each other.</h1>
          <p className="text-center">Be a part of the collaboration between<br />Ahcheinu Bnei Yisrael In Ertez Yisrael and the diaspora</p>
        </div>
        <br />
        <SearchBox></SearchBox>

      </Container>

      <Container>
        <h4 className="text-center mb-3">Recently Posted Jobs</h4>
        <RecentlyPostedJobs />

      </Container>

      <Container style={{ backgroundColor: '#F5FAFD', padding: '15px' }}>
        <div className="row">
          <div className="col-md-4">
            <img src={img} className="img-fluid" alt="Image description"></img>
          </div>

          <div className="col-md-8">
            <h2 style={{ marginBottom: '20px' }}>Looking for Work? Acheinu Bnei Yisrael in Chutz La’aretz are looking to hire.</h2>
            <button className="btn btn-outline-primary" onClick={handleClick}>View available oppurtunities</button>
          </div>
        </div>
      </Container>
      <br />
      <Container>
        <h2 style={{ marginBottom: '20px' }}>Employer? <br />How can we help with your hiring needs</h2>
        <button className="btn btn-outline-primary">View available oppurtunities</button>

      </Container>
      <br />
      <footer style={{ backgroundColor: 'black', color: 'white', padding: '1px' }}>

        <div className="row justify-content-center mb-0 pt-5 pb-0 row-2 px-3">
          <div className="col-12">
            <div className="row row-2">
              <div className="col-sm-3 text-md-center"><h5><span> <i className="fa fa-firefox text-light" aria-hidden="true"></i></span><b>  Stride</b></h5></div>
              <div className="col-sm-3  my-sm-0 mt-5"><ul className="list-unstyled"><li className="mt-0">Platform</li><li>Help Center</li><li>Security</li></ul></div>
              <div className="col-sm-3  my-sm-0 mt-5"><ul className="list-unstyled"><li className="mt-0">Customers</li><li>Use Cases</li><li>Customers Services</li></ul></div>
              <div className="col-sm-3  my-sm-0 mt-5"><ul className="list-unstyled"><li className="mt-0">Company</li><li>About</li><li>Careers- <span className="Careers">We're-hiring</span></li></ul></div>
            </div>
          </div>
        </div>
        <div className="row justify-content-center mt-0 pt-0 row-1 mb-0  px-sm-3 px-2">
          <div className="col-12">
            <div className="row my-4 row-1 no-gutters">
              <div className="col-sm-3 col-auto text-center"><small>&#9400; Stride Softwere</small></div><div className="col-md-3 col-auto "></div><div className="col-md-3 col-auto"></div>
              <div className="col  my-auto text-md-left  text-right "> <small> hello@getstride.com <span><img src="https://i.imgur.com/TtB6MDc.png" className="img-fluid " width="25" /></span> <span><img src="https://i.imgur.com/N90KDYM.png" className="img-fluid " width="25" /></span></small>  </div>
            </div>
          </div>
        </div>
      </footer >


    </>
  )
}

export default LandingPage
