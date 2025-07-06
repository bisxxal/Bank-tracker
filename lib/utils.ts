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
    { value: 'food', name: 'Food' },
    { value: 'transport', name: 'Transport' },
    { value: 'entertainment', name: 'Entertainment' },
    { value: 'purchases', name: 'Purchases' },
    { value: 'education', name: 'Education' },
    { value: 'rent', name: 'Rent' },
    { value: 'travels', name: 'Travels' },
    { value: 'bills', name: 'Bills' }
]