export const downloadTimetableICS = (timetable, days, timeSlots) => {
  const dayMap = { 'Mo': 'MO', 'Tu': 'TU', 'We': 'WE', 'Th': 'TH', 'Fr': 'FR' };
  const startDate = '20260518'; // Monday
  
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PROID:-//EduSync//NONSGML Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ].join('\r\n') + '\r\n';

  days.forEach(day => {
    Object.keys(timetable[day]).forEach(slotId => {
      const classInfo = timetable[day][slotId];
      const slot = timeSlots.find(s => s.id === parseInt(slotId));
      
      if (classInfo && slot) {
        const startTime = slot.start.replace(':', '') + '00';
        const endTime = slot.end.replace(':', '') + '00';
        
        icsContent += [
          'BEGIN:VEVENT',
          `DTSTART;TZID=Asia/Kolkata:${startDate}T${startTime}`,
          `DTEND;TZID=Asia/Kolkata:${startDate}T${endTime}`,
          `RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day]}`,
          `SUMMARY:EduSync: ${classInfo.subject}`,
          `DESCRIPTION:Teacher: ${classInfo.teacher}\\nRoom: ${classInfo.room}`,
          `LOCATION:${classInfo.room}`,
          'STATUS:CONFIRMED',
          'SEQUENCE:0',
          'BEGIN:VALARM',
          'TRIGGER:-PT15M',
          'DESCRIPTION:Class starting in 15 minutes',
          'ACTION:DISPLAY',
          'END:VALARM',
          'END:VEVENT'
        ].join('\r\n') + '\r\n';
      }
    });
  });

  icsContent += 'END:VCALENDAR';

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'EduSync_Schedule_G20.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

