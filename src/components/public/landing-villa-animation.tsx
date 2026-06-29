import { Activity, CalendarCheck2, ConciergeBell, CreditCard } from "lucide-react";

const orbitItems = [
  { label: "Availability", icon: CalendarCheck2, className: "top-4 left-6" },
  { label: "Concierge", icon: ConciergeBell, className: "right-4 top-24" },
  { label: "Payments", icon: CreditCard, className: "bottom-10 left-10" },
  { label: "IoT ready", icon: Activity, className: "bottom-4 right-12" },
];

export function LandingVillaAnimation() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px]"
      aria-label="Animated 3D villa operation model"
      role="img"
    >
      <div className="absolute inset-8 rounded-full bg-white/10 blur-2xl" />
      <div className="villa-scene absolute inset-0">
        <div className="villa-stage">
          <div className="villa-shadow" />
          <div className="villa-platform">
            <div className="pool-water">
              <span />
              <span />
            </div>
            <div className="villa-house">
              <div className="villa-roof" />
              <div className="villa-wall">
                <span className="villa-door" />
                <span className="villa-window villa-window-left" />
                <span className="villa-window villa-window-right" />
              </div>
            </div>
            <div className="villa-palms">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>

      {orbitItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            className={`absolute ${item.className} rounded-lg border border-white/15 bg-stone-950/70 px-3 py-2 text-xs font-semibold text-white shadow-2xl shadow-stone-950/30 backdrop-blur`}
            key={item.label}
          >
            <span className="flex items-center gap-2">
              <Icon className="size-3.5 text-cyan-200" aria-hidden="true" />
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
