import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const ForgotPassword = () => {
  // Context Access [useAuth hook] :- Bring required
  // i) States for consuming values,
  // ii) Functions to Modify States in AuthContext
  const { resetPassword } = useAuth();

  //States local to Component
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await resetPassword(email);
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='p-20'>
      <h2 className='text-3xl text-white p-5 font-bold'>Forgot Password</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <input
            type='email'
            value={email}
            className='my-2 p-3 bg-gray-700 rouded'
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            required
          />
        </div>
        <div>
          <button
            type='submit'
            className='p-2 my-3 font-bold bg-red-600 rounded'
          >
            Reset Password
          </button>
        </div>
        {message && <p className='message'>{message}</p>}
        {error && <p className='error'>{error}</p>}
      </form>
      <div>
        <p className='text-white'>
          <span className='text-gray-600'>Remember your password? </span>{' '}
          <Link to='/signin'>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
