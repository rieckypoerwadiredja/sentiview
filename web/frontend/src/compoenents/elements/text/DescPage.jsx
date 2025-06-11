import React from "react";
import PropTypes from "prop-types";

function DescPage({ text }) {
  return <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">{text}</p>;
}

DescPage.propTypes = {
  text: PropTypes.string.isRequired,
};

export default DescPage;
