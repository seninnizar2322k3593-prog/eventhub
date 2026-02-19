import { useState, useEffect } from 'react';
import { eventsAPI, uploadsAPI } from '../../services/api';
import { toast } from 'react-toastify';
import Loader from '../common/Loader';

const ImageUpload = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    eventId: '',
    uploadedBy: '',
    uploaderEmail: '',
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await eventsAPI.getAll({ status: 'upcoming' });
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isImage) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    setSelectedFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.eventId) {
      toast.error('Please select an event');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setUploading(true);

    try {
      // Upload each file
      for (const file of selectedFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);
        uploadFormData.append('eventId', formData.eventId);
        if (formData.uploadedBy) {
          uploadFormData.append('uploadedBy', formData.uploadedBy);
        }
        if (formData.uploaderEmail) {
          uploadFormData.append('uploaderEmail', formData.uploaderEmail);
        }

        await uploadsAPI.upload(uploadFormData);
      }

      toast.success('Images uploaded successfully! Pending admin approval.');
      
      // Reset form
      setFormData({
        eventId: '',
        uploadedBy: '',
        uploaderEmail: '',
      });
      setSelectedFiles([]);
      document.getElementById('fileInput').value = '';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Event Images</h1>

      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Event *</label>
            <select
              name="eventId"
              value={formData.eventId}
              onChange={handleInputChange}
              required
              style={styles.select}
            >
              <option value="">Choose an event...</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Name (Optional)</label>
            <input
              type="text"
              name="uploadedBy"
              value={formData.uploadedBy}
              onChange={handleInputChange}
              placeholder="Enter your name"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your Email (Optional)</label>
            <input
              type="email"
              name="uploaderEmail"
              value={formData.uploaderEmail}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Select Images *</label>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              required
              style={styles.fileInput}
            />
            <p style={styles.fileInfo}>
              Max 5MB per file. JPEG, PNG, JPG only.
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div style={styles.previewSection}>
              <h3>Selected Files ({selectedFiles.length}):</h3>
              <ul style={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            style={{
              ...styles.submitButton,
              ...(uploading ? styles.submitButtonDisabled : {}),
            }}
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#2c3e50',
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
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
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  fileInput: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  fileInfo: {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
  },
  previewSection: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  fileList: {
    listStyle: 'none',
    padding: 0,
    margin: '0.5rem 0 0 0',
  },
  submitButton: {
    padding: '1rem 2rem',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  },
};

export default ImageUpload;
