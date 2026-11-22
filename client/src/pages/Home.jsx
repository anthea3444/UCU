import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h2>Welcome, {user.full_name}</h2>
      <p>You are logged in as <b>{user.role}</b>.</p>
    </div>
  );
}