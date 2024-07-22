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

const App: React.FC = () => {
  const [date, setDate] = useState<Moment | null | undefined>(null);
  const [id, setId] = useState("");
  const [interval, setInterval] = useState("24hours");
  const [showAverage, setShowAverage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dateToSearch, setDateToSearch] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAverage(true);
  };

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
        {/* <Grid item>
          <h1>Sensor Dashboard</h1>
        </Grid>
        <Grid item>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TextField
                  id="equipment-id"
                  label="Equipment ID"
                  variant="outlined"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  label="Select Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                />
              </Grid>

              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid> */}

          <Typography variant="h2">Average Sensor Data</Typography>

        <Grid item container spacing={4}>
          <Grid item xs={12}>
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
          {dateToSearch && (
            <Grid item xs={12}>
              <SensorChart date={dateToSearch} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default App;
