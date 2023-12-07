import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import Title from './Title';
import Svg from './Svg';
import { urlTopo, urlEducation } from './datos';

function Graphic() {
  const [dataTopo, setDataTopo] = useState({});
  const [dataEducation, setDataEducation] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data1, data2] = await Promise.all([d3.json(urlTopo), d3.json(urlEducation)]);
        setDataTopo(data1);
        setDataEducation(data2);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Title />
      <Svg dataTopo={dataTopo} dataEducation={dataEducation} />
    </>
  );
}

export default Graphic;
