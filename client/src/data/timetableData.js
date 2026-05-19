export const TIME_SLOTS = [
  { id: 1, label: '1', time: '4:10-5:00', start: '16:10', end: '17:00' },
  { id: 2, label: '2', time: '5:00-5:50', start: '17:00', end: '17:50' },
  { id: 3, label: '3', time: '5:50-6:40', start: '17:50', end: '18:40' },
  { id: 4, label: '4', time: '6:40-7:30', start: '18:40', end: '19:30' },
  { id: 'break', label: 'Break', time: '7:30-7:50', start: '19:30', end: '19:50' },
  { id: 5, label: '5', time: '7:50-8:40', start: '19:50', end: '20:40' },
  { id: 6, label: '6', time: '8:40-9:30', start: '20:40', end: '21:30' },
];

export const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr'];

export const TIMETABLE = {
  'Mo': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Discrete', teacher: 'Dr. SK', room: 'TG-210' },
    4: { subject: 'Discrete', teacher: 'Dr. SK', room: 'TG-210' },
    5: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
    6: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
  },
  'Tu': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    5: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
    6: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
  },
  'We': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Computer Networks', teacher: 'Dr. TR', room: 'TG-210' },
    6: { subject: 'Computer Networks', teacher: 'Dr. TR', room: 'TG-210' },
  },
  'Th': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Backend Engineering', teacher: 'Dr. TR / MT1', room: 'TG-210' },
    4: { subject: 'Backend Engineering', teacher: 'Dr. TR / MT1', room: 'TG-210' },
    5: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
    6: { subject: 'Linux', teacher: 'MT2', room: 'TG-210' },
  },
  'Fr': {
    1: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    2: { subject: 'DS OOPS', teacher: 'MT2', room: 'TG-210' },
    3: { subject: 'Backend Engineering', teacher: 'MT1', room: 'TG-210' },
    4: { subject: 'Backend Engineering', teacher: 'MT1', room: 'TG-210' },
    5: { subject: 'Discrete', teacher: 'Dr. SK', room: 'TG-210' },
    6: { subject: 'Computer Networks', teacher: 'Dr. TR', room: 'TG-210' },
  }
};
