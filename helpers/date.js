// type mmMonths = {
//     [key: string]: string;
// };

/**
 * I should probably fix the dates when I scrape
 * the data into a nicer format so I don't have to convert here
 */

/**
 * for single day events I should put the end date
 * as the same date, which would make life easier
 */

/**
 *
 * @param dateStr
 * @returns
 */
export const convertDateString = (dateStr) => {
    const date = new Date();
    const dateYear = date.getFullYear();
    const formattedDate = `${dateStr} ${dateYear}`;
    const months = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
    };

    const [month, day, year] = formattedDate.split(" ");
    const formattedDay = day.padStart(2, "0");
    return new Date(`${year}-${months[month]}-${formattedDay}`).toISOString();
};
