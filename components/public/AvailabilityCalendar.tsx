"use client";

import { useState } from 'react';

type BookingType = {
  date: string;
  event: string;
};

interface CalendarProps {
  month: string;
  year: number;
  bookings?: BookingType[];
}

export default function AvailabilityCalendar({ month, year, bookings = [] }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Solo para propósitos de demostración - esto debería venir de una API real
  const daysInMonth = 31; // Mayo
  const firstDayOfWeek = 3; // Miércoles (0 es domingo, 1 es lunes, etc.)
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const placeholders = Array.from({ length: firstDayOfWeek }, (_, i) => null);
  
  const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  
  const handleDateClick = (day: number) => {
    const dateString = `${year}-${month}-${day}`;
    setSelectedDate(dateString);
  };
  
  const getBookingForDate = (day: number) => {
    const dateString = `${year}-${month}-${day}`;
    return bookings.find(booking => booking.date === dateString);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{month} {year}</h2>
        <div className="flex space-x-2">
          <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
            <span>&#10094;</span>
          </button>
          <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
            <span>&#10095;</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {placeholders.map((_, i) => (
          <div key={`placeholder-${i}`} className="h-14"></div>
        ))}
        
        {days.map(day => {
          const booking = getBookingForDate(day);
          return (
            <div 
              key={day}
              onClick={() => handleDateClick(day)}
              className={`
                h-14 p-1 border rounded-md relative cursor-pointer
                ${booking ? 'bg-pink-50 border-pink-200' : 'hover:bg-gray-50'}
                ${selectedDate === `${year}-${month}-${day}` ? 'ring-2 ring-burgundy-700' : ''}
              `}
            >
              <div className="text-right text-sm">{day}</div>
              {booking && (
                <div className="absolute bottom-1 left-1 right-1 text-xs bg-pink-100 p-1 rounded truncate">
                  {booking.event}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 