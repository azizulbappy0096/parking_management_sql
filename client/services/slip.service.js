import axios from "@/lib/axios";

const slipService = {
  getAllPSlips: async (params) => {
    const res = await axios({
      method: "get",
      url: "/slips",
      params,
    });

    return res.data;
  },
  checkin: async (data) => {
    const res = await axios({
      method: "post",
      url: "/slips//create",
      data,
    });

    return res.data;
  },
};

export default slipService;
