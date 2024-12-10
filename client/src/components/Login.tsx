import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login link sent to your email!');
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };

    return(
        <div>
            <h2>Planning Hackathon</h2>
            <div className="bg-white rounded-sm w-1/3 p-5 shadow-lg shadow-first-500/40">
                <h2 className="text-first text-lg">Connectez-vous !</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" value={email}onChange={(e) => setEmail(e.target.value)} required />
                    <button className="bg-second px-5 py-2 rounded-sm" type="submit">Se Connecter</button>
                </form>
                {message && <p>message</p>}
            </div>
        </div>
    );
};

export default Login;