const TYPE_EMOJIS = {
  sightseeing: "\uD83D\uDDFA\uFE0F",
  food: "\uD83C\uDF5C",
  adventure: "\uD83E\uDDD7",
  shopping: "\uD83D\uDECD\uFE0F",
};

function formatDate(d) {
  if (!d) return "";
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(t) {
  if (!t) return "";
  if (typeof t === "string") return t;
  const date = t.toDate ? t.toDate() : new Date(t);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function StopDay({ stop, activities, isReadOnly }) {
  return (
    <div className="relative pl-10 pb-8">
      <div className="absolute left-[15px] top-2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card shadow-sm z-10" />
      <div className="absolute left-[19px] top-4 bottom-0 w-0.5 bg-gray-200" />
      <div>
        <div className="mb-3">
          <p className="text-xs font-medium text-primary">{formatDate(stop.date || stop.startDate)}</p>
          <h3 className="font-semibold text-secondary">
            {stop.cityName || "Unknown City"}
            {stop.country && <span className="text-gray-400 font-normal">, {stop.country}</span>}
          </h3>
        </div>
        {activities && activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 bg-bg/50 rounded-xl p-3 border border-gray-100"
              >
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {TYPE_EMOJIS[act.type] || "\uD83D\uDCCC"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary">{act.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    {act.time && <span>{formatTime(act.time)}</span>}
                    {act.duration && <span>{act.duration} hrs</span>}
                    {act.cost != null && <span>₹{act.cost}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No activities planned</p>
        )}
      </div>
    </div>
  );
}

export default function ItineraryTimeline({ stops = [], activities = {}, isReadOnly = false }) {
  if (!stops || stops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No stops in this trip yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {stops.map((stop, idx) => (
        <StopDay
          key={stop.id}
          stop={stop}
          activities={activities[stop.id] || []}
          isReadOnly={isReadOnly}
        />
      ))}
      <div className="flex items-center gap-2 pl-10 pb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        <span className="text-xs text-gray-400">End of trip</span>
      </div>
    </div>
  );
}
