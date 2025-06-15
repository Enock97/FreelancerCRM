"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PROFILE } from "../app/graphql/queries";

const Profile = () => {
  const { data, loading, error } = useQuery(GET_PROFILE);

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-300">Laster profil...</div>;
  if (error) return <div className="text-center text-red-500">Kunne ikke hente profilinfo</div>;

  const user = data?.me;
  if (!user) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Ingen brukerdata funnet.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <div>
        <span className="block text-gray-700 dark:text-gray-300">E-post:</span>
        <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
      </div>
      <div>
        <span className="block text-gray-700 dark:text-gray-300">Antall kontakter:</span>
        <span className="font-medium text-gray-900 dark:text-white">{user.contacts.length}</span>
      </div>
      <div>
        <span className="block text-gray-700 dark:text-gray-300">Aktiviteter totalt:</span>
        <span className="font-medium text-gray-900 dark:text-white">{user.activities.length}</span>
      </div>
    </div>
  );
};

export default Profile;
