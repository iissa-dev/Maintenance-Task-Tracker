import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { CategoryWithRequestCountDto } from "../types";
import { categoryService } from "../services/categoryService";

function DashboardChart() {
  const [categories, setCategories] = useState<CategoryWithRequestCountDto[]>(
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await categoryService.getTopThreeCategories();
        if (res.isSuccess) {
          setCategories(res.data);
        } else {
          console.error(res);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const chartData = categories.map((c) => ({
    name: c.name,
    count: c.requestCount,
  }));
  return (
    <div className="lg:col-span-2 chart-card p-6 rounded-2xl">
      <h3 className="font-bold text-soft mb-6">Distribution by Category</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "hsl(210 50% 4%)" }}
              contentStyle={{ borderRadius: "12px", border: "none" }}
            />
            <Bar
              dataKey="count"
              fill="var(--color-primary)"
              radius={[6, 6, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardChart;
