import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, signOutUser, emailVerified } = useAuth();
  const navigate = useNavigate();
  // console.log(user.email)

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex items-center  justify-between z-[100] w-full absolute p-4'>
      <Link to='/'>
        <h1 className='text-blue-300 text-4xl font-bold cursor-pointer'>
          CHETHANFILX
        </h1>
      </Link>
      {user && user.emailVerified ? (
        <div>
          <Link to='/dashboard'>
            <button className='text-white pr-4'>Account</button>
          </Link>
          <button
            onClick={handleLogout}
            className='px-6 py-2 rounded cursor-pointer bg-red-600 text-white'
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <Link to='/signin'>
            <button className='pr-4 text-white'>Sign In</button>
          </Link>
          <Link to='/signup'>
            <button className='px-4 py-2 text-black rounded cursor-pointer bg-blue-300'>
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
