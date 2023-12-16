import React, { useState } from "react";

export default function ImagineBar() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [prompts, setPromps] = useState([]);
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  async function getBook(text) {
    setIsLoading(true);
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
    setIsLoading(false);
    return data;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    getBook(text).then((data) => {
      console.log(data.data.images);
      setPages(data.data.images);
      setPromps(data.data.prompts);
    });
    console.log(text);
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

  if (pages && pages.length === 0) {
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
            <button
              className="btn btn-primary"
              type="submit"
              id="button-addon2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (pages && pages.length > 0) {
    return (
      <div className="d-flex justify-content-center align-items-center imagine-container">
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {pages.map((page, i) => {
              return (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={i}
                  class="active"
                  aria-current="true"
                  aria-label={`Slide ${i + 1}`}
                ></button>
              );
            })}
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={pages[0]} className="d-block w-100" alt={prompts[0]} />
            </div>
            {pages.map((page, i) => {
              return (
                <div className="carousel-item active" key={i}>
                  <img className="d-block w-100" src={page} alt={prompts[i]} />
                </div>
              );
            })}
          </div>
          <button
            className="carousel-control-prev btn-primary"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next btn-primary"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    );
  }
}
