import React from "react";
import PropTypes from "prop-types";

function TitlePage({ line1, line2 }) {
  return (
    <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-[#030521]">
      {line1} <br /> {line2}
    </h1>
  );
}

TitlePage.propTypes = {
  line1: PropTypes.string.isRequired,
  line2: PropTypes.string,
};

export default TitlePage;
