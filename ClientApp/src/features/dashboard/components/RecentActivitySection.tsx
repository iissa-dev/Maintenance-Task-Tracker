import { Clock, PlayCircle } from "lucide-react";
import { useRecentRequest } from "../api/dashboard.mutations";

const RecentActivitySection = () => {
  const { recentRequest } = useRecentRequest();
  return (
    <div className="card p-4 md:p-6">
      <h3 className="font-bold text-main text-lg mb-8 flex items-center gap-2">
        <Clock size={20} className="text-primary" />
        Recent Activity
      </h3>
      <div className="space-y-8">
        {recentRequest?.length > 0 ? (
          recentRequest?.map((req) => (
            <div key={req.id} className="flex items-start gap-4 group">
              <div
                className={`p-2.5 rounded-xl transition-colors ${
                  req.status === "Pending"
                    ? "bg-warning/10 text-warning"
                    : req.status === "InProgress"
                      ? "bg-primary/10 text-primary"
                      : "bg-success/10 text-success"
                }`}
              >
                {req.status === "Pending" ? (
                  <Clock size={18} />
                ) : (
                  <PlayCircle size={18} />
                )}
              </div>

              <div className="flex flex-col flex-1 border-b border-border/50 pb-4 group-last:border-none">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-foreground">
                    {req.customerName}
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-muted text-sub border border-border">
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-sub line-clamp-1 italic">
                  "{req.description}"
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sub py-10">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivitySection;
