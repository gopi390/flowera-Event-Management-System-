import { useAuth } from '../context/AuthContext';
import CustomerDashboard from '../components/CustomerDashboard';
import AdminDashboard from '../components/AdminDashboard';

// Two-tier dashboard: the SAME route renders completely different panels
// depending on role. A customer only ever sees CustomerDashboard; an admin
// only ever sees AdminDashboard. Neither can reach the other's view/data,
// since the underlying API calls are role-restricted on the backend too.
export default function Dashboard() {
  const { user } = useAuth();

  if (user.role === 'ADMIN') {
    return <AdminDashboard />;
  }
  return <CustomerDashboard />;
}
