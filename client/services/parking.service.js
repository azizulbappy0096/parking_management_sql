import axios from "@/lib/axios";

const parkingService = {
  getAllParkingSpaces: async () => {
    const res = await axios({
      method: "get",
      url: "/parking/spaces",
    });

    return res.data;
  },
  createParkingSpace: async (data) => {
    const res = await axios({
      method: "post",
      url: "/parking/spaces/create",
      data,
    });

    return res.data;
  },

  getAllParkingSpots: async () => {
    const res = await axios({
      method: "get",
      url: "/parking/spots",
    });

    return res.data;
  },
  createParkingSpot: async (data) => {
    const res = await axios({
      method: "post",
      url: "/parking/spots/create",
      data,
    });

    return res.data;
  },
};

export default parkingService;
