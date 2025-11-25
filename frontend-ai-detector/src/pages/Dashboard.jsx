import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const data = [
  { name: 'Real', value: 70 },
  { name: 'Fake', value: 30 },
];

const COLORS = ['#00C49F', '#FF8042'];

export default function Dashboard() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Results Dashboard</h2>
      <PieChart width={400} height={300}>
        <Pie data={data} cx={200} cy={150} outerRadius={100} fill="#8884d8" dataKey="value" label>
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
