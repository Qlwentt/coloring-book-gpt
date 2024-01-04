import React, { useState, useEffect } from "react";
import BuyModal from "../BuyModal";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getBooks() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/books");
      const data = await response.json();
      return data.data;
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      setIsLoading(false);
    });
  }, []);

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
    <>
      <h1>Books</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Imagine</th>
            <th scope="col">Purchased</th>
            <th scope="col">View/Download PDF</th>
          </tr>
        </thead>

        {books && books.length > 0 && (
          <tbody>
            {books.map((book, i) => (
              <tr key={book.id}>
                <th scope="row">{i + 1}</th>
                <td>
                  <a href={`/books/${book.id}`}>{book.imagine_query}</a>
                </td>
                <td>
                  {book.purchased ? (
                    <i className="bi bi-bag-check text-success"></i>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target={`#exampleModal-${book.id}`}
                    >
                      Buy PDF
                    </button>
                  )}
                </td>
                <td>
                  {book.pdf_url ? (
                    <a href={book.pdf_url} target="_blank">
                      View PDF
                    </a>
                  ) : (
                    "Buy book to download / view PDF"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {books && books.map((book) => <BuyModal key={book.id} book={book} />)}
    </>
  );
}
