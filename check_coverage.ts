const threshold = 80;

// Generate LCOV report using `deno coverage`
const cmd = new Deno.Command("deno", {
  args: ["coverage", "coverage", "--lcov"],
  stdout: "piped",
  stderr: "piped",
});

const { stdout, success, stderr } = await cmd.output();

if (!success) {
  console.error("❌ Failed to generate coverage report.");
  console.error(new TextDecoder().decode(stderr));
  Deno.exit(1);
}

const text = new TextDecoder().decode(stdout);

// Extract LF (Lines Found) and LH (Lines Hit)
const lfMatch = text.match(/LF:(\d+)/g);
const lhMatch = text.match(/LH:(\d+)/g);

if (!lfMatch || !lhMatch) {
  console.error("❌ No coverage data found.");
  Deno.exit(1);
}

const lf = lfMatch.map((x) => Number(x.slice(3))).reduce((a, b) => a + b, 0);
const lh = lhMatch.map((x) => Number(x.slice(3))).reduce((a, b) => a + b, 0);

const percent = lf > 0 ? (lh / lf) * 100 : 0;
console.log(`✅ Coverage: ${percent.toFixed(2)}%`);

if (percent < threshold) {
  console.error(`❌ Coverage is below ${threshold}%`);
  Deno.exit(1);
}
