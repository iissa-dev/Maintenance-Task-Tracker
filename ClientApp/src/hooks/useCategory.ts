import {useQuery} from "@tanstack/react-query";
import {categoryService} from "../services/categoryService.ts";


const useCategory = () => {
    const {data: categories} = useQuery({
        queryKey: ["categories"],
        queryFn: categoryService.getAll,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,
        select: (res) => res.data ?? []
    });

    return categories;
}

export default useCategory;