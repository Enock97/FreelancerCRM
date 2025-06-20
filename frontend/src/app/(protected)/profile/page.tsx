"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../graphql/queries";
import { Contact } from "../../../types/types";
import { useMutation } from "@apollo/client";
import { UPDATE_CURRENT_USER } from "../../graphql/mutations";
import { useState } from "react";

const ProfilePage = () => {
  const { data, loading, error } = useQuery(GET_PROFILE);
  const user = data?.me;
  const [updateCurrentUser, { loading: updating }] = useMutation(UPDATE_CURRENT_USER);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateCurrentUser({ variables: { email, password: password || undefined } });
      setStatus("Profile updated successfully");
      setPassword("");
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  if (!user) return <div>No user data found.</div>;

  const totalActivities = user.contacts.reduce(
    (acc: number, contact: Contact) => acc + (contact.activities?.length ?? 0),
    0
  );

  return (
    <div className="max-w-xl mx-auto bg-gray-200 dark:bg-gray-900 rounded-xl shadow-md p-8 space-y-6 mt-8 border border-gray-100 dark:border-gray-800">
      <h1 className="text-2xl font-bold text-center mb-4 text-yellow-600 dark:text-yellow-600">My Profile</h1>
      <div>
        <span className="block text-gray-700 dark:text-gray-300">Email:</span>
        <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
      </div>
      <div>
        <span className="block text-gray-700 dark:text-gray-300">Total contacts:</span>
        <span className="font-medium text-gray-900 dark:text-white">{user.contacts.length}</span>
      </div>
      <div>
        <span className="block text-gray-700 dark:text-gray-300">Total activities:</span>
        <span className="font-medium text-gray-900 dark:text-white">{totalActivities}</span>
      </div>
      <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4 mt-8">
        <label className="text-gray-900 dark:text-gray-100">
          Email
          <input
            type="email"
            className="w-full p-2 mt-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label className="text-gray-900 dark:text-gray-100">
          New Password
          <input
            type="password"
            className="w-full p-2 mt-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 font-bold hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 transition"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
        {status && (
          <div
            className={`text-center text-sm mt-2 ${
              status.startsWith("Error") ? "text-red-500" : "text-green-600"
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
