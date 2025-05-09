import axios from "@/lib/axios";

const userServices = {
  getAllManager: async () => {
    const res = await axios({
      method: "get",
      url: "/users/managers",
    });

    return res.data;
  },
  login: async (data) => {
    const res = await axios({
      method: "post",
      url: "/users/login",
      data,
    });

    return res.data;
  },
};

export default userServices;
