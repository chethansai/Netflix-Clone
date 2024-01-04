import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  // Context Access [useAuth hook] :- Bring required
  // i) States for consuming values,
  // ii) Functions to Modify States in AuthContext
  const {
    user,
    setUser,
    auth,
    signInWithGoogle,
    signInWithEmailPassword,
    emailVerified,
  } = useAuth(); // Use useAuth to access the AuthContext

  //States local to Component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Check if the user is already authenticated
  useEffect(() => {
    if (user) {
      if (emailVerified) {
        navigate('/dashboard');
      }
    }
  }, [user]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithEmailPassword(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignInWithGoogle = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithGoogle();
      navigate('/dashboard'); // Redirect on successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='w-full h-screen'>
      <img
        className='absolute w-full h-full object-cover hidden sm:block'
        src='https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg'
        alt='/'
      />
      <div className='bg-black/60 fixed top-0 left-0 w-full h-screen'></div>
      <div className='fixed top-0 left-0 w-full h-screen bg-black/60'>
        <div className='mx-auto max-w-[450px] h-[600px] bg-black/75 text-white'>
          <div className='mx-auto max-w-[320px] py-16'>
            <h1 className='text-3xl font-bold'>Sign In</h1>
            {error ? <p className='my-2 p-3 bg-red-400'>{error}</p> : null}
            <form onSubmit={handleSignIn} className='w-full py-4 flex flex-col'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className='my-2 p-3 bg-gray-700 rouded'
                type='email'
                placeholder='Email'
                autoComplete='email'
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className='my-2 p-3 bg-gray-700 rouded'
                type='password'
                placeholder='Password'
                autoComplete='current-password'
              />
              <button className='py-3 my-6 font-bold bg-red-600 rounded'>
                Sign In
              </button>
              {error && <p className='error'>{error}</p>}
              <div className='flex justify-between items-center text-sm text-gray-600'>
                <p>
                  <Link to='/forgotpassword'>Need Help?</Link>
                </p>
              </div>
              <p className='py-8'>
                <span className='text-gray-600'>New to Netflix?</span>{' '}
                <Link to='/signup'>Sign Up</Link>
              </p>
            </form>
            <button
              onClick={handleSignInWithGoogle}
              className='p-3 m-1 font-bold bg-red-600 rounded text-white'
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
