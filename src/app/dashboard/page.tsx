//src\app\dashboard\page.tsx
'use client';

import { useState } from 'react';
import { DayEvent } from '@/types/calendar';
import WeeklyCalendar from '@/components/ui/layout/dashboard/calendar/WeeklyCalendar';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<DayEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Handler for when an event is clicked
  const handleEventClick = (event: DayEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
    // TODO: Open Daily Detail Panel in Priority 3
    console.log('Event clicked:', event);
  };

  // Handler for when "add event" is clicked
  const handleAddEvent = (date: Date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    // TODO: Open Daily Detail Panel in create mode in Priority 3
    console.log('Add event for date:', date);
  };

  if (!session?.user?.id) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="text-center">
          <p className="text-slate-400">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Main calendar view */}
      <WeeklyCalendar
        userId={session.user.id}
        onEventClick={handleEventClick}
        onAddEvent={handleAddEvent}
      />

      {/* TODO: Daily Detail Panel will be added in Priority 3 */}
      {/* {selectedDate && (
        <DailyDetailPanel
          date={selectedDate}
          event={selectedEvent}
          onClose={() => {
            setSelectedDate(null);
            setSelectedEvent(null);
          }}
        />
      )} */}
    </div>
  );
}
