# Chart Components (Recharts)

## LineChart
- Props: `data`, `xKey`, `yKey`, `color`
- Usage:
```
<LineChart data={[{day:'Mon', value:3}]} xKey="day" yKey="value" />
```

## BarChart
- Props: `data`, `xKey`, `yKey`, `color`
```
<BarChart data={[{cat:'A', value:10}]} xKey="cat" yKey="value" />
```

## DonutChart
- Props: `data: {name, value}[]`, `colors`
```
<DonutChart data={[{name:'Income', value:60},{name:'Expense', value:40}]} />
```

## HeatmapWeekly
- Props: `data: {label, value}[]`
```
<HeatmapWeekly data={[{label:'Seg', value:1}, ...]} />
```

All components follow the brutalist design system (dark, green accent, mono typography).
