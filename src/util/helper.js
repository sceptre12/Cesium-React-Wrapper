import { v4 as uuidv4 } from "uuid";

export const randomNumberFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const createRandomUUID = () => uuidv4();
