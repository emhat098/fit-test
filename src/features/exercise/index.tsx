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
import { cn } from "@/lib/utils";
import { Exercise } from "@/types/calendar";

type ExerciseRootContext = {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
};

const ExerciseContext = createContext<ExerciseRootContext>({
  exercises: [],
  setExercises: () => {},
});

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error("useExercise must be used within a ExerciseRoot");
  }
  return context;
};

type ExerciseRootProps = {
  exercises: Exercise[];
} & ComponentProps<ElementType>;

const ExerciseRoot: FC<ExerciseRootProps> = ({ exercises, children }) => {
  const [exercisesState, setExercisesState] = useState<Exercise[]>(exercises);

  const value: ExerciseRootContext = {
    exercises: exercisesState,
    setExercises: setExercisesState,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

const ExerciseCard: FC<{ exercise: Exercise }> = ({ exercise }) => {
  return (
    <div className="border rounded-[6px] border-gray-border-light/15 p-2 pb-2">
      <ExerciseCardHeader as="h3">{exercise.name}</ExerciseCardHeader>
      <ExerciseCardContent>
        <div className="font-semibold text-xs">{exercise.setCount}x</div>
        <div className="text-slate-light text-xs font-light line-clamp-1">
          {exercise.setInfo.join(", ")}
        </div>
      </ExerciseCardContent>
    </div>
  );
};

type ExerciseCardContentProps = ComponentProps<"div">;

const ExerciseCardContent = ({
  className,
  children,
  ...props
}: ExerciseCardContentProps) => {
  return (
    <div
      className={cn("flex flex-row justify-between gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type ExerciseCardHeaderProps = {
  as: ElementType;
} & ComponentProps<ElementType>;

const ExerciseCardHeader = ({
  as = "div",
  children,
  className,
  ...props
}: ExerciseCardHeaderProps) => {
  const Component = as;

  return (
    <Component
      className={cn(
        "line-clamp-1 align-right font-semibold text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

const ExerciseList = () => {
  const { exercises } = useExercise();

  if (exercises.length === 0) {
    return <div>No exercises for this workout.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {exercises.map((exercise) => (
        <ExerciseCard exercise={exercise} key={exercise.id} />
      ))}
    </div>
  );
};

const ExerciseCardAddButton = ({
  className,
  ...props
}: ComponentProps<"button">) => {
  const { exercises, setExercises } = useExercise();

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Math.random().toString(36).substring(2, 15),
        name: "Exercise " + Math.random().toString(36).substring(2, 15),
        setCount: 3,
        setInfo: ["10lb x 5", "15lb x 5", "20lb x 5"],
      },
    ]);
  };

  const title = "Add exercise to workout";

  return (
    <button
      className={cn("hover:cursor-pointer inline-flex justify-end", className)}
      onClick={handleAddExercise}
      aria-label={title}
      title={title}
      {...props}
    >
      <Plus />
    </button>
  );
};

export { ExerciseRoot, ExerciseCard, ExerciseList, ExerciseCardAddButton };
