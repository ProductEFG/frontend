import React from "react";
import MetricsList from "../../components/MetricsList.jsx";
import { Stack } from "@mui/material";
import LeaderboardsTable from "../LeaderboardsTable.jsx";

const AdminDashboard = () => {
  return (
    <div>
      <Stack direction={"row"} spacing={2}>
        <div className="w-[710px]">
          <MetricsList />
        </div>
        <div>
          <LeaderboardsTable />
        </div>
      </Stack>
    </div>
  );
};

export default AdminDashboard;
