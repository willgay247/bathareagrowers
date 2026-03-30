import { Link } from "react-router-dom";

const DAYS = [
  { day: "Monday", sessions: ["Greenlinks at Monksdale Road allotments (12:30–3:30pm)"] },
  { day: "Tuesday", sessions: ["Bath Organic Group (10am–1pm)", "Timebank Feelgood Walks (12:30–1:30pm)"] },
  { day: "Wednesday", sessions: ["The Community Farm (Summer only)", "Timebank Food Coop (alternate weeks)"] },
  { day: "Thursday", sessions: ["Dry Arch (10:30am–2pm, email to check)", "Timebank Plus Gardening Team (10am–12pm)"] },
  { day: "Friday", sessions: ["Donkey Lane (winter 10:30am, Ring 335813 to confirm)"] },
  { day: "Saturday", sessions: ["Bath Organic Group (10am–1pm)", "Dry Arch (10:30am–2pm)", "Alice Park summer (May-Oct 6–7pm)"] },
  { day: "Sunday", sessions: ["Alice Park (summer 10–12, winter 11–1)", "The Community Farm (10am–4pm)", "Donkey Lane summer (5pm)"] },
];

const CalendarPage = () => (
  <main>
    <section className="flex h-[40vh] md:h-[60vh] w-full items-center justify-center bg-background px-4">
      <h1 className="text-center text-[28px] font-bold text-foreground md:text-[48px]">Calendar</h1>
    </section>

    <section className="w-full bg-background py-10 px-4">
      <p className="mx-auto max-w-[800px] text-center text-[18px] leading-relaxed text-foreground">
        These are the regular work sessions of some of the projects that grow fruit and veg. For one-off volunteering or other events, please see our <Link to="/events" className="text-accent font-semibold underline">Events page</Link>.
      </p>
    </section>

    <section className="w-full bg-white py-[60px] px-4">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-[28px] font-bold text-foreground mb-8">Volunteering timetable, Summer 2023</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-[14px]">
            <thead>
              <tr>
                {DAYS.map((d) => (
                  <th key={d.day} className="bg-accent px-4 py-3 text-left text-foreground-alt font-semibold">{d.day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {DAYS.map((d) => (
                  <td key={d.day} className="border border-background px-4 py-3 align-top text-foreground">
                    {d.sessions.map((s, i) => (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>{s}</p>
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
);

export default CalendarPage;
