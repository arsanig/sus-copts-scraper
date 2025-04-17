import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { writeFile } from "fs/promises";
import { extractAMDate, splitDateRange, splitEvent, convertDateString } from "./utility.js";

const date = new Date();
const dateYear = date.getFullYear();
const dateMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
const dateDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
// Sometimes SSL is not enabled so http instead of https
const URL = `http://www.suscopts.org/coptic-orthodox/fasts-and-feasts/${dateYear}`;

try {
    const response = await fetch(URL);
    const body = await response.text();
    const $ = cheerio.load(body);

    const amYear = extractAMDate($("h2").text());

    const rows = $("#center-col > table > tbody > tr");
    const events = [];
    rows.each((i, row) => {
        if (i == 0) {
            return true; // Skip first row as it has the table headings
        }

        const event = $(row).children().first().text();
        let eventTitle,
            description = "";
        if (event.includes("(")) {
            [eventTitle, description] = splitEvent(event);
        } else {
            eventTitle = event;
            description = "";
        }
        const date = $(row).children().last().text();
        const type = event.includes("Feast") ? "feast" : "fast";

        let startDate,
            endDate = "";
        if (date.includes("–")) {
            [startDate, endDate] = splitDateRange(date);
            startDate = convertDateString(startDate, dateYear);
            endDate = convertDateString(endDate, dateYear, true);
        } else {
            startDate = convertDateString(date, dateYear);
            endDate = convertDateString(date, dateYear, true);
        }

        (eventTitle.includes("Jonah") || eventTitle.includes("Holy Great")) && type !== "feast"
            ? events.push({ id: (i - 1).toString(), eventTitle, description, type, startDate, endDate, noFish: true })
            : events.push({ id: (i - 1).toString(), eventTitle, description, type, startDate, endDate, noFish: false });

        // return false; // If we want to break early
    });

    const res = { year: dateYear.toString(), amYear, events };

    await writeFile(`events-${`${dateYear}-${dateMonth}-${dateDay}`}.json`, JSON.stringify(res));
} catch (e) {
    console.log(e);
}

console.log("done");
