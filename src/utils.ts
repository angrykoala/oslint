export function getDaysSinceDate(date: Date): number {
    const daysToTimestamp = 86400000;
    const timeDiff = new Date().getTime() - date.getTime();
    return Math.floor(timeDiff / daysToTimestamp);
}
