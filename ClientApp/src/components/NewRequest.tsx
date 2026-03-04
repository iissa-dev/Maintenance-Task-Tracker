import React, { useEffect, useState } from "react";
import type { RequestDto, CategoryDto } from "../types/index";
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
};

function NewRequest({ isOpen, onClose }: Props) {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [category, setCategory] = useState(1);
  const { confirm, Modal } = usePopup();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay fixed z-999 w-[100vw] h-[100vh] bg-blue-500/50"></div>
      <div
        className="fixed w-[400px] top-[50%] left-[50%]
     translate-x-[-50%] translate-y-[-50%] z-1000 bg-white p-[20px] rounded-[10px]"
      >
        <h1 className="text-[30px] font-bold text-center mb-[20px]">
          New Request
        </h1>
        <form onSubmit={handleSubmit} action="POST" className="flex flex-col ">
          <label htmlFor="description">Description</label>
          <input
            onChange={handleDescription}
            id="description"
            type="text"
            className="px-[10px] py-[5px] border-1 border-[#ccc] outline-none rounded-[20px] mb-[20px]"
          />
          <label htmlFor="customerName">CustomerName</label>
          <input
            onChange={handleCustomerName}
            id="customerName"
            type="text"
            className="px-[10px] py-[5px] border-1 border-[#ccc] outline-none rounded-[20px] mb-[20px]"
          />
          <select
            onChange={handleCategory}
            className="px-[10px] py-[5px] border-1 border-[#ccc] outline-none rounded-[20px] mb-[20px]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="flex gap-[10px] justify-end">
            <button className="p-[4px_16px] bg-green-500 text-white rounded-[6px] cursor-pointer">
              Add
            </button>
            <button
              onClick={onClose}
              className="p-[4px_16px] bg-red-500 text-white rounded-[6px] cursor-pointer"
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
