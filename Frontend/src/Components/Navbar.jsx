import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react';
import './Navbar.css';
import Dashboard from './Dashboard';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Fitter Health
        </Link>
        <div className="nav-icons">
          <Link to="/" className="nav-icon">
            <Home />
          </Link>
          <Link to="/search" className="nav-icon">
            <Search />
          </Link>
          <Link to="/create" className="nav-icon">
            <PlusSquare />
          </Link>
          <Link to="/activity" className="nav-icon">
            <Heart />
          </Link>
          <Link to="/profile" className="nav-icon">
            <User />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;