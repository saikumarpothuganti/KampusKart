import React from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';

const NavLink = ({ to, className, children, onClick }) => {
  const { showLoader } = useLoading();

  const handleClick = (e) => {
    showLoader(500);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link to={to} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavLink;
