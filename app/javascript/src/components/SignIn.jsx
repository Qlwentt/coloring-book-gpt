import React from "react";

export default function SignIn() {
  const csrf = document
    .querySelector("meta[name='csrf-token']")
    .getAttribute("content");
  const handleClick = async () => {
    const response = await fetch(`/user/auth/google_oauth2`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrf,
      },
      body: JSON.stringify({
        provider: ["google_oauth2"],
      }),
    });
    console.log(response);
  };

  return (
    <>
      <div>Sign In to make a coloring book</div>
      <button onClick={handleClick} className="btn btn-primary">
        Sign In
      </button>
    </>
  );
}
