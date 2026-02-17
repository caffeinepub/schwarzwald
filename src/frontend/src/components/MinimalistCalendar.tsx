import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MinimalistCalendarProps {
  onDateRangeSelect?: (startDate: Date | null, endDate: Date | null) => void;
  startDate?: Date | null;
  endDate?: Date | null;
  className?: string;
}

export default function MinimalistCalendar({ 
  onDateRangeSelect, 
  startDate,
  endDate,
  className = '' 
}: MinimalistCalendarProps) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectingStart, setSelectingStart] = useState(true);

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to 7, so Monday becomes 1
    return day === 0 ? 7 : day;
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  // Create array of days with empty slots for alignment
  const calendarDays: (number | null)[] = [];
  
  // Add empty slots for days before the first day of month
  for (let i = 1; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    
    if (selectingStart || !startDate) {
      // First click or reset - select start date
      if (onDateRangeSelect) {
        onDateRangeSelect(clickedDate, null);
      }
      setSelectingStart(false);
    } else {
      // Second click - select end date
      if (clickedDate < startDate) {
        // If clicked date is before start, swap them
        if (onDateRangeSelect) {
          onDateRangeSelect(clickedDate, startDate);
        }
      } else {
        if (onDateRangeSelect) {
          onDateRangeSelect(startDate, clickedDate);
        }
      }
      setSelectingStart(true);
    }
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    return (
      startDate.getDate() === day &&
      startDate.getMonth() === currentMonth &&
      startDate.getFullYear() === currentYear
    );
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    return (
      endDate.getDate() === day &&
      endDate.getMonth() === currentMonth &&
      endDate.getFullYear() === currentYear
    );
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const currentDate = new Date(currentYear, currentMonth, day);
    return currentDate > startDate && currentDate < endDate;
  };

  const getDayStyle = (day: number) => {
    if (isStartDate(day) || isEndDate(day)) {
      return 'bg-black text-white hover:bg-black/90';
    }
    if (isInRange(day)) {
      return 'bg-[#87A7C1] text-white hover:bg-[#87A7C1]/90';
    }
    return 'hover:bg-gray-100 text-gray-900';
  };

  return (
    <div className={`bg-white rounded-2xl border border-black p-6 ${className}`}>
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="h-10 w-10 hover:bg-gray-100 rounded-full"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <h2 className="text-xl font-sans font-semibold tracking-tight">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="h-10 w-10 hover:bg-gray-100 rounded-full"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayLabels.map((label) => (
          <div
            key={label}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => handleDayClick(day)}
                className={`
                  w-full h-full flex items-center justify-center
                  text-base font-medium rounded-lg
                  transition-all duration-200
                  ${getDayStyle(day)}
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                `}
                aria-label={`${day} ${monthNames[currentMonth]} ${currentYear}`}
              >
                {day}
              </button>
            ) : (
              <div className="w-full h-full" />
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {startDate && !endDate && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Select your departure date
        </div>
      )}
    </div>
  );
}
