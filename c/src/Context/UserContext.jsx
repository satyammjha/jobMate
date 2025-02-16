import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async (email) => {
        console.log("Fetching user data...");
        try {
            const response = await axios.get(`http://localhost:5000/data/fetchuserdata/${email}`);
            setUserData(response.data);
            console.log("User data:", response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userData, fetchUserData, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export default function useUserData() {
    return useContext(UserContext);
}