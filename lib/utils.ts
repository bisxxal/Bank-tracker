export function extractFromEmail(fullName: string): string {
    const match = fullName.match(/<.*@(.*?)\./);
    return match ? match[1].toUpperCase() : 'Unknown';
}
 
export const banks = [
    { value: 'HDFCBANK', name: 'HDFC Bank' },
    { value: 'KOTAK', name: 'Kotak Mahindra Bank' },
    { value: 'SBI', name: 'State Bank of India' },
    { value: 'ICICI', name: 'ICICI Bank' },
    { value: 'AXIS', name: 'Axis Bank' },
    { value: 'PNB', name: 'Punjab National Bank' },
    { value: 'BOB', name: 'Bank of Baroda' },
    { value: 'CANARA', name: 'Canara Bank' },
    { value: 'IDFCFIRST', name: 'IDFC FIRST Bank' },
    { value: 'INDUSIND', name: 'IndusInd Bank' },
    { value: 'YESBANK', name: 'Yes Bank' },
    { value: 'UNION', name: 'Union Bank of India' },
    { value: 'BANKINDIA', name: 'Bank of India' },
    { value: 'CENTRAL', name: 'Central Bank of India' },
    { value: 'UCO', name: 'UCO Bank' },
    { value: 'INDIANBANK', name: 'Indian Bank' },
    { value: 'SOUTHBANK', name: 'South Indian Bank' },
    { value: 'KARNATAKA', name: 'Karnataka Bank' },
    { value: 'FEDERAL', name: 'Federal Bank' },
    { value: 'RBL', name: 'RBL Bank' }
];
 
export const categories=[
    { value: 'snacks', name: 'Snacks' },
    { value: 'breakfast', name: 'Breakfast' },
    { value: 'lunch', name: 'Lunch' },
    { value: 'dinner', name: 'Dinner' }, 
    { value: 'petrol', name: 'Petrol' },
    { value: 'entertainment', name: 'Entertainment' },
    { value: 'purchases', name: 'Purchases' },
    { value: 'education', name: 'Education' },
    { value: 'rent', name: 'Rent' },
    { value: 'grocery', name: 'Grocery' },
    { value: 'travels', name: 'Travels' },
    { value: 'bills', name: 'Bills' },
    { value: 'Others', name: 'Others' },
]
 
export const COLORS = [
    '#FF8E72', // Vibrant Coral
    '#A29BFE', // Soft Purple
    '#FFD93D', // Vivid Yellow
    '#1A8FE3', // Sky Blue
    '#55EFC4', // Aqua Green
    '#F368E0', // Bright Pink
    '#00CEC9', // Cyan Blue
    '#FDCB6E',  // Soft Orange
    '#FF6B6B', // Vivid Red
    '#4ECDC4', // Bright Teal
];
export const COLORS2 = [
    '#F06595', // Hot Pink
    '#FCA311', // Deep Amber
    '#845EC2', // Bold Violet
    '#2EC4B6', // Teal Green
    '#FF6F91', // Soft Rose
    '#3D5A80', // Slate Blue
    '#5EEAD4', // Minty Cyan
    '#C86DD7', // Electric Purple
  '#FF9F1C', // Bright Orange
  '#6A0572',  // Deep Magenta
];
