import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BuyModal({ book }) {
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  async function redeemLicense(key) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/books/${book.id}/redeem_license`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          license_key: key,
        }),
      });
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }

    return data;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    redeemLicense(licenseKey).then((data) => {
      console.log({ data });
      if (data.success) {
        setIsRedeemed(true);
        navigate(0);
      } else {
        setIsError(true);
      }
    });
  };

  let status = null;
  if (isLoading) {
    status = "loading";
  } else if (isRedeemed) {
    status = "success";
  } else if (isError) {
    status = "error";
  }
  console.log({ status });

  console.log(book);
  return (
    <div
      className="modal fade"
      id={`exampleModal-${book.id}`}
      tabIndex="-1"
      aria-labelledby={`exampleModalLabel-${book.id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1
              className="modal-title fs-5"
              id={`exampleModalLabel-${book.id}`}
            >
              Buy Book {book.imagine_query} # {book.id}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            I have a license key!
            <form>
              <input
                type="text"
                className="form-control"
                placeholder="License key"
                aria-label="License key"
                aria-describedby="basic-addon1"
                onChange={(e) => setLicenseKey(e.target.value)}
                value={licenseKey}
              />
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
              >
                Redeem
              </button>
            </form>
            {status && <Status status={status} />}I don't have a license key!
            <a
              className="gumroad-button"
              href="https://9359254154654.gumroad.com/l/tbetp"
              data-gumroad-overlay-checkout="true"
              target="_blank"
            >
              Buy on
            </a>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Status = ({ status }) => {
  if (status === "success") {
    return (
      <div className="alert alert-success" role="alert">
        Your license key has been redeemed!
      </div>
    );
  } else if (status === "error") {
    return (
      <div className="alert alert-danger" role="alert">
        Your license key is invalid!
      </div>
    );
  } else if (status === "loading") {
    return (
      <div className="alert alert-primary" role="alert">
        Loading...
      </div>
    );
  }
};
