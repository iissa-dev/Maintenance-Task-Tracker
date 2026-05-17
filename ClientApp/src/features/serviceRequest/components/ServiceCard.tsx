import { useState } from "react";
import ServiceHandled from "./HandleServiceRequest";
import type { ServiceRequestResponseDto } from "../../../types";
import { usePopup } from "../../../components/Popup";
import { useAuth } from "../../../hooks/useAuth";
import {
  useDeleteServiceReqeust,
  useServices,
} from "../api/serviceRequest.mutation";
import { useCategory } from "../../categories/api/category.mutaions.ts";
import HandleRequest from "../../requests/components/HandleRequest.tsx";
import { LoadingScreen } from "../../../utils/LoadingScreen.tsx";
import { PopupType } from "../../../types/popup.types.ts";
import {
  ChevronLeft,
  ChevronRight,
  DollarSign,
  LayersPlus,
  Tag,
  Trash2,
} from "lucide-react";

function ServiceCard() {
  const pageSize = 6;
  const { confirm, alert, Modal } = usePopup();
  const [pageNumber, setPageNumber] = useState(1);
  const { authToken } = useAuth();
  const role = authToken?.role;
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceRequestResponseDto | null>(null);
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);

  const { services, totalPages, isLoading, isFetching } = useServices({
    pageNumber,
    pageSize,
    categoryId,
  });

  const categories = useCategory();

  const deleteMutation = useDeleteServiceReqeust({ alert });

  if (isLoading) {
    return <LoadingScreen />;
  }
  const goNext = () => {
    if (!isFetching && pageNumber < totalPages)
      setPageNumber((prev) => prev + 1);
  };

  const handleDelete = async (id: number) => {
    const ok = await confirm(
      "Are you sure you want to delete this Service? ",
      "Delete",
      PopupType.WARNING,
    );
    if (!ok) return;

    deleteMutation.mutateAsync(id);
  };

  return (
    <>
      {selectedService && (
        <ServiceHandled
          onClose={() => setIsOpenForm(false)}
          isOpen={isOpenForm}
          Mode="Edit"
          data={selectedService}
        />
      )}

      <HandleRequest
        Mode={"Add"}
        isOpen={isRequestFormOpen}
        onClose={() => setIsRequestFormOpen(false)}
        serviceId={selectedService?.serviceId}
        categoryId={selectedService?.categoryDto.id}
      />

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-card/50 p-4 rounded-2xl border border-border">
          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
            <label
              htmlFor="category"
              className="text-sm font-bold text-sub uppercase tracking-widest whitespace-nowrap"
            >
              Categories
            </label>
            <select
              className="bg-background border border-border text-foreground text-sm rounded-xl px-4 py-2 outline-none focus:border-primary/50 transition-all w-full md:w-48"
              id="category"
              onChange={(e) => {
                const value = Number(e.target.value);
                setCategoryId(value === 0 ? null : value);
              }}
              value={categoryId ?? 0}
            >
              <option value={0} className="bg-background">
                All
              </option>
              {categories &&
                categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-background"
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              className="btn-ghost p-2 rounded-xl border border-border hover:bg-muted transition-all"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              className="btn-ghost p-2 rounded-xl border border-border hover:bg-muted transition-all"
              disabled={isFetching || pageNumber === totalPages}
              onClick={goNext}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services &&
            services.map((service) => (
              <div
                key={service.serviceId}
                className="group bg-card border border-border rounded-2xl p-4 
            hover:border-primary/40 transition-all duration-300 shadow-sm flex flex-col justify-between"
              >
                <span className="flex items-center mb-4 gap-1.5 text-[10px] font-black uppercase tracking-wider text-sub/60">
                  <Tag size={12} /> {service.categoryDto.name}
                </span>
                <h3 className="text-xl mb-4 font-bold text-foreground group-hover:text-main transition-colors">
                  {service.name}
                </h3>
                <p className="text-sub mb-4 text-sm line-clamp-2">
                  {service.description}
                </p>
                <p className="flex items-center text-[14px] text-sub/80 pb-3">
                  <span className="mr-2">Price: </span>
                  {service.price}<DollarSign size={10}/>
                </p>
              
                <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                  {role === "Admin" ? (
                    <>
                      <button
                        className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-all"
                        onClick={() => {
                          setSelectedService(service);
                          setIsOpenForm(true);
                        }}
                      >
                        <LayersPlus size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(service.serviceId)}
                        className="p-2 text-danger hover:bg-danger/5 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : role === "Client" ? (
                    <input
                      className="text-[14px] btn-secondary cursor-pointer"
                      type="button"
                      value="Request"
                      onClick={() => {
                        setSelectedService(service);
                        setIsRequestFormOpen(true);
                      }}
                    />
                  ) : ""}
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal />
    </>
  );
}

export default ServiceCard;
