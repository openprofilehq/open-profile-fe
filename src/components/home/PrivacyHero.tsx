"use client";
import { useState } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";

const PrivacyHero = () => {
  const [query, setQuery] = useState<string>("");
  return (
    <div className="bg-[#DBEFF2] w-screen h-80 pt-20 lg:pt-36">
      <div className="flex flex-col max-w-2xl gap-3 lg:ml-32 p-3">
        <div>
          <h3 className="text-3xl font-bold">Privacy Policy</h3>
          <p className="font-bold">Last updated on the 10th of May 2026</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 ">
          <span className="flex gap-2 items-center bg-[#FAFAFA] border border-[#C9C9C9] rounded-[5.57px] px-3 w-full sm:w-auto">
            <RxMagnifyingGlass />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 h-12.5 py-4 sm:py-0 px-3 rounded-[5.57px] text-[16px] leading-6 text-[#454545] placeholder:text-[#454545] outline-none  transition"
              style={{ fontFamily: "'Afacad', sans-serif" }}
            />
          </span>

          <button
            className="w-full sm:w-auto h-14 sm:h-12.5 px-4 bg-brand hover:bg-[#065E69] rounded-[8px] text-white text-[16px] leading-6 whitespace-nowrap transition-colors"
            style={{ fontFamily: "'Afacad', sans-serif" }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyHero;
