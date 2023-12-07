import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import Legend from './Legend';
import { w, h } from './datos';
import { useEffect, useRef, useState } from 'react';
import Tooltip from './Tooltip';

Svg.propTypes = {
  dataTopo: PropTypes.object.isRequired,
  dataEducation: PropTypes.array.isRequired,
};

function Svg({ dataTopo, dataEducation }) {
  const [tooltipIsActive, setTooltipIsActive] = useState(false);
  const [datosTooltip, setDatosTooltip] = useState({
    x: 0,
    y: 0,
    areaName: '',
    state: '',
    grado: 0,
  });
  const svgRef = useRef(null);
  const mapaRef = useRef(null);

  const [minPorcent = 0, maxPorcent = 0] = [
    d3.min(dataEducation, (d) => d.bachelorsOrHigher),
    d3.max(dataEducation, (d) => d.bachelorsOrHigher),
  ];

  const colors = d3.schemePuBu[9];

  const colorScale = d3
    .scaleThreshold()
    .domain(d3.range(minPorcent, maxPorcent, (maxPorcent - minPorcent) / colors.length))
    .range(colors);

  useEffect(() => {
    if (Object.keys(dataTopo).length > 0) {
      const ptSize = svgRef.current.getBoundingClientRect().y;
      d3.select(mapaRef.current)
        .selectAll('path')
        .data(topojson.feature(dataTopo, dataTopo.objects.counties).features)
        .enter()
        .append('path')
        .attr('class', 'county')
        .attr('data-fips', (d) => d.id)
        .attr('data-education', (d) => {
          const obj = dataEducation.find((dE) => dE.fips === d.id);
          return obj.bachelorsOrHigher;
        })
        .attr('fill', (d) => {
          const obj = dataEducation.find((dE) => dE.fips === d.id);
          return colorScale(obj.bachelorsOrHigher);
        })
        .style('cursor', 'pointer')
        .attr('d', d3.geoPath())
        .on('mouseenter', (e, d) => {
          const obj = dataEducation.find((dE) => dE.fips === d.id);
          setTooltipIsActive(true);
          setDatosTooltip({
            x: e.pageX + 10,
            y: e.pageY - ptSize - 10,
            areaName: obj.area_name,
            state: obj.state,
            grado: obj.bachelorsOrHigher,
          });
        })
        .on('mouseleave', () => {
          setTooltipIsActive(false);
        });
    }
  }, [dataTopo, colorScale, dataEducation]);

  return (
    <main>
      <svg width={w} height={h} ref={svgRef}>
        <g ref={mapaRef} id="prueba" style={{ border: '2px solid red' }}></g>
        <Legend colorScale={colorScale} min={minPorcent} max={maxPorcent} colors={colors} />
      </svg>

      {tooltipIsActive && <Tooltip datos={datosTooltip} isActive={tooltipIsActive} />}
    </main>
  );
}

export default Svg;
