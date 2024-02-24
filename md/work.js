addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method === "POST") {
    return event.respondWith(WriteJSON(request));
  } else if (request.method === "GET") {
    return event.respondWith(ReadJSON(request));
  } else if (request.method === "PUT") {
    return event.respondWith(UpdateJSON(request));
  } else if (request.method === "DELETE") {
    return event.respondWith(DeleteJSON(request));
  } else if (request.method === "OPTIONS") {
    return event.respondWith(handleOptions(request));
  } else {
    return fetch("https://http.cat/500");
  }
});

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  }
}

async function ReadJSON(request) {
  const { pathname } = new URL(request.url);

  if (pathname === "/all") {
    const keys = await JSONBASE.list();
    const results = {};

    for (const key of keys.keys) {
      const value = await JSONBASE.get(key.name);
      results[key.name] = value;
    }

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400"
      },
    });
  } else {
    const value = await JSONBASE.get(pathname);
    if (value === null) {
      return fetch("https://http.cat/404");
    }
    return new Response(JSON.stringify(value),{
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400"
      },
    });
  }
}

async function WriteJSON(request) {
  const { pathname } = new URL(request.url);
  const Body = await gatherResponse(request);
  await JSONBASE.put(pathname, Body);
  return new Response(JSON.stringify({ Body }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    },
  });
}

async function UpdateJSON(request) {
  const { pathname } = new URL(request.url);
  const Body = await gatherResponse(request);
  const existingValue = await JSONBASE.get(pathname);
  //const updatedValue = existingValue ? existingValue + Body : Body;
  const updatedValue = existingValue ? Body + existingValue : Body;
  await JSONBASE.put(pathname, updatedValue);
  return new Response(JSON.stringify({ Body: updatedValue }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    },
  });
}

async function DeleteJSON(request) {
  const { pathname } = new URL(request.url);
  await JSONBASE.delete(pathname);
  return new Response(JSON.stringify({ message: "Resource deleted successfully" }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    },
  });
}

async function handleOptions(request) {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    }
  });
}
//用于json kv跨域数据库请求
