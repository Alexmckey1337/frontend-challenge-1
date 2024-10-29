import { Group, Text, rem } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { useState } from "react";
import { IconUpload, IconX, IconFilePlus } from "@tabler/icons-react";
import Papa from "papaparse";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

export default function MainPage() {
  const [colDefs, setColDefs] = useState([]);

  const [rowData, setRowData] = useState([]);

  const [csv, setCSV] = useState(null);

  const handleOnDrop = (file: File) => {
    Papa.parse(file, {
      complete: (results) => {
        setCSV(results);
        const fieldsArray = results.data[1].map((value) => ({ field: value })); //getting the columnnames from csv
        const truncatedArray = results.data.slice(2); //chopping the first two fields: empty one and the on with column name
        const resultArray = truncatedArray.map((entry) => {
          return fieldsArray.reduce((obj, { field }, index) => {
            obj[field] = entry[index];
            return obj;
          }, {});
        }); //modifying the rest of the fields into the grid standart
        setColDefs(fieldsArray);
        setRowData(resultArray);
        console.log(fieldsArray, truncatedArray, resultArray);
      },
    });
  };

  return (
    <div>
      <div className="space-y-2">
        <Dropzone onDrop={(files) => handleOnDrop(files[0])} onReject={(files) => console.log("rejected files", files)} maxSize={5 * 1024 ** 2} accept={[MIME_TYPES.csv]}>
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
              <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFilePlus style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag CSV file here or click to select
              </Text>
            </div>
          </Group>
        </Dropzone>
        <div
          className="ag-theme-quartz" // applying the Data Grid theme
          style={{ height: 500 }} // the Data Grid will fill the size of the parent container
        >
          {csv ? <AgGridReact rowData={rowData} columnDefs={colDefs} pagination paginationPageSize={50} paginationPageSizeSelector={[20, 50, 100]} /> : null}
        </div>
      </div>
    </div>
  );
}
