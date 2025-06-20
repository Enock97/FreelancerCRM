"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../../graphql/queries";
import { Contact } from "../../../types/types";

const ProfilePage = () => {
  const { data, loading, error } = useQuery(GET_PROFILE);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const user = data?.me;
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
    </div>
  );
};

export default ProfilePage;
