import axios from "axios"
import useUserData from "../Context/UserContext";

const { email } = useUserData();
const consumeCredit = async (action) => {
    try {
        const response = await axios.post("http:5000//localhost/credit", {
            email: email,
            action: action
        });
        return response;

    }
    catch (e) {
        return e;
    }
}

export default consumeCredit;