import { getPuzzleConfig, getPuzzleMaxId, tanglyUrl } from "./scraping.ts";
import cliProgress from "cli-progress";
import { fromFileUrl, join } from "https://deno.land/std@0.224.0/path/mod.ts";

const archiveFilepath = join(
  fromFileUrl(import.meta.url),
  "../tangly_archive.json",
);

async function main() {
  const puzzleMaxId = await getPuzzleMaxId();
  let puzzles = [];

  // Only retrieve new puzzles
  const archiveExists = await Deno.stat(archiveFilepath)
    .then(() => true)
    .catch((err) => {
      if (err instanceof Deno.errors.NotFound) return false;
      else throw err;
    });

  let startId = 0;

  if (archiveExists) {
    const parsedJson = JSON.parse(await Deno.readTextFile(archiveFilepath));

    if (parsedJson && puzzleMaxId > parsedJson.numberOfPuzzles) {
      startId = parsedJson.numberOfPuzzles + 1;
      puzzles = parsedJson.puzzles;
    } else {
      console.log("✅ No new puzzles to archive");
      return;
    }
  }

  // Progress bar
  const bar = new cliProgress.SingleBar({
    format:
      "📦 Archiving puzzles |{bar}| {percentage}% || {value}/{total} puzzles",
    hideCursor: true,
  }, cliProgress.Presets.shades_classic);

  bar.start(puzzleMaxId, startId);

  for (let i = startId; i <= puzzleMaxId; i++) {
    puzzles.push(await getPuzzleConfig(i));
    bar.update(i);
  }

  bar.stop();

  // Write to file
  const data = {
    "tanglyPuzzlesURL": tanglyUrl,
    "numberOfPuzzles": puzzleMaxId,
    "puzzles": puzzles,
    "timestamp": new Date().toISOString(),
  };

  const json = JSON.stringify(data, null, 2);
  await Deno.writeTextFile(archiveFilepath, json);

  console.log("✅ Archive updated.");
}

if (import.meta.main) {
  await main();
}
