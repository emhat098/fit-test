import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";

import {
  CalendarAddWorkoutButton,
  CalendarCard,
  CalendarContent,
  CalendarDayNumber,
  CalendarHeader,
  CalendarRoot,
  CalendarWorkout,
} from "@/features/calendar";
import { getCurrentWeekDays } from "@/lib/calendar";

/**
 * Mock function to get the week schedule for a user.
 * Assumes this function is get userid and current date and returns the week schedule for that date.
 */
const getWeekSchedule = cache(async (userId: string, currentDate: Date) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const weekSchedule = getCurrentWeekDays(currentDate);

  // Random data empty for day is a random number of workouts between 0 and 3.
  return weekSchedule.map((day) => {
    if (day.getDate() % 2 === 0) {
      return {
        day,
        workouts: [],
      };
    }

    return {
      day,
      workouts: [
        {
          id: "1",
          name: "Chest Day - with Arm exercises",
          exercises: [
            {
              id: "1",
              name: "Bench Press Medium Grip",
              setInfo: ["50 lb x 5", "60 lb x 5", "70 lb x 5"],
              setCount: 5,
            },
            {
              id: "2",
              name: "Incline Bench Press",
              setInfo: ["60 lb x 5", "70 lb x 5", "80 lb x 5"],
              setCount: 3,
            },
          ],
        },
      ],
    };
  });
});

const Calendar = async ({ userId }: { userId: string }) => {
  "use cache";
  cacheLife("weeks");
  cacheTag("calendar");

  const weekScheduleData = await getWeekSchedule(userId, new Date());

  const dayKey = (day: Date) =>
    `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;

  return (
    <div className="grid grid-cols-7 gap-4 h-full">
      {weekScheduleData.map((c) => (
        <CalendarRoot day={c.day} workouts={c.workouts} key={dayKey(c.day)}>
          <CalendarCard>
            <CalendarHeader />
            <CalendarContent>
              <CalendarDayNumber>
                <CalendarAddWorkoutButton />
              </CalendarDayNumber>

              <CalendarWorkout />
            </CalendarContent>
          </CalendarCard>
        </CalendarRoot>
      ))}
    </div>
  );
};

export default Calendar;
