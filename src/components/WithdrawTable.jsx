import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import crypto from "crypto-js";
import { TableVirtuoso } from "react-virtuoso";
import Price from "./Price";
import { format } from "date-fns";

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer
      component={"div"}
      {...props}
      ref={ref}
      sx={{ border: "none" }}
    />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed", border: "none" }}
    />
  ),
  TableHead: React.forwardRef((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

const fixedHeaderContent = (columns) => (
  <TableRow>
    {columns.map((column) => (
      <TableCell
        key={column.dataKey}
        variant="head"
        align={"center"}
        style={{
          width: column.width,
          whiteSpace: "nowrap",
        }}
        sx={{
          fontSize: "20px",
          color: "#9AA0A6",
          border: "none",
          padding: 1,
          bgcolor: "white",
        }}
      >
        {column.label}
      </TableCell>
    ))}
  </TableRow>
);

const getShortId = (id) => {
  return crypto.MD5(id).toString().slice(0, 7);
};

const rowContent = (columns, row) => (
  <>
    {columns.map((column) => (
      <TableCell
        key={column.dataKey}
        align={"center"}
        sx={{
          fontSize: "20px",
          fontWeight: "semibold",
          border: "none",
          padding: 1,
        }}
      >
        {(column.label === "Cash Balance" ||
          column.label === "Withdrawal Amount" ||
          column.label === "Remaining") && (
          <div className="relative">
            <Price
              price={row[column.dataKey].toFixed(0)}
              styles={"absolute -top-1 -right-5 w-4"}
              font={"light"}
            />
          </div>
        )}
        {column.label === "Time" && (
          <div className="relative">
            {format(new Date(row[column.dataKey]), "dd MMM yyyy - hh.mm a")}
          </div>
        )}
        {column.label === "Withdraw ID" && (
          <div>#{getShortId(row[column.dataKey])}</div>
        )}
      </TableCell>
    ))}
  </>
);

export default function WithdrawTable({ columns, rows }) {
  return (
    <div
      style={{
        height: "52vh",
        width: "100%",
        border: "none",
        paddingRight: 20,
      }}
    >
      {rows.length > 0 ? (
        <TableVirtuoso
          data={rows}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => fixedHeaderContent(columns)}
          itemContent={(index, row) => rowContent(columns, row)}
        />
      ) : (
        <div className="flex justify-center items-center h-[20vh]">
          <p className="text-2xl tracking-wider">No Withdraws Yet</p>
        </div>
      )}
    </div>
  );
}
