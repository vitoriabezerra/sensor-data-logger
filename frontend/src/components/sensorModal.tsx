import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { createNewLog, getSensorData } from "../services/api";
import { SensorMeasurement } from "../models/sensor.model";

interface SensorModalProps {
  open: boolean;
  handleClose: () => void;
}

const SensorModal: React.FC<SensorModalProps> = ({ open, handleClose }) => {
  const [equipmentId, setEquipmentId] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async () => {
    const sensorData: SensorMeasurement = {
      equipmentId,
      timestamp: new Date().toISOString(),
      value: parseFloat(value),
    };

    try {
      await createNewLog(sensorData);
      handleClose();
    } catch (error) {
      console.error("Error creating sensor log", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Create Sensor Log
        </Typography>
        <TextField
          margin="normal"
          fullWidth
          label="Equipment ID"
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Value"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Enviar
        </Button>
      </Box>
    </Modal>
  );
};

export default SensorModal;
