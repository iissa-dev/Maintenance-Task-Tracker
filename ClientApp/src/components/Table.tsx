import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThreeDot } from "react-loading-indicators";
type Prop<T> = {
  tableHeader: string[];
  tableData: T[];
  pageInfo: { PageNumber: number; PageSize: number };
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (data: T) => void;
  onReload: () => void;
  onNext: () => void;
  onPrev: () => void;
};

function getStatusStyle(value: string) {
  const status = value.toLowerCase();
  switch (status) {
    case "active":
      return {
        style: "bg-success/10 text-success border border-success/30",
        label: "Active",
      };
    case "inactive":
      return {
        style: "bg-warning/10  text-warning  border border-warning/30",
        label: "Inactive",
      };
    case "pending":
      return {
        style: "bg-warning/10  text-warning  border border-warning/30",
        label: "Pending",
      };
    case "inprogress":
      return {
        style: "bg-primary/10  text-primary  border border-primary/30",
        label: "InProgress",
      };
    case "completed":
      return {
        style: "bg-success/10  text-success  border border-success/30",
        label: "Completed",
      };
  }
}

function formatValue(key: string, value: string) {
  if (key === "createdAt") {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  }
  return value;
}

function Table<T extends Record<string, unknown> & { id: number }>({
  tableHeader,
  tableData,
  pageInfo = { PageNumber: 1, PageSize: 10 },
  loading = false,
  onDelete,
  onEdit,
  // onReload,
  onNext,
  onPrev,
}: Prop<T>) {
  return (
    <>
      {loading ? (
        <div className="fixed top-[50%] left-[50%] -translate-[50%_50%]">
          <ThreeDot
            variant="bounce"
            color="#239c8c"
            size="medium"
            text="lOADING"
            textColor="#0d8988"
          />
        </div>
      ) : (
        <div className="responsive-table rounded-md p-2.5 overflow-auto mt-7.5 neon-border h-fit">
          <table className="w-full mt-2.5 min-w-250">
            <thead className="text-nowrap table-header">
              <tr>
                {tableHeader.map((h, i: number) => (
                  <th className="p-2.5" key={i}>
                    {h}
                  </th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center ">
              {tableData.map((row, i) => (
                <tr key={i} className="table-row p-5">
                  {Object.entries(row).map(([key, cell], j) => {
                    const status = getStatusStyle(String(cell));
                    const value = formatValue(key, String(cell));
                    return (
                      <td key={j}>
                        {key === "status" ? (
                          <span
                            className={`p-[6px_12px] rounded-[20px] font-bold ${status?.style}`}
                          >
                            {status?.label}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                  <td className="flex items-center justify-center gap-1.25 p-5">
                    <span
                      onClick={() => onDelete(row.id)}
                      className="btn-danger p-[6px_12px] rounded-m font-bold cursor-pointer select-none"
                    >
                      Delete
                    </span>
                    <span
                      onClick={() => onEdit(row)}
                      className="btn-primary p-[6px_12px] rounded-md font-bold cursor-pointer select-none"
                    >
                      Edit
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 flex justify-between items-center ">
            <div className="btn-primary p-1  rounded-md">
              <span>{pageInfo.PageNumber}</span> /{" "}
              <span>{pageInfo.PageSize}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onPrev}
                className="cursor-pointer p-2 btn-primary w-10 h-10 rounded-full"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="text-lg font-bold"
                />
              </button>
              <button className="cursor-pointer p-2  w-10 h-10 btn-primary rounded-full">
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-lg font-bold"
                  onClick={onNext}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
