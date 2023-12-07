import PropTypes from 'prop-types';

Tooltip.propTypes = {
  datos: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
};

function Tooltip({ datos: { x, y, areaName, state, grado }, isActive }) {
  return (
    <div
      id="tooltip"
      data-education={grado}
      style={{ transform: `translate(${x}px, ${y}px)`, display: isActive ? 'block' : 'hidden' }}
    >
      <span>{areaName} - </span>
      <span>{state}: </span>
      <span>{grado}%</span>
    </div>
  );
}

export default Tooltip;
