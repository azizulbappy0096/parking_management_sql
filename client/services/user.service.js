import axios from "@/lib/axios";

const userServices = {
  getAllManager: async () => {
    const res = await axios({
      method: "get",
      url: "/users/managers",
    });

    return res.data;
  },
};

export default userServices;
