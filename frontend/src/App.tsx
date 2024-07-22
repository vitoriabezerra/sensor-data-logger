import React, { useEffect, useState } from "react";

import "./App.css";
import SensorChart from "./components/sensorChart";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import moment from "moment";
import SensorModal from "./components/sensorModal";

const App: React.FC = () => {
  const [interval, setInterval] = useState("24hours");
  const [isLoading, setIsLoading] = useState(false);
  const [dateToSearch, setDateToSearch] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshChart, setRefreshChart] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    const dateToSearch = getDate(interval);
    setDateToSearch(dateToSearch.format("YYYY-MM-DDTHH:mm:ss.SSSZ"));
  }, [interval]);

  const getDate = (interval: string): Moment => {
    const now = moment();
    switch (interval) {
      case "24hours":
        return now.subtract(1, "days");
      case "2days":
        return now.subtract(2, "days");
      case "1week":
        return now.subtract(1, "weeks");
      case "1month":
        return now.subtract(1, "months");
      default:
        return now.subtract(1, "days");
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {setShowModal(false)};

  const handleRefresh = () => {
    setRefreshChart(!refreshChart);
};

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Grid
        className="App"
        container
        direction="column"
        alignItems="center"
        spacing={4}
        style={{ padding: 40 }}
      >
        <Typography variant="h2">Average Sensor Data</Typography>

        <Grid item container spacing={4}>
          <Grid item container justifyContent="center" flexDirection="row" spacing={4} alignItems="center">
            <Grid item>
              <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                <InputLabel id="interval-label">Interval</InputLabel>
                <Select
                  labelId="interval-label"
                  id="interval"
                  value={interval}
                  onChange={(e) => setInterval(e.target.value)}
                  label="Interval"
                >
                  <MenuItem value="24hours">24 Hours</MenuItem>
                  <MenuItem value="2days">2 Days</MenuItem>
                  <MenuItem value="1week">1 Week</MenuItem>
                  <MenuItem value="1month">1 Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleOpenModal}>
                + Add Sensor Value
              </Button>
            </Grid>
          </Grid>
          {dateToSearch && (
            <Grid item xs={12}>
              <SensorChart date={dateToSearch} refreshChart={refreshChart} />
            </Grid>
          )}
        </Grid>
        <SensorModal open={showModal} handleClose={handleCloseModal} onRefresh={handleRefresh}  />
      </Grid>
    </LocalizationProvider>
  );
};

export default App;
