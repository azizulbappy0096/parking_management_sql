import axios from "@/lib/axios";

const generalService = {
  getDrivers: async () => {
    const res = await axios({
      method: "get",
      url: "/general/drivers",
    });

    return res.data;
  },

  getDriverByPhone: async (phone) => {
    const res = await axios({
      method: "get",
      url: `/general/drivers/${phone}`,
    });

    return res.data;
  },

  getVehicles: async () => {
    const res = await axios({
      method: "get",
      url: "/general/vehicles",
    });

    return res.data;
  },

  getVehicleByPlate: async (plate) => {
    const res = await axios({
      method: "get",
      url: `/general/vehicles/${plate}`,
    });

    return res.data;
  },
};

export default generalService;
