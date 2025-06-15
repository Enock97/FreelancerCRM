"use client";
import React from "react";
import KanbanBoard from "../../../components/KanbanBoard";

const DashboardPage = () => {
  return (
    <div className="mx-auto max-w-5xl w-full">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Kanban Dashboard
      </h1>
      <div className="rounded-xl bg-gray-100 dark:bg-gray-900 p-4 shadow-lg transition-colors">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default DashboardPage;
