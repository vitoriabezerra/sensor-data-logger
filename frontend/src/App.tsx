import React, { useState } from 'react';

import './App.css';
import SensorChart from './components/sensorChart';
import AverageChart from './components/AverageChart';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Moment } from 'moment';


const App: React.FC = () => {
    const [date, setDate] = useState<Moment | null | undefined>(null);
    const [id, setId] = useState('');
    const [interval, setInterval] = useState('24hours');
    const [showAverage, setShowAverage] = useState(false);
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setShowAverage(true);
    };
  
    return (
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid className="App" container direction="column" alignItems="center" spacing={4}>
          <Grid item>
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
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item container spacing={4}>
            {date && id ? (
              <Grid item xs={12}>
                <SensorChart date={date} id={id} />
              </Grid>
            ) : (
              <Grid item xs={12}>
                {showAverage && <AverageChart date={date || ''} />}
              </Grid>
            )}
          </Grid>
        </Grid>
      </LocalizationProvider>
    );
  };
  
  export default App;
