"use client";
import React, { useState } from "react";
import { Contact } from "../../../types/types";

export interface ContactFormProps {
  onSubmit: (formData: Omit<Contact, "id" | "createdAt" | "activities">) => void | Promise<void>;
  onCancel: () => void;
  initialData?: Partial<Contact>;
}

const statusOptions = ["NEW", "FOLLOW_UP", "CUSTOMER", "ARCHIVED"];

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<Contact, "id" | "createdAt" | "activities">>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    company: initialData?.company || "",
    status: initialData?.status || "NEW",
    order: initialData?.order || 0,
    note: initialData?.note || "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 dark:text-white p-4 rounded-lg shadow-md flex flex-col gap-2"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="input rounded px-2 py-1 border dark:bg-gray-900"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="input rounded px-2 py-1 border dark:bg-gray-900"
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="input rounded px-2 py-1 border dark:bg-gray-900"
      />
      <input
        type="text"
        name="company"
        placeholder="Company"
        value={formData.company}
        onChange={handleChange}
        className="input rounded px-2 py-1 border dark:bg-gray-900"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="input rounded px-2 py-1 border dark:bg-gray-900"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <textarea
        name="note"
        placeholder="Note"
        value={formData.note}
        onChange={handleChange}
        className="input rounded px-2 py-1 border dark:bg-gray-900"
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
