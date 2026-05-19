export const generateGoogleCalendarUrl = (classData, day, timeSlot) => {
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  
  // Mapping days to RRULE format
  const dayMap = { 'Mo': 'MO', 'Tu': 'TU', 'We': 'WE', 'Th': 'TH', 'Fr': 'FR' };
  
  // Hardcoded date for the start of the semester (example: Monday, May 18, 2026)
  // We'll use a generic start date to establish the recurring pattern
  const startDate = '20260518'; 
  const startTime = timeSlot.start.replace(':', '') + '00';
  const endTime = timeSlot.end.replace(':', '') + '00';
  
  const text = encodeURIComponent(`EduSync: ${classData.subject}`);
  const details = encodeURIComponent(`Teacher: ${classData.teacher}\nRoom: ${classData.room}`);
  const location = encodeURIComponent(classData.room);
  
  // Recurrence rule: Weekly on the specific day
  const recur = encodeURIComponent(`RRULE:FREQ=WEEKLY;BYDAY=${dayMap[day]}`);
  
  // Construct the dates parameter (YYYYMMDDTHHmmSSZ)
  // Using 'Z' for UTC or omitting it for floating time (user's local)
  const dates = `${startDate}T${startTime}/${startDate}T${endTime}`;
  
  return `${baseUrl}&text=${text}&details=${details}&location=${location}&dates=${dates}&recur=${recur}`;
};
