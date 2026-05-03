import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Prop<T> = {
  tableHeader: string[];
  tableData: T[];
  pageInfo: { PageNumber: number; PageSize: number };
  onDelete: (id: number) => void;
  onEdit: (data: T) => void;
  onNext: () => void;
  onPrev: () => void;
};

function getStatusStyle(value: string) {
  const status = value.toLowerCase();
  switch (status) {
    case "active":
    case "completed":
      return {
        style: "bg-success/10 text-ok border border-success/20",
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
    case "inactive":
    case "pending":
      return {
        style: "bg-warning/10 text-warn border border-warning/20",
        label: status.charAt(0).toUpperCase() + status.slice(1),
      };
    case "inprogress":
      return {
        style: "bg-primary/10 text-main border border-primary/20",
        label: "In Progress",
      };
    default:
      return { style: "bg-muted text-sub border border-border", label: value };
  }
}

function formatValue(key: string, value: string) {
  if (key === "createdAt" || key === "date") {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return value;
}

function Table<T extends Record<string, unknown> & { id: number }>({
                                                                     tableHeader,
                                                                     tableData,
                                                                     pageInfo = { PageNumber: 1, PageSize: 10 },
                                                                     onDelete,
                                                                     onEdit,
                                                                     onNext,
                                                                     onPrev,
                                                                   }: Prop<T>) {
  return (
      <div className="card flex flex-col overflow-hidden min-h-87.5">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="table-header">
            <tr>
              {tableHeader.map((h, i) => (
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-sub" key={i}>
                    {h}
                  </th>
              ))}
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-sub text-center">
                Action
              </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
            {tableData?.map((row, i) => (
                <tr key={row.id || i} className="table-row group">
                  {Object.entries(row).map(([key, cell], j) => {
                    const status = getStatusStyle(String(cell));
                    const value = formatValue(key, String(cell));

                    if (key === "id") return null;

                    return (
                        <td key={j} className="px-6 py-4 text-sm font-medium">
                          {key === "status" ? (
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tighter ${status?.style}`}>
                          {status?.label}
                        </span>
                          ) : (
                              <span className="text-foreground/90">{value}</span>
                          )}
                        </td>
                    );
                  })}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                          onClick={() => onEdit(row)}
                          className="text-xs font-bold text-main hover:underline transition-all"
                      >
                        Edit
                      </button>
                      <button
                          onClick={() => onDelete(row.id)}
                          className="text-xs font-bold text-danger/80 hover:text-danger transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
          {tableData?.length < 3 && <div className="flex-1" />}
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-between items-center mt-auto">
          <div className="text-xs font-bold text-sub">
            PAGE <span className="text-main">{pageInfo.PageNumber}</span> OF <span className="text-main">{pageInfo.PageSize}</span>
          </div>

          <div className="flex gap-3">
            <button
                onClick={onPrev}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-sub hover:border-primary hover:text-main transition-all disabled:opacity-30"
                disabled={pageInfo.PageNumber === 1}
            >
              <FontAwesomeIcon icon={faArrowLeft} size="xs" />
            </button>
            <button
                onClick={onNext}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-sub hover:border-primary hover:text-main transition-all"
            >
              <FontAwesomeIcon icon={faArrowRight} size="xs" />
            </button>
          </div>
        </div>
      </div>
  );
}

export default Table;