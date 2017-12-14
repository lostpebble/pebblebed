const { performance } = require("perf_hooks");

export async function waitSeconds(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), seconds * 1000);
  });
}

export function printMarkMeasurements(markEntries: PerformanceEntry[]) {
  if (!Array.isArray(markEntries) || markEntries.length === 0) {
    console.log(`No performance (mark) entries passed to printMeasurements() ...`);
    return false;
  }

  for (let i = 1; i < markEntries.length; i += 1) {
    performance.measure(`TIME_TAKEN:${markEntries[i].name}`, markEntries[i - 1].name, markEntries[i].name);
  }

  const measurements: PerformanceEntry[] = performance.getEntriesByType("measure");

  for (const measurement of measurements) {
    console.log(`${measurement.name} : ${Math.round(measurement.duration)} ms`);
  }

  performance.measure("TOTAL_TIME", markEntries[0].name, markEntries[markEntries.length - 1].name);

  console.log(`Total elapsed time from [${markEntries[0].name}] -> [${markEntries[markEntries.length - 1]}] : ${Math.round(performance.getEntriesByName("TOTAL_TIME")[0].duration)} ms`)
}
