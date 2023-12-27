import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { writeFile } from "fs/promises";
import { extractAMDate } from "./helpers/amDate.js";

const year = 2023;
const URL = `https://www.suscopts.org/coptic-orthodox/fasts-and-feasts/${year}`;

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
        const date = $(row).children().last().text();
        const type = event.includes("Feast") ? "Feast" : "Fast";

        events.push({ event, type, date });

        // return false; // If we want to break early
    });

    const res = { year: year.toString(), amYear, events };

    const date = new Date();
    await writeFile(
        `events-${`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}.json`,
        JSON.stringify(res)
    );
} catch (e) {
    console.log(e);
}

console.log("done");
