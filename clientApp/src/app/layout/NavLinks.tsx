export default function NavLinks() {
  return (
    <>
        <a href="/dashboard" className="hover:text-black font-bold">
            Dashboard
        </a>
        <a href="/roadmaps" className="hover:text-black font-bold">
            Roadmaps
        </a>
        <a href="/logs" className="hover:text-black font-bold">
            Logs
        </a>
        <button className="bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800">Log Out</button>
    </>
  );
}