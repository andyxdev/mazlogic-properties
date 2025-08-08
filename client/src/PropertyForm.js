import React, { useState, useEffect } from 'react';

function PropertyForm({ onSubmit, initialData, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'rent',
    location: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Property' : 'Add Property'}</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="rent">Rent</option>
        <option value="sale">Sale</option>
      </select>
      <div className="form-actions">
        <button type="submit">{initialData ? 'Update' : 'Add'}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

export default PropertyForm;
