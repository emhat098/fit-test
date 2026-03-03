"use client";

import {
  ComponentProps,
  ElementType,
  FC,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import Ellipse from "@/components/icons/ellipse";
import Plus from "@/components/icons/plus";
import { getDayName } from "@/lib/calendar";
import { cn } from "@/lib/utils";
import { Workout } from "@/types/calendar";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

const SortableWorkoutItem: FC<{ workout: Workout }> = ({ workout }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workout.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const { setWorkouts, workouts } = useCalendar();
  const handleExercisesChange = useCallback(
    (exercises: Workout["exercises"]) => {
      setWorkouts(
        workouts.map((w) => (w.id === workout.id ? { ...w, exercises } : w)),
      );
    },
    [workout.id, workouts, setWorkouts],
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-[6px] border border-gray-border-light/15 pt-2 px-2 bg-white flex flex-col gap-2",
        isDragging && "opacity-50 shadow-md z-10",
      )}
      {...attributes}
    >
      <div
        className="flex items-center gap-1 cursor-grab active:cursor-grabbing min-h-[28px]"
        {...listeners}
      >
        <div className="text-purple-light text-sm font-semibold uppercase line-clamp-1 flex-1 min-w-0">
          {workout.name}
        </div>
        <span className="text-gray-400 select-none" aria-hidden>
          <Ellipse />
        </span>
      </div>

      <div className="py-1 flex flex-col gap-2 pb-2">
        <ExerciseRoot
          exercises={workout.exercises}
          onExercisesChange={handleExercisesChange}
        >
          <ExerciseList />
          <div className="flex justify-end">
            <ExerciseCardAddButton className="w-max" />
          </div>
        </ExerciseRoot>
      </div>
    </div>
  );
};

const CalendarWorkout = () => {
  const { workouts, setWorkouts } = useCalendar();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleWorkoutDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = workouts.findIndex((w) => w.id === active.id);
      const newIndex = workouts.findIndex((w) => w.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      setWorkouts(arrayMove(workouts, oldIndex, newIndex));
    },
    [workouts, setWorkouts],
  );

  if (workouts.length === 0) {
    return <div className="text-xs">No workouts for this day.</div>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleWorkoutDragEnd}
    >
      <SortableContext
        items={workouts.map((w) => w.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {workouts.map((workout) => (
            <SortableWorkoutItem key={workout.id} workout={workout} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
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
