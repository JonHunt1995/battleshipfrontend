// This catches any request starting with /api/
export const onRequest: PagesFunction<{ BACKEND_URL: string }> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const originalHost = url.hostname;
  console.log(originalHost, url.pathname, url.search);

  // 1. Construct the destination URL
  // This takes the path (e.g., /api/users) and appends it to your Go backend URL
  const backendTarget = new URL(url.pathname + url.search, env.BACKEND_URL);
  const newHeaders = new Headers(request.headers);
  newHeaders.set('X-Original-Host', originalHost);
  newHeaders.set('X-Forwarded-Proto', 'https');
  newHeaders.set('Host', backendTarget.hostname);

  // 2. Clone the request but point it to the Go backend
  const proxyRequest = new Request(backendTarget, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    redirect: 'manual',
  });

  // 3. Fetch from the Go backend and return the response
  try {
    return await fetch(proxyRequest);
  } catch (e) {
    return new Response("Backend unreachable", { status: 502 });
  }
};