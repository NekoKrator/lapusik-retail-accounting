export function formatTime(dateString: string | number): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

export function formatFullDateTime(dateString: string | number): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatHourMinuteTime(dateString: string | number): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
    });
}
