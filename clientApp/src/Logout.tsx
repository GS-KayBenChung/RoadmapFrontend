import { useStore } from "./store";


export default function LogoutButton() {
  const { userStore } = useStore();

  return (
    <button
      onClick={() => userStore.logout()}
      className="bg-red-500 text-white px-4 py-2 rounded-full"
    >
      Logout
    </button>
  );
}
