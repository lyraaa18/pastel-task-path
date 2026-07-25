import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useProfile, resetAllStores } from "@/lib/store";
import { resetDbFn } from "@/lib/dbServer";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Student OS" },
      { name: "description", content: "Edit your profile." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [profile, setProfile] = useProfile();

  return (
    <MobileShell>
      <header className="px-6 pt-10 pb-4">
        <h1 className="font-serif text-3xl italic">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Personalize your Student ID.</p>
      </header>

      <section className="px-6 mt-4 space-y-4">
        {(["name", "school", "birthday", "yearLevel"] as const).map((k) => (
          <div key={k}>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">{k}</label>
            <input
              value={profile[k]}
              onChange={(e) => setProfile({ ...profile, [k]: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-border bg-card outline-none text-sm"
            />
          </div>
        ))}
        <button
          onClick={async () => {
            if (confirm("Reset all app data (including Neon Database)?")) {
              const secret = prompt("Please enter the Reset DB Secret to confirm (leave blank if none is configured):") ?? "";
              try {
                const res = await resetDbFn({ data: { secret } });
                if (res && res.success) {
                  localStorage.clear();
                  resetAllStores();
                  location.reload();
                } else {
                  alert("Failed to reset database.");
                }
              } catch (err) {
                console.error(err);
                alert("Failed to reset database. Make sure your secret is correct.");
              }
            }
          }}
          className="mt-6 w-full py-3 rounded-xl border border-destructive/40 text-destructive text-sm font-semibold"
        >
          Reset all data
        </button>
      </section>
    </MobileShell>
  );
}
