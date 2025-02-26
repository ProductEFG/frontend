import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

const DataTable = ({ data, thirdColumn, onViewStock }) => {
  const location = useLocation();

  // Define the header labels based on the third column prop
  const headers = [
    "#",
    "Company",
    "Current Price",
    thirdColumn,
    ...(location.pathname !== "/admin/home" ? ["Action"] : []),
  ];

  return (
    <TableContainer
      sx={{
        maxHeight: "470px",
        overflowY: "auto",
      }}
    >
      <Table sx={{ borderCollapse: "collapse", fontFamily: "Poppins" }}>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={header}
                align={"center"}
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: "light",
                  color: "#9AA0A6",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  border: "none",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((company, index) => (
            <TableRow key={company.id || company._id}>
              <TableCell
                align="center"
                sx={{
                  border: "none",
                  fontFamily: "Poppins",
                }}
              >
                {index + 1}
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  border: "none",
                  width: 150,
                  fontFamily: "Poppins",
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    maxWidth: "150px", // Ensure maxWidth is applied
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis", // Adds the "..." for overflow
                  }}
                >
                  <img
                    src={`${company.logo}`}
                    className="w-10 h-10"
                    alt={`${company.name} logo`}
                  />
                  <span
                    style={{ textOverflow: "ellipsis", overflow: "hidden" }}
                  >
                    {company.name}
                  </span>
                </div>
              </TableCell>

              <TableCell
                align="center"
                sx={{ border: "none", fontFamily: "Poppins" }}
              >
                <div className="flex gap-1 justify-center items-center text-xl">
                  <div className="relative">
                    {company.current_price}
                    <img
                      src="/images/KidZosicon.svg"
                      alt="Kidzos Icon"
                      width={18}
                      className="absolute -right-5 top-0.5"
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  width: 150,
                  border: "none",
                  fontSize: "20px",
                  fontFamily: "Poppins",
                  fontWeight: "light",
                }}
              >
                {thirdColumn === "Current Number of Investors" &&
                  company.number_of_buys}
                {thirdColumn === "Number of Trades" && company.number_of_trades}
                {thirdColumn === "Return %" && (
                  <p
                    className={`${
                      company.current_return > 0
                        ? "text-green-500"
                        : "text-red-600"
                    } flex gap-1 justify-center`}
                  >
                    {company.current_return}%
                    <img
                      src={`/images/${
                        company.current_return > 0
                          ? "return_positive"
                          : "return_negative"
                      }.svg`}
                      alt="positive_return"
                      width={18}
                    />
                  </p>
                )}
                {thirdColumn === "Visitors" && company.current_visitors}
              </TableCell>
              {location.pathname !== "/admin/home" && (
                <TableCell
                  align="center"
                  sx={{
                    border: "none",
                    width: 200,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={
                      <img src="/images/white_profile.svg" width={20} />
                    }
                    onClick={() => onViewStock(company)}
                    style={{
                      borderRadius: "20px",
                      backgroundColor: "#31CFCB",
                      fontSize: "14px",
                      fontFamily: "Poppins",
                      fontWeight: "lighter",
                      textTransform: "none",
                      boxShadow: "none",
                    }}
                  >
                    View Stock
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
