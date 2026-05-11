import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/token";

type Props = { children: React.ReactNode };

export function RequireAuth({ children }: Props) {
    const token = getAccessToken();
    const location = useLocation();

    if(!token) {
        return <Navigate to="/login" replace state={{from: location.pathname}}></Navigate>
    }
    return <>{children}</>
}