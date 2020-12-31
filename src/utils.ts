export function getDaysSinceDate(date: Date): number {
    const daysToTimestamp = 86400000;
    const timeDiff = new Date().getTime() - date.getTime();
    return Math.floor(timeDiff / daysToTimestamp);
}

export function formatDate(date: Date): string {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .split("T")[0];
}
