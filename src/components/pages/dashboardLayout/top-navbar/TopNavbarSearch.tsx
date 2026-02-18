"use client";

import type React from "react";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="w-full md:w-[450px] lg:w-[420px] xl:w-[768px] mx-auto px-4 py-2 lg:block hidden">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Gemelli"
            className="w-full py-3 px-4 bg-white pl-5 border-none rounded-full font-poppins text-gray-700 placeholder-[#0F0F0F] placeholder:font-medium placeholder:opacity-70  focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="absolute right-1 p-2 bg-blue-100 rounded-full text-blue-600 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
