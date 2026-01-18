"use client";
import CustomButton from "@/components/custom-button";
import { SavingsPlan } from "@/payload-types";
import { Calendar, CheckCircle2, Clock } from "lucide-react";
import { useMemo, useState } from "react";

export default function DailyContributionTracker({
  plan,
}: {
  plan: SavingsPlan;
}) {
  const dailyUnit = plan.dailyAmount || 0;
  const totalDaysCovered = Math.floor(plan.currentBalance! / dailyUnit);
  const [activeMonthFilter, setActiveMonthFilter] = useState(0);

  const months = useMemo(() => {
    const start = new Date(plan.createdAt);
    const result = [];
    let currentDayIndex = 0;

    for (let m = 0; m < 6; m++) {
      const monthDate = new Date(start.getFullYear(), start.getMonth() + m, 1);
      const monthName = monthDate.toLocaleString("default", { month: "long" });
      const year = monthDate.getFullYear();
      const daysInMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      ).getDate();

      const days = [];
      let monthTickedCount = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const isTicked = currentDayIndex < totalDaysCovered;
        if (isTicked) monthTickedCount++;
        days.push({ day: d, ticked: isTicked });
        currentDayIndex++;
      }

      result.push({ name: monthName, year, days, monthTickedCount });
    }
    return result;
  }, [plan, totalDaysCovered]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 1. Filter Section (Mobile Scrollable) */}
      <div className="bg-white p-4 rounded-xl shadow-lg border dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center">
          <Calendar className="h-3 w-3 mr-2" />
          Select Month
        </h3>
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
          {months.map((month, idx) => (
            <CustomButton
              key={idx}
              onClick={() => setActiveMonthFilter(idx)}
              variant={activeMonthFilter === idx ? "default" : "secondary"}
              className="min-w-[110px]"
            >
              <span>{month.name}</span>
            </CustomButton>
          ))}
        </div>
      </div>

      {/* 2. Calendar Card */}
      <div className="bg-background rounded-xl shadow-lg border dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-none">
              {months[activeMonthFilter].name}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">
              {months[activeMonthFilter].year} Cycle
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-black text-primary leading-none">
              {months[activeMonthFilter].monthTickedCount}{" "}
              <span className="text-xs sm:text-sm text-gray-400 font-bold">
                / {months[activeMonthFilter].days.length}
              </span>
            </p>
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              Days Active
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {months[activeMonthFilter].monthTickedCount === 0 &&
          activeMonthFilter > 0 ? (
            <div className="text-center py-10 sm:py-12 text-gray-400">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-bold text-gray-500">Upcoming Month</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
                <div
                  key={index}
                  className="text-[9px] sm:text-[10px] text-center font-black text-gray-400 uppercase mb-1"
                >
                  {d}
                </div>
              ))}
              {months[activeMonthFilter].days.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`
                    group relative aspect-square flex items-center justify-center rounded-md sm:rounded-lg text-[10px] sm:text-sm font-bold transition-all
                    ${
                      day.ticked
                        ? "bg-green-50 text-primary dark:bg-green-900/30 border-2 border-green-100 dark:border-green-800"
                        : "bg-white text-gray-300 dark:bg-gray-800 dark:text-gray-600 border border-gray-100 dark:border-gray-700"
                    }
                  `}
                >
                  {day.ticked ? (
                    <CheckCircle2
                      size={14}
                      className="sm:w-[18px] sm:h-[18px] text-primary"
                    />
                  ) : (
                    day.day
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 bg-primary text-primary-foreground grid grid-cols-2 gap-4">
          <div className="text-center border-r border-white/20">
            <p className="text-[8px] sm:text-[10px] font-bold opacity-80 uppercase tracking-widest">
              Streaks
            </p>
            <p className="text-sm sm:text-lg font-black">
              {totalDaysCovered} Days
            </p>
          </div>
          <div className="text-center">
            <p className="text-[8px] sm:text-[10px] font-bold opacity-80 uppercase tracking-widest">
              Efficiency
            </p>
            <p className="text-sm sm:text-lg font-black">
              {((totalDaysCovered / (30 * 6)) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
