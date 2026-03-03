import Calendar from "./components/calendar";

export default function Home() {
  const userId = "123";

  return (
    <div className="p-10 h-dvh">
      <Calendar userId={userId} />
    </div>
  );
}
