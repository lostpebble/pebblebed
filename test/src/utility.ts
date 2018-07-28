import * as _ from "lodash";

const { performance, PerformanceEntry } = require("perf_hooks");

export async function waitSeconds(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), seconds * 1000);
  });
}

export function assertEqual(message: string, objectOne: any, objectTwo: any) {
  if (_.isEqual(objectOne, objectTwo)) {
    console.log(`ASSERT EQUAL PASSED: ${message}`);
  } else {
    console.error(`ASSERT EQUAL FAILED: ${message}`);
    console.log(`objectOne`, objectOne);
    console.log(`objectTwo`, objectTwo);
  }
}

export function printMarkMeasurements(markEntries: PerformanceEntry[], prefix: string = "") {
  if (!Array.isArray(markEntries) || markEntries.length === 0) {
    console.log(`No performance (mark) entries passed to printMeasurements() ...`);
    return false;
  }

  if (prefix.length > 0) {
    prefix = `[ ${prefix} ] `;
  }

  for (let i = 1; i < markEntries.length; i += 1) {
    performance.measure(`${prefix}TIME_TAKEN:${markEntries[i].name}`, markEntries[i - 1].name, markEntries[i].name);
  }

  performance.measure(`${prefix}TOTAL_TIME`, markEntries[0].name, markEntries[markEntries.length - 1].name);

  const measurements: PerformanceEntry[] = performance.getEntriesByType("measure");

  for (const measurement of measurements) {
    console.log(`${measurement.name} : ${Math.round(measurement.duration)} ms`);
  }

  // console.log(`${prefix}Total elapsed time from [${markEntries[0].name}] -> [${markEntries[markEntries.length - 1].name}] : ${Math.round(performance.getEntriesByName(`${prefix}TOTAL_TIME`)[0].duration)} ms`)
}
