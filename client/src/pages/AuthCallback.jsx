import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useToast } from "@chakra-ui/toast";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";
import { setCartId } from "../slices/cartSlice";
import { BASEAPI } from "../utils/BASE_API";

const AuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(`${BASEAPI}/user/get-tokens`, {
          withCredentials: true, // Ensure cookies are sent with the request
        });
        console.log("Response:", response);

        if (response.status === 200) {
          const { access_token, refresh_token, cart_id, user_details } =
            response.data;

          const user = {
            ...user_details,
            profile_picture:
              user_details.profile_picture ||
              `https://api.dicebear.com/5.x/initials/svg?seed=${user_details.first_name} ${user_details.last_name}`,
          };

          // Dispatch to redux store if needed
          dispatch(setToken(access_token));
          dispatch(setUser(user));
          dispatch(setCartId(cart_id));

          toast({
            title: "Login successful!",
            status: "success",
            duration: 2500,
            isClosable: true,
          });

          // Redirect to home or dashboard
          navigate("/");
        } else {
          toast({
            title: "Login failed",
            description: "Unable to fetch tokens.",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tokens.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
        navigate("/signin");
      }
    };

    fetchTokens();
  }, [navigate, dispatch, toast]);

  return <div>Loading...</div>;
};

export default AuthCallback;
