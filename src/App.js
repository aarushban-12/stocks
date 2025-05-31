import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import 'bootstrap/dist/css/bootstrap.min.css';

const companies = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "TSLA",
  "NVDA",
  "META",
  "NFLX",
];

const colors = {
  AAPL: "#8884d8",
  GOOGL: "#82ca9d",
  MSFT: "#ffc658",
  AMZN: "#ff7300",
  TSLA: "#0088FE",
  NVDA: "#00C49F",
  META: "#FFBB28",
  NFLX: "#FF8042",
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];


//randomly generated data for graphs
function randomPercentChange() {
  return (Math.random() * 200 - 100).toFixed(2);
}

function randomPrice(base) {
  return Number((base * (0.3 + Math.random() * 2.2)).toFixed(2));
}

function randomVolume() {
  return Math.floor(500000 + Math.random() * 14500000);
}

function randomMarketCap() {
  return Math.floor(1e11 + Math.random() * 3e12);
}


//starting prices for each company
const basePrices = {
  AAPL: 150,
  GOOGL: 2800,
  MSFT: 300,
  AMZN: 3450,
  TSLA: 720,
  NVDA: 800,
  META: 310,
  NFLX: 560,
};


//generates random values for each company using map loop
const stockData = days.map((day) => {
  const dayObj = { name: day };
  companies.forEach((c) => {
    dayObj[c] = {
      price: randomPrice(basePrices[c]),
      volume: randomVolume(),
      marketCap: randomMarketCap(),
      change: Number(randomPercentChange()),
    };
  });
  return dayObj;
});


//this isolates data for one category, such as price or volume
function prepareDataByProperty(property) {
  return stockData.map((day) => {
    const dayData = { name: day.name };
    companies.forEach((company) => {
      dayData[company] = day[company][property];
    });
    return dayData;
  });
}

export default function StockCharts() {
  const priceData = prepareDataByProperty("price");
  const volumeData = prepareDataByProperty("volume");
  const changeData = prepareDataByProperty("change");
  const marketCapData = prepareDataByProperty("marketCap");

  const latestMarketCaps = companies.map((company) => ({
    name: company,
    value: stockData[stockData.length - 1][company].marketCap,
  }));

  return (
    <div className="container my-4 mx-auto" style={{ maxWidth: "1200px"}}>
      <h2 className="mb-4">Stock Data for Top Tech Companies</h2>

      <h4>Stock Prices Over the Week (USD)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={priceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            domain={[
              (dataMin) => Math.floor(dataMin * 0.7),
              (dataMax) => Math.ceil(dataMax * 1.3), // reduced upper limit for less squished bottom
            ]}
            tickFormatter={(val) => `$${val.toFixed(0)}`}
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          {companies.map((company) => (
            <Line
              key={company}
              type="monotone"
              dataKey={company}
              stroke={colors[company]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <h4 className="mt-5">Trading Volume Over the Week (Millions)</h4>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={volumeData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis 
      tickFormatter={(val) => (val / 1_000_000).toFixed(1) + "M"} 
      // Optionally, you can use Math.round or remove decimals
    />
    <Tooltip formatter={(value) => value.toLocaleString()} />
    <Legend />
    {companies.map((company) => (
      <Bar
        key={company}
        dataKey={company}
        stackId="a"
        fill={colors[company]}
        barSize={15}
      />
    ))}
  </BarChart>
</ResponsiveContainer>


      <h4 className="mt-5">Daily Percentage Change (%)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={changeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[-120, 120]} />
          <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
          <Legend />
          {companies.map((company) => (
            <Line
              key={company}
              type="monotone"
              dataKey={company}
              stroke={colors[company]}
              strokeWidth={2}
              dot={true}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <h4 className="mt-5">Market Cap Over the Week (Trillions USD)</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={marketCapData.map((d) => {
            const newObj = { name: d.name };
            companies.forEach(
              (c) => (newObj[c] = d[c] / 1_000_000_000_000)
            );
            return newObj;
          })}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
            tickFormatter={(val) => val.toFixed(2)}
          />
          <Tooltip formatter={(val) => val.toFixed(2) + " T"} />
          <Legend />
          {companies.map((company) => (
            <Line
              key={company}
              type="monotone"
              dataKey={company}
              stroke={colors[company]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <h4 className="mt-5">Market Cap Distribution on Friday</h4>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={latestMarketCaps}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={(entry) =>
              `${entry.name}: ${(
                (entry.value /
                  latestMarketCaps.reduce((a, b) => a + b.value, 0)) *
                100
              ).toFixed(1)}%`
            }
          >
            {latestMarketCaps.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[entry.name]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
