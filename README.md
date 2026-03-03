# EVERFIT - Frontend Test

Author: Em Ha Tuan

Final result: [fit-test-ten.vercel.app](https://fit-test-ten.vercel.app/)

Screenshot: [Fit test result](./result.png)

## Implementation details

- Implemented the UI/UX of the current screen based on [Figma](https://www.figma.com/design/fMnZaKJoQuZEGHjkhC1djs/Everfit---FE?node-id=4745-297&t=kjYWTi2UAocE5vk7-0).
- Display one week of day containers (Monday to Sunday).
- Used RSC to mock user data.
- **Workout container:** name and list of exercises; users can drag and drop and add new workouts.
- **Exercise container:** list of exercises; users can drag and drop and add new exercises.
- Used Tailwind CSS and the `cn` utility to make styling faster and more effective than writing CSS line by line.

## UI/UX notes

- There is no form implemented for adding or updating workout or exercise data. Figma does not provide the UI/UX for this. We can implement it in `ExerciseCard` or `SortableWorkoutItem` when the Figma design is ready.
- The Figma design only supports the desktop screen. If the plan is to support desktop only, that is fine. We can use an eager-loading pattern for handling data on the loading screen. On mobile it is a different story: lazy-loading would need more attention to avoid high cost. Providing a mobile wireframe would help define the structure and ensure everything is aligned before future changes.
- The Figma file does not include a design system to define CSS variables.

### Testing

- There are no unit tests or e2e tests in this project; there was not enough time to add them.
- Smoke tested locally and in production (Vercel).

## Deployment

- For this test, only the `main` branch was used for development and deployment. In a real project, this should never be done.
- Chunk-based splitting is the recommended approach for shipping the application with multiple versions.
