import fs from "fs";
import * as path from "path";
import Papa from "papaparse";
import { InputLocationRow, OutputDataRow } from "./inputs/types";

// get location data
const getLocationData = (): InputLocationRow[] => {
  const input = path.resolve(__dirname, "inputs/location.csv");
  // When the file is a local file when need to convert to a file Obj.
  const content = fs.readFileSync(input, "utf8");
  let response: InputLocationRow[] = [];

  Papa.parse(content, {
    header: true,
    //delimiter: "\t",
    complete: function (results) {
      console.log("Finished:", results.data.length);
      response = results.data as InputLocationRow[];
    },
  });

  return response;
};

// get output data
const getOutputData = (): OutputDataRow[] => {
  const input = path.resolve(__dirname, "output.csv");
  // When the file is a local file when need to convert to a file Obj.
  const content = fs.readFileSync(input, "utf8");
  let response: OutputDataRow[] = [];

  Papa.parse(content, {
    header: true,
    //delimiter: "\t",
    complete: function (results) {
      console.log("Finished:", results.data.length);
      response = results.data as OutputDataRow[];
    },
  });

  return response;
};

const copyLocationData = () => {
  const locationData = getLocationData();

  let outputData = getOutputData();

  // for each location row, find the matching output row & update the output row's location description
  locationData.forEach((locationRow) => {
    const outputRows = outputData.filter((outputRow) =>
      outputRow.Name.includes(locationRow.Location)
    );

    if (outputRows && outputRows.length > 0) {
      outputRows.forEach((outputRow) => {
        outputRow["Location Description"] = locationRow["Location Description"];
      });
    }
  });

  return outputData;
};

export const writeLocationToOutput = () => {
  const location = copyLocationData();

  // Two-line, comma-delimited file
  const csv = Papa.unparse(location);

  fs.writeFile("gen.csv", csv, () => {
    console.log("done");
  });
};
