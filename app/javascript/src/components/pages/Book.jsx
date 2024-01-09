import React, { useState, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toTitleCase } from "../../helpers/utils";
import Carousel from "bootstrap/js/dist/carousel";
import useBook from "../../hooks/useBook";

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const bookCarousel = document.querySelector("#bookCarousel");
    if (bookCarousel) {
      new Carousel(bookCarousel, { interval: false });
    }
  });

  useEffect(() => {
    if (showAlert) {
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  }, [showAlert]);

  const { data } = useBook(id, setShowAlert);
  const book = data?.data;

  if (data && data.status === 403) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center imagine-container">
        <div className="alert alert-danger" role="alert">
          You do not have access to this book
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/books")}>
          Go to My Books{" "}
        </button>
      </div>
    );
  }

  if (book && book.images.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center imagine-container">
        <div>Error: Something went wrong</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Try Again
        </button>
      </div>
    );
  }

  if (!book || book.images.every((image) => image.remote_url === null)) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center imagine-container">
        <div>It takes about 30 seconds to start to see images...</div>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const activeImage = book.images.findIndex(
    (image) => image.remote_url !== null
  );

  return (
    <>
      {book.imagine_query && <h1> {toTitleCase(book.imagine_query)}</h1>}
      <div className="d-flex flex-column justify-content-center align-items-center imagine-container">
        {showAlert && (
          <div className="alert alert-success" role="alert">
            All images have finished loading
          </div>
        )}
        <div
          id="bookCarousel"
          className="carousel slide"
          data-bs-interval="false"
        >
          <div className="carousel-indicators">
            {book.images.map((page, i) => {
              return (
                <button
                  key={i}
                  type="button"
                  data-bs-target="#bookCarousel"
                  data-bs-slide-to={i}
                  className={i === activeImage ? "active" : ""}
                  aria-current="true"
                  aria-label={`Slide ${i + 1}`}
                ></button>
              );
            })}
          </div>
          <div className="carousel-inner">
            {book.images.map((page, i) => {
              const active = i === activeImage ? "active" : "";
              return (
                <div className={`carousel-item ${active}`} key={i}>
                  <img
                    className="d-block w-100"
                    src={page.remote_url}
                    alt={page.prompt}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5 className="page-caption">Page {i + 1}</h5>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="carousel-control-prev btn-primary"
            type="button"
            data-bs-target="#bookCarousel"
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
            data-bs-target="#bookCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
        {book.images.every((image) =>
          image.remote_url.includes("storage.googleapis.com")
        ) && (
          <button
            className="btn btn-primary books-button"
            onClick={() => navigate("/books")}
          >
            Go to Books to Buy
          </button>
        )}
      </div>
    </>
  );
}
