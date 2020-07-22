Run

```
npm i # first time only
node index.js
```

Returns

```
{
  no_docs: { totalCount: 5 },
  done: { totalCount: 36, totalDays: 1640, tatAvg: 45.55555555555556 },
  processed: { totalCount: 1 },
  rejected: { totalCount: 2 },
  appealing: { totalCount: 1 },
  abandoned: { totalCount: 2 },
  partial: { totalCount: 3 }
}
```

Note

- Quick and dirty test run to play with the API
- Not yet paging through responses, so this is just the first 50 results returned
