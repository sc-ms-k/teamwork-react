import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { timeFormat } from '../../utils/timeFormat';

interface WorkingTimeData {
  userId: number;
  userName: string;
  weeklyHours: {
    [key: string]: number | null; // e.g., { 'Mon': 8, 'Tue': 7.5, ... }
  };
}

interface WeeklyWorkingTimeTableProps {
  data: WorkingTimeData[];
  loading?: boolean;
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

const WeeklyWorkingTimeTable = ({ data, loading, currentWeek, onWeekChange }: WeeklyWorkingTimeTableProps) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get the week period dates
  const getWeekPeriod = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek,
      end: endOfWeek,
      weekNumber: Math.ceil((startOfWeek.getDate() - startOfWeek.getDay()) / 7)
    };
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const weekPeriod = getWeekPeriod(currentWeek);
  const periodString = `${formatDate(weekPeriod.start)} ~ ${formatDate(weekPeriod.end)}`;

  // Generate array of dates for the week
  const weekDates = weekDays.map((_, index) => {
    const date = new Date(weekPeriod.start);
    date.setDate(weekPeriod.start.getDate() + index);
    return date;
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800 dark:text-white">Weekly Working Time</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Period: {periodString}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onWeekChange(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000))}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="Previous Week"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onWeekChange(new Date())}
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium"
            >
              Today
            </button>
            <button
              onClick={() => onWeekChange(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000))}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
              title="Next Week"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Name
              </th>
              {weekDays.map((day, index) => (
                <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex flex-col">
                    <span>{day}</span>
                    <span className="text-gray-400 font-normal">
                      {weekDates[index].toLocaleDateString('en-US', {
                        day: '2-digit',
                      })}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {user.userName}
                </td>
                {weekDays.map((day, idx) => {
                  const hours = user.weeklyHours[day];
                  const validHours = hours !== null && !isNaN(hours) ? hours : null;
                  
                  return (
                    <td key={idx} className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        validHours === null 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : day === 'Sun(2)' 
                            ? validHours >= timeFormat.toDecimal('08:00') ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                            : validHours >= timeFormat.toDecimal('16:00') ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        <div className="font-medium">{validHours === null ? '-' : timeFormat.toHHMM(validHours)}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyWorkingTimeTable;