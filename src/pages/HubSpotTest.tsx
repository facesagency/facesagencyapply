import HubSpotDebug from "@/components/HubSpotDebug";

export default function HubSpotTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">HubSpot Integration Test</h1>
        <HubSpotDebug />
      </div>
    </div>
  );
}
