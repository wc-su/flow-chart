import { useParams } from 'react-router';

const Chart = () => {
  const { chartId } = useParams();

  return (
    <>
      <h1>Chart</h1>
      <p>{chartId}</p>
    </>
  );
};

export default Chart;
