import React from 'react';
import { CourseGrid } from '../components/CourseGrid';
import { AssignmentList } from '../components/AssignmentList';
import { ScheduleWidget } from '../components/ScheduleWidget';
import { GradeAnalytics } from '../components/GradeAnalytics';

export const UniversityPage = () => {
  return (
    <div className="min-h-screen bg-oled text-white font-display selection:bg-primary/30">
      <div className="flex h-screen overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

          {/* Top Header */}
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest">University Dashboard</h2>
              <h1 className="text-white text-3xl font-bold mt-1">Fall Semester 2025</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">search</span>
                <input
                  className="bg-glass border-none rounded-full pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary w-64"
                  placeholder="Search courses..."
                  type="text"
                />
              </div>
              <div
                className="size-10 rounded-full bg-cover bg-center border border-zinc-700"
                data-alt="Student profile avatar headshot"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCK2d7BhbfvFdPqBw1tPzdxnW849O5hivv_BH6y-XYojdQCq6Zus8SIW8hRZaHa0C62s2fQRCdmwP8RQxB-HDT-qpgjjoXYLf7QG8SKtRZTHSSiPjgY7mzzfMzePgqwvTZlyHp3TcmQMjKLaZ2S0qgof4m1LrI5JlZLUQTMsyodNaHpeGra6MHFWSi0tWieGGScJkcX45q6e0UxRwt1cbQGehOJpHwVvHyD-hOqDX0BglqXnUgoho-U55vWPmx-YaG9H4NN5McLLEo')" }}
              ></div>
            </div>
          </header>

          {/* Course Grid Section */}
          <CourseGrid />

          {/* Assignments & Schedule Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <AssignmentList />
              <ScheduleWidget />
            </div>
            {/* Right Analytics Panel - moved here for grid layout logic */}
            <div className="col-span-1">
              <GradeAnalytics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
