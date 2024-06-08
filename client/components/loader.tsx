import React from "react";

type Props = {
  color: "primary" | "white";
};

const Loader = ({ color }: Props) => {
  return (
    <span
      className={color === "primary" ? "loader-primary" : "loader-white"}
    ></span>
  );
};

export default Loader;
