import React, { useState, useEffect } from "react";
import BuyModal from "../BuyModal";

export default function Books() {
  const [books, setBooks] = useState([]);

  async function getBooks() {
    const response = await fetch("/api/v1/books");
    const data = await response.json();
    return data.data;
  }

  useEffect(() => {
    getBooks().then((data) => {
      setBooks(data);
      console.log(data);
    });
  }, []);
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
                    <i class="bi bi-bag-check text-success"></i>
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
