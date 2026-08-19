import {Head} from "@/components/Head";
import {AuthPanel} from "@/components/forms/AuthPanel";

interface Feature {
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    title: "Track your progress",
    description:
      "Move songs through Want to Learn, Learning, and Learned as you work on them.",
  },
  {
    title: "Capture the details",
    description:
      "Save capo position and your own difficulty rating for every song.",
  },
  {
    title: "Set goals",
    description:
      "Aim to learn a set number of songs each month or year, and track your progress.",
  },
];

export function LandingPage() {
  return (
    <div className="flex grow flex-col md:flex-row">
      <Head title="SongTracker — Track the songs you're learning on guitar"/>

      <div className="flex flex-col justify-center gap-y-8 p-6 sm:p-10 md:w-1/2 md:p-16">
        <div>
          <h1 className="font-bold text-3xl">SongTracker</h1>
          <p className="mt-2 text-slate-400">
            Track every song you're learning to play on guitar.
          </p>
        </div>

        <ul className="flex flex-col gap-y-6">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <p className="font-medium">{feature.title}</p>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center bg-slate-900 p-6 sm:p-10 md:w-1/2 md:items-center md:p-16">
        <div className="w-full md:max-w-md">
          <AuthPanel/>
        </div>
      </div>
    </div>
  );
}