export function extractAMDate(str) {
    let [rawADYear, rawAMYear] = str.split("/");
    let amYear = rawAMYear.trim();
    amYear = amYear.replace(" A.M.", "");
    amYear = amYear.replace("–", " – ");

    return amYear;
}