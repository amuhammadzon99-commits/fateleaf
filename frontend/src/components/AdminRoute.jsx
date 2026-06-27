import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo && userInfo.role === 'admin') {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
