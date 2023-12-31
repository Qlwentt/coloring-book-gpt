import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleTextChange = (e) => {
    setText(e.target.value);
  };
  const navigate = useNavigate();

  async function getBook(text) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: text,
        }),
      });
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
    }

    return data;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    getBook(text).then((data) => {
      navigate(`/books/${data.data.id}`);
    });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center imagine-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center imagine-container">
      <form
        className="imagine-form mb-3 d-flex justify-content-center align-items-center flex-column"
        onSubmit={handleSubmit}
      >
        <div className="p-2">Make me a coloring book about...</div>

        <div className="input-group  imagine-input">
          <input
            className="p-2 form-control"
            type="text"
            placeholder=""
            value={text}
            onChange={handleTextChange}
            required
          />
          <button className="btn btn-primary" type="submit" id="button-addon2">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
