
import mongoose from 'mongoose';
import { createSensorLog } from '../services/sensor.service';
import SensorLogger from '../models/sensor.model';

jest.mock('../models/sensor.model');

const mockSensorLogger = SensorLogger as jest.Mocked<typeof SensorLogger>;

describe('Sensor Service', () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new sensor log', async () => {
    const log = {
      equipmentId: 'EQ-123',
      timestamp: new Date().toISOString(),
      value: 42.5,
    };

    // Configurando o mock antes de chamar a função
    mockSensorLogger.findOneAndUpdate.mockResolvedValue({
      equipmentId: 'EQ-123',
      measurements: [{ timestamp: log.timestamp, value: log.value }],
    } as any);

    const result = await createSensorLog(log);

    // Verificações
    expect(result.equipmentId).toBe('EQ-123');
    expect(result.measurements.length).toBe(1);
    expect(result.measurements[0].timestamp).toBe(log.timestamp);
    expect(result.measurements[0].value).toBe(42.5);
  });
});
