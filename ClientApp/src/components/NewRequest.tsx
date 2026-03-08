import React, { useEffect, useState } from "react";
import type {
  RequestDto,
  CategoryDto,
  UpdateRequestDto,
  MaintenanceRequestDto,
} from "../types/index";
import { categoryService } from "../services/categoryService";
import { requestService } from "../services/requestService";
import { PopupType, usePopup } from "./Popup";

async function addNew(params: RequestDto) {
  try {
    const res = await requestService.addNewRequest(params);
    if (res.isSuccess) {
      return res.isSuccess;
    } else {
      console.log(res.message);
    }
  } catch (err) {
    console.error(err);
  }
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  Mode: string;
  data: MaintenanceRequestDto | null;
};

function getCategoryId(categories: CategoryDto[], categoryName: string) {
  const category = categories.find((c) => c.name === categoryName);
  return category?.id;
}

function NewRequest({ isOpen, onClose, Mode = "Add", data }: Props) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [category, setCategory] = useState(1);
  const [status, setStatus] = useState(0); // Pending = 0
  const { confirm, Modal } = usePopup();

  const handleStaus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const text = e.target.value;
    setStatus(Number(text));
  };
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setDescription(text);
  };
  const handleCustomerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setCustomerName(text);
  };
  const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const text = e.target.value;
    setCategory(Number(text));
  };
  // Get All Categories
  useEffect(() => {
    const fetchCatogories = async () => {
      try {
        const res = await categoryService.getAll();
        if (res.isSuccess) {
          setCategories(res.data);
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCatogories();
  }, []);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDescription(data.description);
      setCustomerName(data.customerName);
      setCategory(getCategoryId(categories, data.categoryName) ?? 1);
      if (data.status === "Pending") setStatus(0);
      if (data.status === "InProgress") setStatus(1);
      if (data.status === "Completed") setStatus(2);
    }
  }, [data, categories]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const sure = await confirm(
      "Are you sure you want to add new Request?",
      "Adding",
      PopupType.INFO,
    );
    if (!sure) return;
    const ok = await addNew({
      description: description,
      categoryId: category,
      customerName: customerName,
    });

    if (ok) {
      console.log("Add new Request");
      onClose();
    } else {
      console.log("Not Add");
    }
  };

  const handleEdit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) => {
    e.preventDefault();
    const Update: UpdateRequestDto = {
      description: description,
      categoryId: category,
      customerName: customerName,
      status: status,
    };

    const sure = await confirm(
      "Are you sure you want to update  Request?",
      "Adding",
      PopupType.INFO,
    );
    if (!sure) return;

    try {
      const res = await requestService.updateReqeust(id, Update);

      if (res.isSuccess) {
        onClose();
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay fixed z-999 w-screen h-screen bg-black/25 backdrop-blur-[2px] inset-0"></div>
      <div
        className="fixed w-100 top-[50%] left-[50%]
     translate-x-[-50%] translate-y-[-50%] z-1000 bg-(--color-background) neon-border p-5 rounded-[10px]"
      >
        <h1 className="text-[30px] font-bold text-center mb-5">
          {Mode === "Edit" ? "Edit Request" : "New Request"}
        </h1>
        <form action="POST" className="flex flex-col ">
          <label htmlFor="description">Description</label>
          <input
            onChange={handleDescription}
            id="description"
            type="text"
            value={description}
            className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
          />
          <label htmlFor="customerName">CustomerName</label>
          <input
            onChange={handleCustomerName}
            id="customerName"
            type="text"
            value={customerName}
            className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
          />
          <select
            onChange={handleCategory}
            className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-5"
            value={category}
          >
            {categories.map((c) => (
              <option
                className="bg-(--color-background) text-soft"
                key={c.id}
                value={c.id}
              >
                {c.name}
              </option>
            ))}
          </select>
          {Mode === "Edit" && (
            <select
              onChange={handleStaus}
              className="px-2.5 py-1.25 border border-(--color-muted-foreground) outline-none rounded-[20px] mb-6"
              value={status}
            >
              <option className="bg-(--color-background) text-soft" value={0}>
                Pending
              </option>
              <option className="bg-(--color-background) text-soft" value={1}>
                InProgress
              </option>
              <option className="bg-(--color-background) text-soft" value={2}>
                Completed
              </option>
            </select>
          )}
          <div className="flex gap-2.5 justify-end">
            {Mode === "Edit" ? (
              <button
                onClick={(e) => handleEdit(e, data?.id ?? 0)}
                className="p-[4px_16px] btn-ghost rounded-md cursor-pointer"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="p-[4px_16px] btn-ghost rounded-md cursor-pointer"
              >
                Add
              </button>
            )}
            <button
              onClick={onClose}
              className="p-[4px_16px] btn-danger rounded-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </form>
      </div>
      <Modal />
    </>
  );
}

export default NewRequest;
