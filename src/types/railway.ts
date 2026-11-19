
export interface Station {
  id: string;
  name: string;
  nameJa: string;
  number: string;
  ward: string;
  wardJa: string;
  x: number;
  y: number;
  sound?: string;
  loop?: boolean;
}

export interface TrainLine {
  id: string;
  name: string;
  colour: string;
  stations: Station[];
}
