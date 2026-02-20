# Performance Tests

This directory contains end-to-end performance tests for measuring key performance metrics of the Life OS application.

## Prerequisites

Before running performance tests, ensure you have:
1. A running database (local or remote)
2. Environment variables configured (`.env` file)
3. Installed dependencies: `npm install`

## Quick Start

### 1. Seed Performance Test Data

First, populate the database with a realistic large dataset:

```bash
npm run test:seed-perf-data
```

This will create:
- 1 test user (`test@life-os.app` / `TestPass123!`)
- 1,000 tasks
- 10 habits with 365 days of logged data each (3,650 habit logs)

### 2. Run Performance Tests

After seeding the data, run the performance tests:

```bash
npm run test:perf
```

Or run specific test files:

```bash
npm run test:e2e -- tests/performance/dashboard-load.test.ts
```

## Test Descriptions

### Dashboard Load Test (`dashboard-load.test.ts`)

Measures dashboard loading performance under realistic conditions:

- **Dashboard Load Time**: Verifies dashboard loads within 2 seconds
- **Scroll Performance**: Ensures smooth scrolling through task lists
- **Habits Page Performance**: Tests habits page rendering speed

## Performance Targets

Based on the performance optimization requirements:

| Metric | Target | Test |
|--------|--------|------|
| Dashboard Load Time | < 2000ms | ✅ Dashboard load test |
| Scroll Performance | < 1500ms | ✅ Scroll test |
| Habits Page Load | < 1500ms | ✅ Habits page test |

## CI/CD Integration

In CI/CD environments:

1. Seed performance data as part of the test setup
2. Run performance tests on every PR
3. Fail builds if performance degrades beyond thresholds

## Troubleshooting

### Tests fail with "User not found"

Run the seed script to create the test user and data:
```bash
npm run test:seed-perf-data
```

### Tests timeout

Check that:
- Backend server is running: `npm run server:dev`
- Frontend server is running: `npm run client:dev`
- Database is accessible

### Performance is slow

This could indicate:
- Missing database indexes (check Phase 1 migrations)
- Caching not working (check Phase 2 implementation)
- Pagination not implemented (check Phase 3 implementation)

## Maintenance

When adding new performance tests:

1. Follow the existing test structure
2. Add clear performance assertions with measurable thresholds
3. Update this README with new test descriptions
4. Consider adding seed data generation if testing with large datasets
