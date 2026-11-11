import http from 'k6/http';
import { check, sleep } from 'k6';

// K6_SMOKE=1: short run with loose thresholds, for every PR.
const smoke = !!__ENV.K6_SMOKE;

export const options = {
  stages: smoke
    ? [{ duration: '15s', target: 5 }]
    : [
        { duration: '30s', target: 20 },
        { duration: '1m', target: 20 },
        { duration: '30s', target: 0 },
      ],
  thresholds: {
    http_req_duration: [smoke ? 'p(95)<=5000' : 'p(95)<=2000'],
    http_req_failed: [smoke ? 'rate<=0.05' : 'rate<=0.01'],
  },
};

export default function () {
  const baseUrl = __ENV.FRONTEND_URL;

  const res = http.get(`${baseUrl}/health.json`);

  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'k6_summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';