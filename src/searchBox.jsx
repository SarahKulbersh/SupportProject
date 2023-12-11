import React from 'react'
import './styles/searchBox.css'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function SearchBox() {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const handleSearch = async () => {
    navigate(`/jobsList/${searchTerm}`);
  };

  return (
    <div className="container">

      <div className="row height d-flex justify-content-center align-items-center">

        <div className="col-md-8">

          <div className="search">
            <i className="fa fa-search"></i>
            <input type="text" className="form-control" placeholder="Search" value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
          </div>

        </div>

      </div>
    </div>

  )
}