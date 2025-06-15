"use client";
import React from "react";
import Profile from "../../../components/Profile";

const ProfilePage = () => {
  return (
    <div className="mx-auto max-w-xl w-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Min Profil
      </h1>
      <div className="rounded-xl bg-gray-100 dark:bg-gray-900 p-6 shadow-lg transition-colors">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;
