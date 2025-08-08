import React from 'react';
import PropertyItem from './PropertyItem';

function PropertyList({ properties, onEdit, onDelete, onRequestInfo, onMakeAppointment, onViewAll }) {
  return (
    <div className="property-list modern-list">
      <div className="list-header">
        <h2 className="list-title">Properties</h2>
        {onViewAll && (
          <button className="view-all-btn" onClick={onViewAll}>View All Properties</button>
        )}
      </div>
      {properties.length === 0 ? (
        <p className="empty-message">No properties available.</p>
      ) : (
        <div className="list-grid">
          {properties.map((property) => (
            <PropertyItem
              key={property.id}
              property={property}
              onEdit={onEdit}
              onDelete={onDelete}
              onRequestInfo={onRequestInfo}
              onMakeAppointment={onMakeAppointment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PropertyList;
