import Sidemenu from "@/components/sidemenu";

export default function AboutPage() {
  return (
    <div className="flex">
      <Sidemenu />
      <main className="flex-1 flex items-center justify-center p-8 text-gray-900">
        <div className="max-w-3xl grid gap-6 text-center">
          <h1 className="text-4xl font-bold text-[#0087FD]">
            Earth Data to Action
          </h1>
          <p className="text-lg text-gray-700">
            We built a hackathon project using NASA’s Earth Data to Action dataset
            to visualize pollution effects on our planet.
          </p>
          <p className="text-gray-600">
            Our goal is simple: transform satellite and environmental data into
            actionable insights that help us understand and reduce pollution’s
            impact on Earth.
          </p>
        </div>
      </main>
    </div>
  );
}
