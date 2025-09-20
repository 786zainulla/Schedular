export async function GET(request) {
  console.log('Zain')
  return new Response(JSON.stringify({ message: "Zain Testing Static API!" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} 