import React, { useEffect, useState } from "react";
import Price from "../../components/Price";
import Loading from "../../components/Loading";
import { adminService } from "../../services/admin.services.js";
import { format } from "date-fns";
import crypto from "crypto-js";
import { userWithdrawService } from "../../services/userWithdraw.service.js";

const AdminTransactions = () => {
  const [selectedType, setSelectedType] = useState("Buy");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateOrder, setDateOrder] = useState("desc");
  const [tableMetaData, setTableMetaData] = useState({
    totalRecords: 0,
    numberOfPages: 1,
  });
  const [loading, setLoading] = useState(false);

  const getShortId = (id) => {
    return crypto.MD5(id).toString().slice(0, 7);
  };

  const PAGE_WINDOW_SIZE = 6;

  const getVisiblePages = () => {
    const halfWindow = Math.floor(PAGE_WINDOW_SIZE / 2);
    let startPage = currentPage - halfWindow;
    let endPage = currentPage + halfWindow;

    // Ensure startPage and endPage stay within bounds
    if (startPage < 1) {
      startPage = 1;
      endPage = PAGE_WINDOW_SIZE;
    }
    if (endPage > tableMetaData.numberOfPages) {
      endPage = tableMetaData.numberOfPages;
    }

    // Generate the visible page numbers
    const visiblePages = [];
    for (let page = startPage; page <= endPage; page++) {
      visiblePages.push(page);
    }

    return visiblePages;
  };

  const fetchTransactions = async (page) => {
    try {
      setLoading(true);

      const transactions = await adminService.getTransactions(
        selectedType,
        page,
        dateOrder
      );

      setTransactions(transactions.transactions);
      setTableMetaData({
        totalRecords: transactions.totalRecords,
        numberOfPages: transactions.totalPages,
      });
      getVisiblePages();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdraws = async (page) => {
    try {
      setLoading(true);

      const transactions = await userWithdrawService.getAllUserWithdraws(
        page,
        dateOrder
      );

      setTransactions(transactions.withdraws);
      setTableMetaData({
        totalRecords: transactions.totalRecords,
        numberOfPages: transactions.totalPages,
      });
      getVisiblePages();
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setCurrentPage(1);
    selectedType === "Withdraw" ? fetchWithdraws(1) : fetchTransactions(1);

    return () => {
      setTransactions([]);
      controller.abort();
    };
  }, [selectedType]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    selectedType === "Withdraw"
      ? fetchWithdraws(currentPage)
      : fetchTransactions(currentPage);

    return () => {
      setTransactions([]);
      controller.abort();
    };
  }, [currentPage, dateOrder]);

  const getRange = () => {
    const fromRange = 10 * (currentPage - 1) + 1;
    const toRange = 10 * (currentPage - 1) + 10;

    return `${fromRange} to ${
      toRange > tableMetaData.totalRecords
        ? tableMetaData.totalRecords
        : toRange
    }`;
  };
  const nextPage = () => {
    if (currentPage < tableMetaData.numberOfPages)
      setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="w-fit gap-x-2 bg-white rounded-full flex flex-row justify-between items-center mb-5">
        <button
          className={`pr-3 pl-3 p-2 rounded-full ${
            selectedType === "Buy" ? " bg-purple text-white" : ""
          } tracking-wider`}
          onClick={() => setSelectedType("Buy")}
        >
          Buy Transactions
        </button>
        <button
          className={`pr-3 pl-3 p-2 rounded-full ${
            selectedType === "Sell" ? " bg-purple text-white" : ""
          } tracking-wider`}
          onClick={() => setSelectedType("Sell")}
        >
          Sell Transactions
        </button>
        <button
          className={`pr-3 pl-3 p-2 rounded-full ${
            selectedType === "Withdraw" ? " bg-purple text-white" : ""
          } tracking-wider`}
          onClick={() => setSelectedType("Withdraw")}
        >
          Withdrawals
        </button>
      </div>
      {loading || transactions.length <= 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loading otherClasses={"w-10 h-10"} />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full overflow-x-auto rounded-xl shadow-lg">
            <table
              id="datatable"
              className="table-auto border-collapse w-full text-left text-gray-700"
            >
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 font-medium w-[150px]">Transaction ID</th>
                  <th className="p-3 font-medium w-[150px]">User ID</th>
                  <th className="p-3 font-medium w-[150px]">
                    <div className="flex flex-row gap-2">
                      Date & Time{" "}
                      <img
                        src="/images/admin/next_page.svg"
                        alt="Next Page"
                        width={18}
                        className={`${
                          dateOrder === "desc" ? "rotate-90" : "-rotate-90"
                        }`}
                        onClick={() =>
                          setDateOrder((prev) =>
                            prev === "desc" ? "asc" : "desc"
                          )
                        }
                      />
                    </div>
                  </th>
                  <th className="p-3 font-medium  w-[150px]">
                    Opening Balance
                  </th>
                  <th className="p-3 font-medium  w-[150px]">
                    {selectedType === "Withdraw"
                      ? "Withdrawal amount"
                      : "Quantity"}
                  </th>
                  <th className="p-3 font-medium  w-[150px]">
                    Closing Balance
                  </th>
                  {selectedType !== "Withdraw" && (
                    <th className="p-3 font-medium  w-[150px]">
                      Stock Abbreviation
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {transactions.map((row, index) => (
                  <tr key={index} className={`border-b`}>
                    <td className={`p-3`}>#{getShortId(row._id)}</td>
                    <td className={`p-3`}>#{getShortId(row.userId)}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <p>{format(row.date, "dd MMM yyyy")}</p>
                        <p className="text-sm text-white-300">
                          {format(row.date, "hh.mm a")}
                        </p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Price
                        price={row.opening_balance.toFixed(2)}
                        styles="absolute -right-3 -top-1"
                      />
                    </td>
                    <td className="p-3">
                      {selectedType === "Withdraw"
                        ? row.withdraw_amount
                        : row.quantity}
                    </td>
                    <td className="p-3">
                      {" "}
                      <Price
                        price={row.closing_balance.toFixed(2)}
                        styles="absolute -right-3 -top-1"
                      />
                    </td>
                    {row.companyId && (
                      <td className="p-3">{row.companyId.acronym}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col sm:flex-row justify-between items-center w-full p-5 pl-3">
              <div className="text-sm text-gray-600 p-2">
                Showing {getRange()} of {tableMetaData.totalRecords} entries
              </div>
              <ul className="flex space-x-2 mt-2 sm:mt-0">
                <li>
                  <button
                    className={`px-3 py-1 text-sm border shadow-sm rounded ${
                      currentPage === 1 ? "bg-gray-100" : "bg-white"
                    }`}
                    onClick={prevPage}
                    disabled={currentPage === 1}
                  >
                    <img
                      src="/images/admin/prev_page.svg"
                      alt="Next Page"
                      width={18}
                    />
                  </button>
                </li>
                {/* Pagination Numbers */}
                {getVisiblePages().map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-sm shadow-sm ${
                        page === currentPage
                          ? "bg-purple text-white"
                          : "bg-white border"
                      } rounded`}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className={`px-3 py-1 text-sm border shadow-sm rounded ${
                      currentPage === tableMetaData.numberOfPages
                        ? "bg-gray-100"
                        : "bg-white"
                    }`}
                    onClick={nextPage}
                    disabled={currentPage === tableMetaData.numberOfPages}
                  >
                    <img
                      src="/images/admin/next_page.svg"
                      alt="Next Page"
                      width={18}
                    />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
