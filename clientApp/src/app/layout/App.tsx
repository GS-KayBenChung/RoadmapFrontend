import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { useStore } from '../stores/store';

export default observer (function App() {
  const { userStore } = useStore();

  if (!userStore.isLoggedIn && userStore.token) {
    userStore.loadUserFromLocalStorage();
  }

  return <Outlet />;
})