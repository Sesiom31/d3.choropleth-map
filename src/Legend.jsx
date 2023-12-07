import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { w, pr } from './datos';

Legend.propTypes = {
  colorScale: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  colors: PropTypes.array.isRequired,
};

function Legend({ colorScale, min, max, colors }) {
  const gxRef = useRef(null);
  const rectRef = useRef(null);
  const widthColor = 400 / colors.length;

  const xScale = d3
    .scaleLinear()
    .domain([min, max])
    .range([w - pr - 400, w - pr]);

  useEffect(() => {
    d3.select(gxRef.current).call(
      d3
        .axisBottom(xScale)
        .tickValues(colorScale.domain())
        .tickFormat((d) => d3.format('.0%')(d / 100))
    );
  }, [xScale, colorScale]);

  useEffect(() => {
    d3.select(rectRef.current)
      .selectAll('rect')
      .data(colorScale.domain())
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * widthColor) // (d, i) => i * widthColor
      .attr('y', 5)
      .attr('width', widthColor)
      .attr('height', 15)
      .attr('fill', (d, i) => colors[i]);
  }, [xScale, colors, widthColor, colorScale]);

  return (
    <>
      <g ref={rectRef} id="legend" transform={`translate(${w - pr - 400},0)`}></g>
      <g ref={gxRef} transform={`translate(0, 20)`} style={{ fontSize: '0.7rem' }}></g>
    </>
  );
}

export default Legend;
