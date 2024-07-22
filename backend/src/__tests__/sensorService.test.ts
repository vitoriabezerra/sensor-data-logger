import moment from 'moment';
import SensorLogger from '../models/sensor.model';
import {
  createSensorLog,
  getSensorLogByIdAndDate,
  getSensorLogsByDate,
  createMultipleSensorLogs
} 
from '../services/sensor.service';
import mongoose from 'mongoose';

jest.mock('../models/sensor.model');

const mockSensorLogger = SensorLogger as jest.Mocked<typeof SensorLogger>;

describe('Sensor Service', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSensorLog', () => {
    it('should create a new sensor log', async () => {
      const log = {
        equipmentId: 'EQ-123',
        timestamp: new Date().toISOString(),
        value: 42.5,
      };

      mockSensorLogger.findOneAndUpdate.mockResolvedValue({
        equipmentId: 'EQ-123',
        measurements: [{ timestamp: log.timestamp, value: log.value }],
      } as any);

      const result = await createSensorLog(log);

      expect(result.equipmentId).toBe('EQ-123');
      expect(result.measurements.length).toBe(1);
      expect(result.measurements[0].timestamp).toBe(log.timestamp);
      expect(result.measurements[0].value).toBe(42.5);
    });

    it('should throw an error if create fails', async () => {
      const log = {
        equipmentId: 'EQ-123',
        timestamp: new Date().toISOString(),
        value: 42.5,
      };

      mockSensorLogger.findOneAndUpdate.mockRejectedValue(new Error('Create failed'));

      await expect(createSensorLog(log)).rejects.toThrow('Error while trying to create sensor log');
    });
  });

  describe('getSensorLogByIdAndDate', () => {
    it('should return sensor log filtered by ID and date', async () => {
      const log = {
        equipmentId: 'EQ-123',
        timestamp: new Date().toISOString(),
        value: 42.5,
      };

      const date = moment().subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      mockSensorLogger.aggregate.mockResolvedValue([
        {
          equipmentId: 'EQ-123',
          measurements: [log],
          averageValue: 42.5,
        },
      ]);

      const result = await getSensorLogByIdAndDate('EQ-123', date);

      expect(result.equipmentId).toBe('EQ-123');
      expect(result.measurements.length).toBe(1);
      expect(result.measurements[0].timestamp).toBe(log.timestamp);
      expect(result.measurements[0].value).toBe(42.5);
      expect(result.averageValue).toBe(42.5);
    });

    it('should return empty measurements and average value 0 if no logs found', async () => {
      const date = moment().subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      mockSensorLogger.aggregate.mockResolvedValue([]);

      const result = await getSensorLogByIdAndDate('EQ-123', date);

      expect(result.equipmentId).toBe('EQ-123');
      expect(result.measurements.length).toBe(0);
      expect(result.averageValue).toBe(0);
    });
  });

  describe('getSensorLogsByDate', () => {
    it('should return sensor logs filtered by date', async () => {
      const log1 = {
        equipmentId: 'EQ-123',
        timestamp: new Date().toISOString(),
        value: 42.5,
      };
      const log2 = {
        equipmentId: 'EQ-456',
        timestamp: new Date().toISOString(),
        value: 36.7,
      };

      const date = moment().subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      mockSensorLogger.aggregate.mockResolvedValue([
        {
          equipmentId: 'EQ-123',
          measurements: [log1],
          averageValue: 42.5,
        },
        {
          equipmentId: 'EQ-456',
          measurements: [log2],
          averageValue: 36.7,
        },
      ]);

      const result = await getSensorLogsByDate(date);

      expect(result.length).toBe(2);
      expect(result[0].equipmentId).toBe('EQ-123');
      expect(result[0].measurements.length).toBe(1);
      expect(result[0].measurements[0].timestamp).toBe(log1.timestamp);
      expect(result[0].measurements[0].value).toBe(42.5);
      expect(result[0].averageValue).toBe(42.5);

      expect(result[1].equipmentId).toBe('EQ-456');
      expect(result[1].measurements.length).toBe(1);
      expect(result[1].measurements[0].timestamp).toBe(log2.timestamp);
      expect(result[1].measurements[0].value).toBe(36.7);
      expect(result[1].averageValue).toBe(36.7);
    });

    it('should return empty array if no logs found', async () => {
      const date = moment().subtract(1, "days").format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      mockSensorLogger.aggregate.mockResolvedValue([]);

      const result = await getSensorLogsByDate(date);

      expect(result.length).toBe(0);
    });
  });

  describe('createMultipleSensorLogs', () => {
    it('should create multiple sensor logs', async () => {
      const logs = [
        {
          equipmentId: 'EQ-123',
          timestamp: new Date().toISOString(),
          value: 42.5,
        },
        {
          equipmentId: 'EQ-456',
          timestamp: new Date().toISOString(),
          value: 36.7,
        },
      ];

      mockSensorLogger.findOneAndUpdate.mockResolvedValue({
        equipmentId: 'EQ-123',
        measurements: [{ timestamp: logs[0].timestamp, value: logs[0].value }],
      } as any);
      
      mockSensorLogger.findOneAndUpdate.mockResolvedValueOnce({
        equipmentId: 'EQ-456',
        measurements: [{ timestamp: logs[1].timestamp, value: logs[1].value }],
      } as any);

      await createMultipleSensorLogs(logs);

      expect(mockSensorLogger.findOneAndUpdate).toHaveBeenCalledTimes(2);
      expect(mockSensorLogger.findOneAndUpdate).toHaveBeenCalledWith(
        { equipmentId: logs[0].equipmentId },
        {
          $push: {
            measurements: logs[0],
          },
        },
        { 
          new: true, 
          upsert: true 
        }
      );
      expect(mockSensorLogger.findOneAndUpdate).toHaveBeenCalledWith(
        { equipmentId: logs[1].equipmentId },
        {
          $push: {
            measurements: logs[1],
          },
        },
        { 
          new: true, 
          upsert: true 
        }
      );
    });

    it('should throw an error if any create fails', async () => {
      const logs = [
        {
          equipmentId: 'EQ-123',
          timestamp: new Date().toISOString(),
          value: 42.5,
        },
        {
          equipmentId: 'EQ-456',
          timestamp: new Date().toISOString(),
          value: 36.7,
        },
      ];

      mockSensorLogger.findOneAndUpdate.mockRejectedValue(new Error('Create failed'));

      await expect(createMultipleSensorLogs(logs)).rejects.toThrow('Error while trying to create sensor logs');
    });
  });
});
