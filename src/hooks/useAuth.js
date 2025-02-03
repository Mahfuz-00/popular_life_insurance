import { useDispatch, useSelector } from 'react-redux';
export default function useAuth() {
    const { user } = useSelector((state) => state.auth);  
    return {
        user
    };
  }