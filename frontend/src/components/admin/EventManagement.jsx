import { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    googleFormLink: '',
    category: '',
    status: 'upcoming',
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await eventsAPI.getAll();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      googleFormLink: '',
      category: '',
      status: 'upcoming',
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    setEditingEvent(event._id);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location,
      googleFormLink: event.googleFormLink,
      category: event.category || '',
      status: event.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await eventsAPI.update(editingEvent, formData);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(formData);
        toast.success('Event created successfully');
      }
      fetchEvents();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.delete(id);
        toast.success('Event deleted successfully');
        fetchEvents();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Event Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={styles.addButton}
        >
          {showForm ? 'Cancel' : '+ Add Event'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                style={styles.textarea}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date & Time *</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Google Form Registration Link *</label>
              <input
                type="url"
                name="googleFormLink"
                value={formData.googleFormLink}
                onChange={handleInputChange}
                required
                placeholder="https://forms.gle/..."
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category (Optional)</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Workshop, Conference, Meetup"
                style={styles.input}
              />
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitButton}>
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.eventsList}>
        <h2>All Events ({events.length})</h2>
        {events.length === 0 ? (
          <p>No events yet. Create your first event!</p>
        ) : (
          <div style={styles.grid}>
            {events.map((event) => (
              <div key={event._id} style={styles.eventCard}>
                <div style={styles.eventHeader}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <span style={styles.badge}>{event.status}</span>
                </div>
                <p style={styles.eventDescription}>
                  {event.description.substring(0, 100)}...
                </p>
                <div style={styles.eventInfo}>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {event.location}
                  </p>
                </div>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleEdit(event)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
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
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  formCard: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    resize: 'vertical',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  eventsList: {
    marginTop: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  eventCard: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  eventHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  eventTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    margin: 0,
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    backgroundColor: '#3498db',
    color: 'white',
  },
  eventDescription: {
    color: '#666',
    marginBottom: '1rem',
  },
  eventInfo: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '1rem',
  },
  editButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default EventManagement;
