import React from 'react';

function PropertyItem({ property, onEdit, onDelete, onRequestInfo, onMakeAppointment }) {
  return (
    <div className="property-item">
      <h3>{property.title}</h3>
      <p>{property.description}</p>
      <p><strong>Location:</strong> {property.location}</p>
      <p><strong>Price:</strong> ${property.price}</p>
      <p><strong>Type:</strong> {property.type === 'rent' ? 'For Rent' : 'For Sale'}</p>
      {property.agent && (
        <div className="agent-info">
          <p><strong>Agent:</strong> {property.agent.name}</p>
          <p><strong>Email:</strong> {property.agent.email}</p>
          <p><strong>Phone:</strong> {property.agent.phone}</p>
        </div>
      )}
      <div className="item-actions">
        <button onClick={() => onEdit(property)}>Edit</button>
        <button onClick={() => onDelete(property.id)}>Delete</button>
        <button onClick={() => onRequestInfo(property)}>Request Info</button>
        <button onClick={() => onMakeAppointment(property)}>Make Appointment</button>
      </div>
    </div>
  );
}

export default PropertyItem;
