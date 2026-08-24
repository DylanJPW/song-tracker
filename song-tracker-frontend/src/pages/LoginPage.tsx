import { AuthPanel } from "@/components/forms/AuthPanel";

export function LoginPage() {
  return (
    <div className="flex grow justify-center">
      <div className="self-center px-10 py-6 md:bg-slate-900 md:w-lg md:rounded-2xl">
        <AuthPanel />
      </div>
    </div>
  );
}
