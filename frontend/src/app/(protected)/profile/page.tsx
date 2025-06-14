"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_PROFILE } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";

const ProfilePage = () => {
  const { data, loading, error, refetch } = useQuery(GET_PROFILE);
  const [updateProfile] = useMutation(UPDATE_PROFILE, { onCompleted: () => refetch() });
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    if (data?.me) {
      setEmail(data.me.email || "");
      setPassword(""); // Ikke vis passord fra backend
    }
  }, [data]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      variables: {
        input: {
          email,
          password: password || undefined,
        },
      },
    });
    setEditing(false);
    setPassword("");
  };

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Kunne ikke hente brukerinfo</div>;

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Profil</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block mb-1 dark:text-gray-200">E-post</label>
          <input
            type="email"
            value={email}
            disabled={!editing}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block mb-1 dark:text-gray-200">Passord</label>
          <div className="flex">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              disabled={!editing}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-2 py-1 border rounded dark:bg-gray-900 dark:text-white"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="ml-2 px-2 py-1 rounded bg-gray-300 dark:bg-gray-700"
            >
              {showPassword ? "Skjul" : "Vis"}
            </button>
          </div>
        </div>
        {editing ? (
          <div className="flex space-x-2">
            <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Lagre
            </button>
            <button type="button" className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setEditing(false)}>
              Avbryt
            </button>
          </div>
        ) : (
          <button type="button" className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setEditing(true)}>
            Rediger
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
