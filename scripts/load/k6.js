import http from 'k6/http'
import { sleep } from 'k6'

export const options = {
  vus: 20,
  duration: '30s'
}

export default function () {
  const res = http.get('http://localhost:5174/api/tasks')
  // Ingest metrics to backend (requires token in real run)
  // http.post('http://localhost:5174/api/dev/perf', JSON.stringify({ endpoint: '/api/tasks', latency_ms: res.timings.duration, status: res.status }), { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${__ENV.TOKEN}` } })
  sleep(1)
}
