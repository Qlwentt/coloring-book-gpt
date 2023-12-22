import React from "react";

export default function SignIn() {
  return (
    <div className="d-flex justify-content-center align-items-center imagine-container">
      <div className="card ">
        <div className="card-header">Sign in to make a coloring book</div>
        <div className="card-body">
          <h5 className="card-title">Sign in or Create an Account</h5>
          <p className="card-text">with Google</p>
          <a className="btn btn-primary" role="button" href="/login">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
