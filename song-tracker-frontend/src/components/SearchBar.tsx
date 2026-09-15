import { useState } from "react";
import type {SetURLSearchParams} from "react-router";

interface SearchBarProps {
  defaultValue: string;
  setSearchParams: SetURLSearchParams;
}

export function SearchBar({ defaultValue, setSearchParams }: SearchBarProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchParams(`?q=${input}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  return (
    <>
      <form className="flex w-full" onSubmit={handleSubmit}>
        <input
          className="m-2 flex grow rounded-md border p-1 dark:border-gray-400"
          defaultValue={defaultValue}
          onChange={handleChange}
          placeholder="Search for songs..."
          type="text"
          value={input}
        />
      </form>
    </>
  );
}