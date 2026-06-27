import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      dispatch(setCredentials(data));
      if (data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-[#23312B] p-8 rounded-xl shadow-md dark:shadow-black/40 mt-12">
      <h1 className="text-2xl font-bold text-center mb-6 text-tea-dark dark:text-tea-light">Вход в аккаунт</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tea-gold focus:ring focus:ring-tea-gold focus:ring-opacity-50 p-2 border" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Пароль</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-tea-gold focus:ring focus:ring-tea-gold focus:ring-opacity-50 p-2 border" 
          />
        </div>
        <button type="submit" className="w-full bg-tea-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition">
          Войти
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Нет аккаунта? <Link to="/register" className="text-tea-gold font-bold hover:underline">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login;
