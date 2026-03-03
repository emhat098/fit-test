"use client";

import {
  ComponentProps,
  ElementType,
  FC,
  createContext,
  useContext,
  useState,
} from "react";

import Plus from "@/components/icons/plus";
import { getDayName } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { Workout } from "@/types/calendar";
import { ExerciseCardAddButton, ExerciseList, ExerciseRoot } from "../exercise";

export type CalendarRootContext = {
  day: Date;
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
};

const CalendarContext = createContext<CalendarRootContext>({
  day: new Date(),
  workouts: [],
  setWorkouts: () => {},
});

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarRoot");
  }
  return context;
};

type CalendarRootProps = {
  day: Date;
  workouts: Workout[];
} & ComponentProps<ElementType>;

const CalendarRoot = ({ day, workouts, children }: CalendarRootProps) => {
  const [workoutsState, setWorkoutsState] = useState<Workout[]>(workouts);

  const value: CalendarRootContext = {
    day,
    workouts: workoutsState,
    setWorkouts: setWorkoutsState,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

type CalendarCardProps = {
  as: ElementType;
  children: React.ReactNode;
} & ComponentProps<ElementType>;

const CalendarCard = ({
  as = "div",
  children,
  className,
  ...props
}: CalendarCardProps) => {
  const Component = as || "div";
  return (
    <Component className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </Component>
  );
};

type CalendarHeaderProps = {
  as: ElementType;
} & ComponentProps<ElementType>;

const CalendarHeader = ({
  as = "h2",
  children,
  className,
  ...props
}: CalendarHeaderProps) => {
  const { day } = useCalendar();
  const Component = as;
  return (
    <Component
      className={cn(
        "text-slate-light text-sm font-semibold text-sm uppercase",
        className,
      )}
      {...props}
    >
      {children ?? getDayName(day)}
    </Component>
  );
};

type CalendarContentProps = {
  as: ElementType;
} & ComponentProps<ElementType>;

const CalendarContent = ({
  as,
  children,
  className,
  ...props
}: CalendarContentProps) => {
  const Component = as || "div";
  return (
    <Component
      className={cn(
        "rounded-[6px] bg-gray-light h-full p-4 space-y-2",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

type CalendarDayNumberProps = {
  as: ElementType;
} & ComponentProps<ElementType>;

const CalendarDayNumber = ({
  as = "div",
  children,
  className,
  ...props
}: CalendarDayNumberProps) => {
  const Component = as || "div";
  const { day } = useCalendar();
  const dayNum = day.getDate();
  const dateNumber = String(dayNum).padStart(2, "0");
  const currentDay = new Date().getDate();

  return (
    <Component
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      <span
        className={cn(
          "text-slate-light text-base font-bold",
          dayNum === currentDay && "text-purple-light",
        )}
      >
        {dateNumber}
      </span>
      {children}
    </Component>
  );
};

const CalendarAddWorkoutButton: FC<ComponentProps<"button">> = ({
  className,
  ...props
}) => {
  const { workouts, setWorkouts, day } = useCalendar();

  const handleAddWorkout = () => {
    setWorkouts([
      ...workouts,
      {
        id: Math.random().toString(36).substring(2, 15),
        name: "Workout " + Math.random().toString(36).substring(2, 15),
        exercises: [],
      },
    ]);
  };

  const title = `Add workout to ${getDayName(day, "long")}`;

  return (
    <button
      className={cn("hover:cursor-pointer inline-flex justify-end", className)}
      onClick={handleAddWorkout}
      aria-label={title}
      title={title}
      {...props}
    >
      <Plus />
    </button>
  );
};

const CalendarWorkout = () => {
  const { workouts } = useCalendar();
  if (workouts.length === 0) {
    return <div>No workouts for this day.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="rounded-[6px] border border-gray-border-light/15 pt-2 px-2 bg-white flex flex-col gap-2"
        >
          <div className="text-purple-light text-sm font-semibold uppercase line-clamp-1">
            {workout.name}
          </div>

          <div className="py-1 flex flex-col items-end gap-2">
            <ExerciseRoot exercises={workout.exercises}>
              <ExerciseList />
              <ExerciseCardAddButton className="w-max" />
            </ExerciseRoot>
          </div>
        </div>
      ))}
    </div>
  );
};

export {
  CalendarCard,
  CalendarContent,
  CalendarHeader,
  CalendarRoot,
  CalendarDayNumber,
  CalendarWorkout,
  CalendarAddWorkoutButton,
};
