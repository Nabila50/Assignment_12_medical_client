import React from 'react';
import { Link } from 'react-router';
import logo from '../../../public/logo.png'

const Logo = () => {
  return (
   <Link to="/">
    <div>
        <img className= 'mb-2' src = {logo} />
        {/* <p className='text-3xl mb-2 font-extrabold'>Medical Camp </p> */}
        </div></Link>
  );
};

export default Logo;