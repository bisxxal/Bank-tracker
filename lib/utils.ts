export function extractFromEmail(fullName: string): string {
    const match = fullName.match(/<.*@(.*?)\./);
    return match ? match[1].toUpperCase() : 'Unknown';
    }