export interface Exercise {
  id: string;
  name: string;
  /** e.g. ["50 lb x 5", "60 lb x 5", "70 lb x 5"] */
  setInfo: string[];
  /** Number of sets, e.g. 3 */
  setCount: number;
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

/** Map from date string (YYYY-MM-DD) to list of workout IDs for that day */
export type WeekSchedule = Record<string, Workout[]>;
