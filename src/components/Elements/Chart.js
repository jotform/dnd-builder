import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import * as icons from '../../utils/icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const data = [
  { name: 'Page A', value: 2400 },
  { name: 'Page B', value: 1398 },
  { name: 'Page C', value: 9800 },
  { name: 'Page D', value: 3908 },
];

const ChartColumn = () => (
  <ResponsiveContainer>
    <BarChart
      data={data}
      height={300}
      width={400}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <Bar
        dataKey="value"
        fill="#8884d8"
        isAnimationActive={false}
      />
    </BarChart>
  </ResponsiveContainer>
);

const ChartPie = () => (
  <ResponsiveContainer>
    <PieChart
      height={300}
      width={400}
    >
      <Pie
        data={data}
        dataKey="value"
        isAnimationActive={false}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index.toString()}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Legend height={36} />
    </PieChart>
  </ResponsiveContainer>
);

const Chart = ({ item: { chartType } }) => (
  chartType === 'column' ? <ChartColumn /> : <ChartPie />
);

Chart.propTypes = {
  item: PropTypes.shape({
    chartType: PropTypes.string,
  }),
};

Chart.defaultProps = {
  item: {},
};

const settings = [
  {
    key: 'chartType',
    label: 'Chart Type',
    options: [
      {
        icon: icons.pie,
        name: 'pie',
        title: 'Pie Chart',
      },
      {
        icon: icons.column,
        name: 'column',
        title: 'Column Chart',
      },
    ],
    section: 'GENERAL',
    type: 'selectBox',
  },
];

export const details = {
  chartType: 'pie',
  height: 300,
  itemType: 'graphic',
  width: 420,
};

export default {
  Component: memo(Chart),
  details,
  itemType: 'graphic',
  settings,
};
