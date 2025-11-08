// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase.init';

// const Register = () => {

//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = e.target;
//     const name = data.name?.value;
//     const email = data.email?.value;
//     const pass = data.password?.value;
//     const info = { name, email, pass };
//     console.log(info);

//     if (!email || !pass) {
//       setError('Please enter both email and password');
//       return;
//     }
//     if(email === !email && pass === !pass){
//         setError("Please Enter valid email and password");
//         return;
//     }


//     createUserWithEmailAndPassword(auth, email, pass)
//       .then((result) => {
//         console.log('User registered:', result.user);
//         navigate('/dashboard');
//       })
//       .catch((error) => {
//         console.log('Error:', error);
//         setError(error.message);
//       });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="glass-effect rounded-2xl p-8 w-full max-w-md animate-fade-in">
//         <h1 className="text-3xl font-bold text-white text-center mb-2">
//           🧙 GameVerse
//         </h1>
//         <p className="text-fantasy-light text-center mb-6">
//           Enter the world of game zone
//         </p>

        

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <input 
//               type="text"
//               name="name"
//               placeholder="Username"
//               className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
//             />
//           </div>

//             <div>
//               <input required
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
//               />
//             </div>
        

//           <div>
//             <input required
//               type="password"
//               name="password"
//               placeholder="Password"
//               className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-fantasy-secondary hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
//           >
//           Enter World
//           </button>

//           {error && <p className="text-red-400 text-center">{error}</p>}
//         </form>

//         <button
          
//           className="w-full mt-4 text-white/80 hover:text-white transition duration-200"
//         > <p> Already have an account</p>
//          <Link to='/'>Sign in</Link>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { createUser, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !pass) {
      setError('Please fill in all fields');
      return;
    }

    if (pass.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    try {
      const result = await createUser(email, pass);

      // Update display name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: name,
        });
      }

      console.log('Registration successful');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Loading...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
