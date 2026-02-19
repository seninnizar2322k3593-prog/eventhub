import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI, uploadsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUploads: 0,
    pendingApprovals: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, uploadsRes, pendingRes] = await Promise.all([
        eventsAPI.getAll(),
        uploadsAPI.getAll(),
        uploadsAPI.getAll({ status: 'pending' }),
      ]);

      setStats({
        totalEvents: eventsRes.data.length,
        totalUploads: uploadsRes.data.length,
        pendingApprovals: pendingRes.data.length,
      });

      setRecentEvents(eventsRes.data.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {admin?.name}!</p>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Events</h3>
          <p style={styles.statValue}>{stats.totalEvents}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Uploads</h3>
          <p style={styles.statValue}>{stats.totalUploads}</p>
        </div>
        <div style={{...styles.statCard, ...styles.pendingCard}}>
          <h3 style={styles.statTitle}>Pending Approvals</h3>
          <p style={styles.statValue}>{stats.pendingApprovals}</p>
        </div>
      </div>

      <div style={styles.actionsGrid}>
        <Link to="/admin/events" style={styles.actionCard}>
          <h3>Manage Events</h3>
          <p>Create, update, and delete events</p>
        </Link>
        <Link to="/admin/images" style={styles.actionCard}>
          <h3>Manage Images</h3>
          <p>Approve, reject, and delete image uploads</p>
        </Link>
      </div>

      <div style={styles.recentSection}>
        <h2 style={styles.sectionTitle}>Recent Events</h2>
        {recentEvents.length === 0 ? (
          <p>No events yet</p>
        ) : (
          <div style={styles.eventList}>
            {recentEvents.map((event) => (
              <div key={event._id} style={styles.eventItem}>
                <div>
                  <h4 style={styles.eventTitle}>{event.title}</h4>
                  <p style={styles.eventDate}>
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <span style={styles.eventStatus}>{event.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    margin: 0,
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginTop: '0.5rem',
  },
  logoutButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  pendingCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  },
  statTitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: 0,
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  actionCard: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '2rem',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  recentSection: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  eventList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  eventItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  eventTitle: {
    fontSize: '1.1rem',
    margin: 0,
    color: '#2c3e50',
  },
  eventDate: {
    fontSize: '0.9rem',
    color: '#666',
    margin: '0.25rem 0 0 0',
  },
  eventStatus: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    backgroundColor: '#3498db',
    color: 'white',
    textTransform: 'capitalize',
  },
};

export default AdminDashboard;
