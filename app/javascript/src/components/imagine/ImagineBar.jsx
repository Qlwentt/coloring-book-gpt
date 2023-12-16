import React, { useState } from "react";

export default function ImagineBar() {
  const [text, setText] = useState("");
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  async function getBook(text) {
    const response = await fetch(`${process.env.API_URL}/api/v1/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: text,
      }),
    });
    const data = await response.json();
    return data;
  }
  const handleSubmit = (e) => {
    // make request to api
    // go to preview page
    e.preventDefault();
    getBook(text).then((data) => {
      console.log(data);
    });
    console.log(text);
  };

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
