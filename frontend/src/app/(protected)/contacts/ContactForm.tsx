'use client';

import { useState, useEffect } from 'react';

interface ContactFormProps {
  initialData?: {
    id?: number;
    name: string;
    email: string;
    company: string;
    status: string;
    note: string;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

export default function ContactForm({ initialData, onSubmit, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    status: '',
    note: '',
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {['name', 'email', 'company', 'status'].map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input name={field} value={formData[field as keyof typeof formData]} onChange={handleChange} />
        </div>
      ))}
      <div>
        <label>note</label>
        <textarea name="note" value={formData.note} onChange={handleChange} />
      </div>
      <button type="submit">Lagre</button>
      {onCancel && <button type="button" onClick={onCancel}>Avbryt</button>}
    </form>
  );
}
