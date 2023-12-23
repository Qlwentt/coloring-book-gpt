import React, { useState, useEffect } from "react";

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
      console.log(books);
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
            <th scope="col">Bought</th>
            <th scope="col">Download PDF</th>
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
                <td>{book.is_bought ? "Yes" : "No"}</td>
                <td>{book.pdf_url}</td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </>
  );
}
