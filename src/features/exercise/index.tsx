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

import Plus from "@/components/icons/plus";
import { cn } from "@/lib/utils";
import { Exercise } from "@/types/calendar";
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

type ExerciseRootContext = {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  onExercisesChange?: (exercises: Exercise[]) => void;
};

const ExerciseContext = createContext<ExerciseRootContext>({
  exercises: [],
  setExercises: () => {},
  onExercisesChange: undefined,
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
  onExercisesChange?: (exercises: Exercise[]) => void;
} & ComponentProps<ElementType>;

const ExerciseRoot: FC<ExerciseRootProps> = ({
  exercises,
  onExercisesChange,
  children,
}) => {
  const [exercisesState, setExercisesState] = useState<Exercise[]>(exercises);

  const setExercises = useCallback(
    (next: Exercise[] | ((prev: Exercise[]) => Exercise[])) => {
      setExercisesState((prev) => {
        const nextList = typeof next === "function" ? next(prev) : next;
        onExercisesChange?.(nextList);
        return nextList;
      });
    },
    [onExercisesChange],
  );

  const value: ExerciseRootContext = {
    exercises: exercisesState,
    setExercises,
    onExercisesChange,
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

const ExerciseCard: FC<{ exercise: Exercise }> = ({ exercise }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border rounded-[6px] border-gray-border-light/15 p-2 pb-2 hover:bg-gray-light",
        isDragging && "opacity-50 shadow-md z-10",
      )}
      {...attributes}
    >
      <div
        className="flex items-center gap-1 cursor-grab active:cursor-grabbing touch-none"
        {...listeners}
      >
        <div className="flex-1 min-w-0">
          <ExerciseCardHeader as="h3">{exercise.name}</ExerciseCardHeader>
          <ExerciseCardContent>
            <div className="font-semibold text-xs">{exercise.setCount}x</div>
            <div className="text-slate-light text-xs font-light line-clamp-1">
              {exercise.setInfo.join(", ")}
            </div>
          </ExerciseCardContent>
        </div>
      </div>
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

type ExerciseListEmptyProps = {
  empty?: React.ReactNode;
} & ComponentProps<"div">;

const ExerciseList: FC<ExerciseListEmptyProps> = ({
  empty,
  className,
  ...props
}) => {
  const { exercises, setExercises } = useExercise();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = exercises.findIndex((e) => e.id === active.id);
      const newIndex = exercises.findIndex((e) => e.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      setExercises(arrayMove(exercises, oldIndex, newIndex));
    },
    [exercises, setExercises],
  );

  if (exercises.length === 0) {
    return empty ?? <ExerciseListEmpty />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={exercises.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("flex flex-col gap-2", className)} {...props}>
          {exercises.map((exercise) => (
            <ExerciseCard exercise={exercise} key={exercise.id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

const ExerciseListEmpty = () => {
  return <div className="text-xs">No exercises for this workout.</div>;
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
