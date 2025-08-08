import React, { useState } from 'react';
import './App.css';
import PropertyList from './PropertyList';
import PropertyForm from './PropertyForm';

function App() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestProperty, setRequestProperty] = useState(null);
  const [requestInfo, setRequestInfo] = useState({ name: '', email: '', phone: '' });
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentProperty, setAppointmentProperty] = useState(null);
  const [appointmentInfo, setAppointmentInfo] = useState({ name: '', email: '', phone: '', date: '', time: '' });
  const [showAll, setShowAll] = useState(false);

  // Simulate backend CRUD
  const addProperty = (property) => {
    setProperties([...properties, { ...property, id: Date.now(), agent: property.agent }]);
    setShowForm(false);
  };

  const updateProperty = (updated) => {
    setProperties(properties.map(p => p.id === updated.id ? updated : p));
    setEditingProperty(null);
    setShowForm(false);
  };

  const deleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProperty(null);
    setShowForm(false);
  };

  const handleRequestInfo = (property) => {
    setRequestProperty(property);
    setShowRequestForm(true);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    // Here you would send requestInfo and requestProperty to backend
    alert(`Request sent for ${requestProperty.title} by ${requestInfo.name}`);
    setShowRequestForm(false);
    setRequestInfo({ name: '', email: '', phone: '' });
    setRequestProperty(null);
  };

  const handleMakeAppointment = (property) => {
    setAppointmentProperty(property);
    setShowAppointmentForm(true);
  };

  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    // Here you would send appointmentInfo and appointmentProperty to backend
    alert(`Appointment requested for ${appointmentProperty.title} by ${appointmentInfo.name} on ${appointmentInfo.date} at ${appointmentInfo.time}`);
    setShowAppointmentForm(false);
    setAppointmentInfo({ name: '', email: '', phone: '', date: '', time: '' });
    setAppointmentProperty(null);
  };

  const handleViewAll = () => {
    setShowAll(true);
    // In a real app, you might fetch all properties from backend here
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="brand-container">
          <img src="/logo192.png" alt="mazLogic Logo" className="brand-logo" />
          <h1 className="brand-title">
            <span className="brand-main">mazLogic</span>
            <span className="brand-sub">Properties</span>
          </h1>
        </div>
        <button className="add-btn" onClick={handleAdd}>Add Property</button>
      </header>
      <main>
        {showForm && (
          <PropertyForm
            onSubmit={editingProperty ? updateProperty : addProperty}
            initialData={editingProperty}
            onCancel={handleCancel}
          />
        )}
        {showRequestForm && requestProperty && (
          <form className="request-form" onSubmit={handleRequestSubmit}>
            <h2>Request More Info</h2>
            <p>Property: <strong>{requestProperty.title}</strong></p>
            <input
              name="name"
              placeholder="Your Name"
              value={requestInfo.name}
              onChange={e => setRequestInfo({ ...requestInfo, name: e.target.value })}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={requestInfo.email}
              onChange={e => setRequestInfo({ ...requestInfo, email: e.target.value })}
              required
            />
            <input
              name="phone"
              placeholder="Your Phone"
              value={requestInfo.phone}
              onChange={e => setRequestInfo({ ...requestInfo, phone: e.target.value })}
            />
            <div className="form-actions">
              <button type="submit">Send Request</button>
              <button type="button" onClick={() => setShowRequestForm(false)}>Cancel</button>
            </div>
          </form>
        )}
        {showAppointmentForm && appointmentProperty && (
          <form className="appointment-form" onSubmit={handleAppointmentSubmit}>
            <h2>Make an Appointment</h2>
            <p>Property: <strong>{appointmentProperty.title}</strong></p>
            <input
              name="name"
              placeholder="Your Name"
              value={appointmentInfo.name}
              onChange={e => setAppointmentInfo({ ...appointmentInfo, name: e.target.value })}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Your Email"
              value={appointmentInfo.email}
              onChange={e => setAppointmentInfo({ ...appointmentInfo, email: e.target.value })}
              required
            />
            <input
              name="phone"
              placeholder="Your Phone"
              value={appointmentInfo.phone}
              onChange={e => setAppointmentInfo({ ...appointmentInfo, phone: e.target.value })}
            />
            <input
              name="date"
              type="date"
              value={appointmentInfo.date}
              onChange={e => setAppointmentInfo({ ...appointmentInfo, date: e.target.value })}
              required
            />
            <input
              name="time"
              type="time"
              value={appointmentInfo.time}
              onChange={e => setAppointmentInfo({ ...appointmentInfo, time: e.target.value })}
              required
            />
            <div className="form-actions">
              <button type="submit">Book Appointment</button>
              <button type="button" onClick={() => setShowAppointmentForm(false)}>Cancel</button>
            </div>
          </form>
        )}
        <PropertyList
          properties={properties}
          onEdit={handleEdit}
          onDelete={deleteProperty}
          onRequestInfo={handleRequestInfo}
          onMakeAppointment={handleMakeAppointment}
          onViewAll={handleViewAll}
        />
      </main>
    </div>
  );
}

export default App;
