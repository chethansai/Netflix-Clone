import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

const SignUp = () => {
  // Context Access [useAuth hook] :- Bring required
  // i) States for consuming values,
  // ii) Functions to Modify States in AuthContext
  const {
    user,
    setUser,
    auth,
    signUpWithEmailPassword,
    sendVerificationEmail,
    emailVerified,
    checkVerificationEmail,
  } = useAuth();

  //States local to Component
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [canResendVerification, setCanResendVerification] = useState(true);

  const navigate = useNavigate();

  // Check if the user is already authenticated
  useEffect(() => {
    if (user) {
      if (emailVerified) {
        navigate('/dashboard');
      }
    }
  }, [auth, emailVerified]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await signUpWithEmailPassword(email, password);
      // Redirect on successful signup
    } catch (error) {
      setError(error.message);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      await sendVerificationEmail(user);
      alert('Verification email sent. Please check your inbox.');
      // Disable the button for 2 minutes
      setCanResendVerification(false);
      setTimeout(() => {
        setCanResendVerification(true);
      }, 120000); // 2 minutes in milliseconds
    } catch (error) {
      setError('Failed to send verification email.');
    }
  };

  const handleCheckEmail = () => {
    checkVerificationEmail();
  };

  return (
    <div className='w-full h-screen'>
      <img
        className=' absolute w-full h-full object-cover hidden sm:block'
        src='https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg'
        alt='/'
      />
      <div className='fixed top-0 left-0 w-full h-screen bg-black/60'></div>
      <div className='fixed w-full px-4 py-24 z-50'>
        <div className='mx-auto max-w-[450px] h-[600px] bg-black/75 text-white'>
          <div className='max-w-[320px] mx-auto py-16'>
            <h1 className='text-3xl font-bold'>Sign Up</h1>
            <form onSubmit={handleSignUp} className='w-full flex flex-col py-4'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className='p-3 my-2 bg-gray-700 rounded'
                type='email'
                placeholder='Email'
                autoComplete='email'
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className='p-3 my-2 bg-gray-700 rouded'
                type='password'
                placeholder='Password'
                autoComplete='current-password'
              />
              <button className='bg-red-600 py-3 my-6 rounded font-bold'>
                Sign Up
              </button>
              {error && <p className='error'>{error}</p>}
              <p className='py-8'>
                <span className='text-gray-600'>
                  Already subscribed to Netflix?
                </span>{' '}
                <Link to='/login'>Sign In</Link>
              </p>
            </form>

            {/* ... Your existing code ... */}
            {user && (
              <div>
                <div>
                  <p className='text-white pr-4'>
                    Verification Email Not Received?
                  </p>
                  <button
                    className='text-red-500 pr-4'
                    onClick={resendVerificationEmail}
                    disabled={!canResendVerification} // Disable the button if not allowed to resend
                  >
                    Resend Verification Email
                  </button>
                </div>
                <div>
                  <button
                    className='text-white pr-4'
                    onClick={handleCheckEmail}
                  >
                    Verified Email? Continue To Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
