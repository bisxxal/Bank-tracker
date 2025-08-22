export const expenseData = [
    { name: 'Food', value: 2400, color: '#8b5cf6' },
    { name: 'Transport', value: 1200, color: '#06b6d4' },
    { name: 'Entertainment', value: 800, color: '#10b981' },
    { name: 'Bills', value: 1500, color: '#f59e0b' },
    { name: 'Shopping', value: 1000, color: '#ef4444' },
    { name: 'Others', value: 600, color: '#6b7280' }
  ];

  export const monthlyData = [
    { month: 'Jan', income: 5000, expense: 2500 },
    { month: 'Feb', income: 5200, expense: 3800 },
    { month: 'Mar', income: 4800, expense: 3200 },
    { month: 'Apr', income: 3500, expense: 5600 },
    { month: 'May', income: 5300, expense: 2900 },
    { month: 'Jun', income: 5800, expense: 1100 }
  ];

  export const trendData = [
    { day: 'Mon', amount: 120 },
    { day: 'Tue', amount: 180 },
    { day: 'Wed', amount: 95 },
    { day: 'Thu', amount: 240 },
    { day: 'Fri', amount: 160 },
    { day: 'Sat', amount: 320 },
    { day: 'Sun', amount: 80 }
  ];

  export const calendarData = {
    3: { income: 0, expense: 112 },
    6: { income: 0, expense: 95 },
    7: { income: 0, expense: 40 },
    8: { income: 0, expense: 2820 },
    9: { income: 0, expense: 81 },
    10: { income: 4000, expense: 0 },
    11: { income: 1728, expense: 50 },
    12: { income: 187460, expense: 189200 },
    13: { income: 381, expense: 212 },
    14: { income: 220, expense: 220 },
    15: { income: 0, expense: 40 },
    17: { income: 0, expense: 2130 },
    18: { income: 0, expense: 345 },
    19: { income: 40, expense: 70 },
    20: { income: 15, expense: 0 },
    21: { income: 0, expense: 323 },
    22: { income: 415, expense: 0 }
  };

  export const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  export const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });


  export const generateCalendarDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return days;
  };
