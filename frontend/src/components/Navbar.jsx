import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container">
        <NavLink to="/" className="brand">
          <span className="mark">✿</span> Flovera
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? 'active' : '')}>Services</NavLink>
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          )}
          {user ? (
            <>
              <span className="nav-user-pill">{user.name} · {user.role === 'ADMIN' ? 'Admin' : 'Customer'}</span>
              <button className="link" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
