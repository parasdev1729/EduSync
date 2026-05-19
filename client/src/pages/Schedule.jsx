import React from 'react';
import { Calendar, Clock, MapPin, User, ExternalLink } from 'lucide-react';
import { TIME_SLOTS, DAYS, TIMETABLE } from '../data/timetableData';
import { generateGoogleCalendarUrl } from '../utils/calendarHelper';

const Schedule = () => {
  return (
    <div className="p-6 bg-[#020617] min-h-screen text-slate-300">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">My Schedule</h1>
          <p className="text-slate-500 font-medium">Group G-20 | 2nd Year CSE</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <Calendar size={14} />
          <span>Semester 4</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-white/10 bg-white/[0.03] text-[10px] font-black uppercase tracking-widest text-slate-500 w-24">Day / Slot</th>
              {TIME_SLOTS.map(slot => (
                <th key={slot.id} className="p-4 border-b border-r border-white/10 bg-white/[0.03] text-center min-w-[120px]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-500">{slot.label}</div>
                  <div className="text-[9px] font-bold text-slate-600 mt-1">{slot.time}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map(day => (
              <tr key={day}>
                <td className="p-4 border-b border-r border-white/10 bg-white/[0.01] text-sm font-black text-white text-center">{day}</td>
                {TIME_SLOTS.map(slot => {
                  const classInfo = TIMETABLE[day][slot.id];
                  if (slot.id === 'break') {
                    return (
                      <td key={slot.id} className="p-4 border-b border-r border-white/10 bg-slate-900/50 text-center italic text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                        Break
                      </td>
                    );
                  }
                  return (
                    <td key={slot.id} className="p-1 border-b border-r border-white/10 relative group">
                      {classInfo ? (
                        <div className="h-full w-full p-3 rounded-xl transition-all group-hover:bg-blue-600/10 cursor-help">
                          <div className="text-[11px] font-black text-white leading-tight">{classInfo.subject}</div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-4 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl pointer-events-none">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <User size={12} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-slate-300">{classInfo.teacher}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin size={12} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-slate-300">{classInfo.room}</span>
                              </div>
                              <div className="pt-2 border-t border-white/5">
                                <a 
                                  href={generateGoogleCalendarUrl(classInfo, day, slot)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center space-x-2 w-full py-2 bg-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest text-white pointer-events-auto hover:bg-blue-500 transition-colors"
                                >
                                  <ExternalLink size={10} />
                                  <span>Add to Calendar</span>
                                </a>
                              </div>
                            </div>
                            {/* Tooltip Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-[#0f172a]"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full min-h-[60px]"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl flex items-start space-x-4">
        <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Calendar Sync</h3>
          <p className="text-xs font-medium text-slate-500 max-w-lg">
            Hover over any class slot to see teacher details and click the button to sync that recurring lecture to your Google Calendar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
