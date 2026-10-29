/** 极简 HTTP 封装：超时、错误归一、可选 JSON 解析。没有重试——重试策略放在调用方，便于分开处理限流。 */
export async function request(url, opts = {}) {
  const { method = 'GET', timeout = 15000, headers = {}, wantJson = false } = opts;
  const signal = AbortSignal.timeout(timeout);
  try {
    const res = await fetch(url, { method, headers, redirect: 'follow', signal });
    let json = null;
    if (wantJson) {
      const text = await res.text();
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    } else {
      await res.body?.cancel();
    }
    return { ok: true, status: res.status, json };
  } catch (err) {
    const reason =
      err.name === 'TimeoutError' || err.name === 'AbortError'
        ? 'timeout'
        : err.cause?.code === 'ENOTFOUND'
          ? 'dns'
          : (err.cause?.code ?? err.message);
    return { ok: false, status: 0, error: String(reason) };
  }
}

/** 简单并发池：一次最多 size 个任务，保持结果顺序。 */
export async function pool(items, size, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
