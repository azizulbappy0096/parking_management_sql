import axios from "@/lib/axios";

const parkingService = {
  getParkingSpaceById: async (id) => {
    const res = await axios({
      method: "get",
      url: "/parking/spaces/" + id,
    });

    return res.data;
  },
  getAllParkingSpaces: async (params) => {
    const res = await axios({
      method: "get",
      url: "/parking/spaces",
      params,
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
  updateParkingSpace: async (id, data) => {
    const res = await axios({
      method: "put",
      url: `/parking/spaces/${id}`,
      data,
    });

    return res.data;
  },

  getAllParkingSpots: async (params) => {
    const res = await axios({
      method: "get",
      url: "/parking/spots",
      params,
    });

    return res.data;
  },
  getParkingSpotsBySpaceId: async (spaceId) => {
    const res = await axios({
      method: "get",
      url: `/parking/spaces/${spaceId}/spots`,
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

  getParkingSpotById: async (id) => {
    const res = await axios({
      method: "get",
      url: "/parking/spots/" + id,
    });

    return res.data;
  },

  updateParkingSpot: async (id, data) => {
    const res = await axios({
      method: "put",
      url: `/parking/spots/${id}`,
      data,
    });

    return res.data;
  },

  deleteParkingSpaceById: async (id) => {
    const res = await axios({
      method: "delete",
      url: `/parking/spaces/${id}`,
    });

    return res.data;
  },
  deleteParkingSpotById: async (id) => {
    const res = await axios({
      method: "delete",
      url: `/parking/spots/${id}`,
    });

    return res.data;
  },
};

export default parkingService;
