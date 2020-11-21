function getFetchUrl(args) {
  return args.endpoint + (args.query ? `?${args.query}` : '');
}

function getFetchArgs(args) {
  const headers = {};
  if (!args.attachment) {
    headers['Content-Type'] = 'application/json';
    headers.Accept = 'application/json, text/plain, */*'; //'application/json';
  }
  let body;
  if (args.request) body = JSON.stringify(args.request);
  return {
    method: args.type,
    headers,
    signal: args.ct,
    ...(args.request === 'GET' ? {} : { body })
  };
}

export async function callWebApi(args) {
  try {
    const res = await fetch(
      getFetchUrl(args),
      getFetchArgs(args)
    );
    return res.json();
  } catch (error) {
    return { status: 404, message: error };
  }
}
