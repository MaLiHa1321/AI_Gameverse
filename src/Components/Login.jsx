// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { auth } from '../firebase.init';

// const Login = () => {

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
//         > <p> Don't have an account</p>
//          <Link to='/register'>Sign up</Link>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.init';

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = e.target;
    const email = data.email?.value;
    const pass = data.password?.value;

    if (!email || !pass) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      console.log('User logged in:', result.user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md animate-fade-in shadow-lg shadow-fantasy-secondary/30">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          🧙 GameVerse
        </h1>
        <p className="text-fantasy-light text-center mb-6 text-white/70">
          Enter the world of the game zone
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
            />
          </div>

          <div>
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-fantasy-secondary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fantasy-secondary hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Enter World
          </button>

          {error && <p className="text-red-400 text-center mt-3">{error}</p>}
        </form>

        <div className="w-full mt-6 text-center">
          <p className="text-white/80 mb-1">Don't have an account?</p>
          <Link
            to="/register"
            className="text-amber-400 hover:text-amber-300 transition duration-200 font-semibold"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
