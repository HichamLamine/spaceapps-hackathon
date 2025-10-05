import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div
      className="h-screen bg-cover bg-center bg-no-repeat font-poppins flex flex-col items-center justify-center gap-5"
      style={{ backgroundImage: `url('background.jpeg')` }}
    >
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-5xl text-center">YOUR JOURNEY</h1>
        <h1 className="font-bold text-7xl text-center">TO THE CLOUD</h1>
        <h1 className="font-bold text-5xl text-center">BEGINS HERE</h1>
      </div>

      <button
        className="font-bold text-3xl bg-[#0087FD] rounded-full px-5 py-2 shadow-black shadow-xl z-10"
        onClick={() => navigate("/dashboard")}
      >
        GET STARTED
      </button>
    </div>
  );
}
