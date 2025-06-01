import axios from "npm:axios";
import { load } from "npm:cheerio";

import { TANGLY_URL } from "./url.ts";

const response = await axios.get(TANGLY_URL);
const $ = load(response.data, null, false);

console.log($("title").toString());
