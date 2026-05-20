import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Download, FileJson } from 'lucide-react';
import { TIME_SLOTS, DAYS, TIMETABLE } from '../data/timetableData';
import { downloadTimetableICS } from '../utils/calendarHelper';

const Schedule = () => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const handleDownload = () => {
    downloadTimetableICS(TIMETABLE, DAYS, TIME_SLOTS);
  };

  return (
    <div className="p-6 bg-[#020617] min-h-screen text-slate-300">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">My Schedule</h1>
          <p className="text-slate-500 font-medium">Group G-20 | 2nd Year CSE</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Download size={16} />
            <span>Download Schedule</span>
          </button>
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-3 rounded-xl border border-white/10">
            <Calendar size={14} />
            <span>Semester 4</span>
          </div>
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
            {DAYS.map((day, dayIndex) => (
              <tr key={day}>
                <td className="p-4 border-b border-r border-white/10 bg-white/[0.01] text-sm font-black text-white text-center">{day}</td>
                {TIME_SLOTS.map(slot => {
                  const classInfo = TIMETABLE[day][slot.id];
                  const isHovered = hoveredCell?.day === day && hoveredCell?.slotId === slot.id;
                  
                  if (slot.id === 'break') {
                    return (
                      <td key={slot.id} className="p-4 border-b border-r border-white/10 bg-slate-900/50 text-center italic text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em]">
                        Break
                      </td>
                    );
                  }
                  return (
                    <td 
                      key={slot.id} 
                      className="p-1 border-b border-r border-white/10 relative"
                      onMouseEnter={() => classInfo && setHoveredCell({ day, slotId: slot.id })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {classInfo ? (
                        <div className={`h-full w-full p-3 rounded-xl transition-all cursor-help ${isHovered ? 'bg-blue-600/20' : ''}`}>
                          <div className="text-[11px] font-black text-white leading-tight">{classInfo.subject}</div>
                          
                          {/* Hover Tooltip (Information Only) */}
                          {isHovered && (
                            <div className={`absolute z-50 w-52 p-4 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 left-1/2 -translate-x-1/2 ${
                              dayIndex === 0 ? 'top-full mt-2' : 'bottom-full mb-2'
                            }`}>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <User size={12} className="text-blue-500" />
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Instructor</span>
                                    <span className="text-[10px] font-bold text-slate-300">{classInfo.teacher}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                                  <MapPin size={12} className="text-blue-500" />
                                  <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Location</span>
                                    <span className="text-[10px] font-bold text-slate-300">{classInfo.room}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Tooltip Arrow */}
                              <div className={`absolute left-1/2 -translate-x-1/2 border-8 border-transparent ${
                                dayIndex === 0 ? 'bottom-full border-b-[#0f172a]' : 'top-full border-t-[#0f172a]'
                              }`}></div>
                            </div>
                          )}
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
          <FileJson size={24} />
        </div>
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Calendar Integration</h3>
          <p className="text-xs font-medium text-slate-500 max-w-lg leading-relaxed">
            Download your schedule as an .ics file to import it into Google Calendar, Outlook, or Apple Calendar. This will add all recurring lectures with teacher and room details in one step.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
