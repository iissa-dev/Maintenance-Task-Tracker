import { useQuery } from "@tanstack/react-query";
import { serviceRequestService } from "../../../services/serviceRequestService";
import { useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { categoryService } from "../../../services/categoryService";
import ServiceHandled from "./HandleServiceRequest";
import type { RequestDto, ServiceRequestResponseDto } from "../../../types";
import { PopupType, usePopup } from "../../../components/Popup";
import { useAuth } from "../../../hooks/useAuth";
import { useDeleteServiceReqeust } from "../api/serviceRequest.mutation";
import { useAddRequest } from "../../requests/api/request.mutations";

function ServiceCard() {
  const pageSize = 6;
  const { confirm, alert, Modal } = usePopup();
  const [pageNumber, setPageNumber] = useState(1);
  const { authToken } = useAuth();
  const role = authToken?.role;
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ServiceRequestResponseDto>();
  const { data, isLoading, isFetching } = useQuery({
    queryFn: () =>
      serviceRequestService.services({ pageNumber, pageSize, categoryId }),
    queryKey: ["services", categoryId, pageNumber],
  });
  const totalPages = data?.data?.totalPages ?? 1;

  const { data: categoriesData } = useQuery({
    queryFn: () => categoryService.getAll(),
    queryKey: ["categories"],
  });
  const services: ServiceRequestResponseDto[] = data?.data?.items ?? [];
  const categories = categoriesData?.data;

  const deleteMutaion = useDeleteServiceReqeust(alert);

  const addRequestMutation = useAddRequest(alert);
  if (isLoading) {
    return (
      <div className="fixed top-[50%] left-[50%] -translate-[50%]">
        <ThreeDot
          variant="bounce"
          color="#239c8c"
          size="medium"
          text="LOADING"
          textColor="#0d8988"
        />
      </div>
    );
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

    deleteMutaion.mutate(id);
  };

  const handleRequestService = async (service: RequestDto) => {
    const ok = await confirm(
      "Are you sure you want to request this service?",
      "Confirm Request",
      PopupType.INFO,
    );
    if (!ok) return;

    await addRequestMutation.mutateAsync({
      description: service.description,
      categoryId: service.categoryId,
      serviceRequestId: service.serviceRequestId,
    });
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
      <div>
        <div className="mb-10 flex justify-between items-center">
          <div>
            <label htmlFor="category">Categories</label>
            <select
              className="ml-3"
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
          <div className="flex gap-2.5">
            <input
              className="btn-ghost cursor-pointer"
              type="button"
              value="Prev"
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            />
            <input
              className="btn-ghost cursor-pointer"
              type="button"
              value="Next"
              disabled={isFetching || pageNumber === totalPages}
              onClick={goNext}
            />
          </div>
        </div>
        <div className="grid gap-2.5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services &&
            services.map((service) => (
              <div
                key={service.serviceId}
                className="p-5 bg-card rounded-md relative neon-border"
              >
                <span className="text-xs absolute top-2 right-2">
                  {service.categoryDto.name}
                </span>
                <p className="my-2 text-2xl text-soft">{service.name}</p>
                <p className="my-2">{service.description}</p>
                <p className="my-2">
                  <span>Price: </span>
                  {service.price}
                  <span>$</span>
                </p>
                <hr className="text-soft mb-6" />
                <div className="flex justify-end gap-2">
                  {role === "Admin" ? (
                    <>
                      <input
                        className="text-[14px] btn-ghost cursor-pointer"
                        type="button"
                        value="Edit"
                        onClick={() => {
                          setSelectedService(service);
                          setIsOpenForm(true);
                        }}
                      />
                      <input
                        className="text-[14px] btn-danger cursor-pointer"
                        type="button"
                        value="Delete"
                        onClick={() => handleDelete(service.serviceId)}
                      />
                    </>
                  ) : (
                    <input
                      className="text-[14px] btn-secondary cursor-pointer"
                      type="button"
                      value="Request"
                      onClick={() =>
                        handleRequestService({
                          serviceRequestId: service.serviceId,
                          categoryId: service.categoryDto.id,
                          description: service.description,
                        })
                      }
                    />
                  )}
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
