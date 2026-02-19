import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await eventsAPI.getById(id);
      setEvent(data);
    } catch (error) {
      toast.error('Failed to load event details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <Loader />;
  if (!event) return <div style={styles.container}>Event not found</div>;

  return (
    <div style={styles.container}>
      <Link to="/events" style={styles.backLink}>
        ← Back to Events
      </Link>

      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>{event.title}</h1>
          <span style={styles.badge}>{event.status}</span>
        </div>

        <div style={styles.details}>
          <div style={styles.infoItem}>
            <strong>Date & Time:</strong>
            <p>{formatDate(event.date)}</p>
          </div>

          <div style={styles.infoItem}>
            <strong>Location:</strong>
            <p>{event.location}</p>
          </div>

          {event.category && (
            <div style={styles.infoItem}>
              <strong>Category:</strong>
              <p>{event.category}</p>
            </div>
          )}

          <div style={styles.infoItem}>
            <strong>Description:</strong>
            <p style={styles.description}>{event.description}</p>
          </div>

          <div style={styles.registrationSection}>
            <h3>Registration</h3>
            <p>Register for this event using the link below:</p>
            <a
              href={event.googleFormLink}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.registerButton}
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  backLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '1rem',
    marginBottom: '1rem',
    display: 'inline-block',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    borderBottom: '2px solid #e1e8ed',
    paddingBottom: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    margin: 0,
  },
  badge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '1rem',
    backgroundColor: '#3498db',
    color: 'white',
    textTransform: 'capitalize',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  description: {
    lineHeight: '1.8',
    color: '#555',
  },
  registrationSection: {
    marginTop: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  registerButton: {
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
  },
};

export default EventDetails;
