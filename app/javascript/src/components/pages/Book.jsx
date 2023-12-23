import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toTitleCase } from "../../../utils";

export default function Book() {
  const [book, setBook] = useState(null);
  const { id } = useParams();

  async function getBook() {
    const response = await fetch(`/api/v1/books/${id}`);
    const data = await response.json();
    return data.data;
  }

  useEffect(() => {
    getBook().then((data) => {
      setBook(data);
    });
  }, []);

  if (!book) {
    return <div>Loading...</div>;
  }

  console.log(book);

  return (
    <>
      {book.imagine_query && <h1> {toTitleCase(book.imagine_query)}</h1>}
      <div className="d-flex justify-content-center align-items-center imagine-container">
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {book.images.map((page, i) => {
              return (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to={i}
                  className={i === 0 ? "active" : ""}
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
            {book.images.map((page, i) => {
              const active = i === 0 ? "active" : "";
              return (
                <div className={`carousel-item ${active}`} key={i}>
                  <img className="d-block w-100" src={page} alt={page.prompt} />
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
    </>
  );
}
