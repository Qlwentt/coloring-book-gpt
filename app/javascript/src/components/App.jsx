import React, { useState } from "react";
import ImagineBar from "./imagine/ImagineBar";
import SignIn from "./SignIn";

export default function App() {
  const [user, setUser] = useState(window.USER);
  console.log(user);
  return <>{user ? <ImagineBar /> : <SignIn />}</>;
}
