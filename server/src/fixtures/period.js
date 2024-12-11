import { v4 as uuidv4 } from 'uuid';

const periodsFixture = [
  {
    id: uuidv4(),
    beginDate: '2024-09-02',
    endDate: '2024-12-31',
  },
  {
    id: uuidv4(),
    beginDate: '2025-01-01',
    endDate: '2025-06-30',
  },
];

export default periodsFixture;