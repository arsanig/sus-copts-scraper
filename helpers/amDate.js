export function extractAMDate(str) {
    let [rawADYear, rawAMYear] = str.split("/");
    let amYear = rawAMYear.trim();
    amYear = amYear.replace(" A.M.", "");
    amYear = amYear.replace("–", " – ");

    return amYear;
}

// const [date1, date2] = splitDateRange("February 7–12");
export function splitDateRange(dateRange) {
    const sameMonthMatch = dateRange.match(/^(\w+)\s(\d+)–(\d+)$/); // e.g., "April 14–16"
    const differentMonthMatch = dateRange.match(/^(\w+)\s(\d+)\s–\s(\w+)\s(\d+)$/); // e.g., "June 9 – July 11"

    if (sameMonthMatch) {
        const month = sameMonthMatch[1];
        const startDay = sameMonthMatch[2];
        const endDay = sameMonthMatch[3];
        return [`${month} ${startDay}`, `${month} ${endDay}`];
    }

    if (differentMonthMatch) {
        const startMonth = differentMonthMatch[1];
        const startDay = differentMonthMatch[2];
        const endMonth = differentMonthMatch[3];
        const endDay = differentMonthMatch[4];
        return [`${startMonth} ${startDay}`, `${endMonth} ${endDay}`];
    }

    return null; // Return null if the input format doesn't match expected patterns
}

export function splitEvent(input) {
    const openBracketIndex = input.indexOf("("); // Find the opening bracket
    if (openBracketIndex === -1) return [input]; // If no brackets, return original string

    const mainText = input.slice(0, openBracketIndex).trim(); // Extract text before bracket
    const bracketText = input.slice(openBracketIndex).trim(); // Extract text including brackets

    return [mainText, bracketText];
}
