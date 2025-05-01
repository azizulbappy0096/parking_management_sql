"use client";

import type React from "react";
import services from "@/services";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GenerateSlipPage() {
  const [formData, setFormData] = useState({
    vehicle_plate: "",
    driver_name: "",
    driver_phone: "",
    parking_space: "",
    parking_spot: "",
    duration: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSlip, setGeneratedSlip] = useState<any>(null);
  const router = useRouter();

  const [parkingSpaces, setParkingSpaces] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await services.parkingServices.getAllParkingSpaces();
        setParkingSpaces(response.data.spaces);
      } catch (error) {
        console.error("Error fetching parking spaces:", error);
        toast.error("Failed to fetch parking spaces.");
      }
    })();
  }, []);

  // Mock data for parking spots (filtered by selected space)
  const getParkingSpots = async (spaceId: string) => {
    try {
      const response = await services.parkingServices.getParkingSpotsBySpaceId(
        spaceId
      );
      return response.data.spots;
    } catch (err) {
      console.error("Error fetching parking spots:", err);
      toast.error("Failed to fetch parking spots.");
      return [];
    }
  };

  const [availableSpots, setAvailableSpots] = useState([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "vehicle_plate") {
      let res = await services.generalServices.getVehicleByPlate(value);
      if (res.data.vehicle) {
        setFormData((prev) => ({
          ...prev,
          vehicle_plate: res.data.vehicle.ve_numberplate,
          driver_name: res.data.vehicle.driver_name,
          driver_phone: res.data.vehicle.phone_num,
        }));

        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = async (name: string, value: string) => {
    if (name === "parking_space") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        parking_spot: "", // Reset spot when space changes
      }));
      setAvailableSpots(await getParkingSpots(value));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let slipData = {
        type: "temporary",
        duration: formData.duration,
        veh_nameplate: formData.vehicle_plate,
        spot_id: +formData.parking_spot,
      };
      const res = await services.slipServices.checkin(slipData);

      const selectedSpace = parkingSpaces.find(
        (space) => space.space_id.toString() === formData.parking_space
      );
      const selectedSpot = availableSpots.find(
        (spot) => spot.spot_id.toString() === formData.parking_spot
      );

      const slip = {
        slip_id: res.data.slip.slip_id,
        vehicle_plate: formData.vehicle_plate,
        driver_name: formData.driver_name,
        driver_phone: formData.driver_phone,
        parking_space: selectedSpace?.space_name,
        parking_spot: selectedSpot?.spot_name,
        hourly_rate: selectedSpace?.hourly_rate,
        duration: formData.duration,
      };

      setGeneratedSlip(slip);

      toast.success("Slip generated successfully!");
    } catch (error) {
      console.error("Error generating slip:", error);
      toast.error("Failed to generate slip.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSlip = () => {
    setGeneratedSlip(null);
    setFormData({
      vehicle_plate: "",
      driver_name: "",
      driver_phone: "",
      parking_space: "",
      parking_spot: "",
      duration: 1,
    });
    setAvailableSpots([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Generate Parking Slip
        </h2>
        <p className="text-muted-foreground">
          Create a new parking slip for a vehicle
        </p>
      </div>

      {generatedSlip ? (
        <div className="space-y-6">
          <Card className="print:shadow-none">
            <CardHeader className="border-b">
              <CardTitle className="text-center text-2xl">
                PARKING SLIP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold">ParkEase</h3>
                <p className="text-sm text-muted-foreground">
                  Your Parking Management Solution
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Slip #
                    </p>
                    <p>{generatedSlip.slip_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Generated
                    </p>
                    <p>{generatedSlip.generated_at}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        License Plate
                      </p>
                      <p>{generatedSlip.vehicle_plate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Driver Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Name
                      </p>
                      <p>{generatedSlip.driver_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Phone
                      </p>
                      <p>{generatedSlip.driver_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Parking Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Parking Space
                      </p>
                      <p>{generatedSlip.parking_space}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Spot
                      </p>
                      <p>{generatedSlip.parking_spot}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Entry Time
                      </p>
                      <p>{generatedSlip.entry_time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Hourly Rate
                      </p>
                      <p>${(+generatedSlip.hourly_rate).toFixed(2)}/hr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 text-center">
                <p className="text-sm">
                  Thank you for using our parking service!
                </p>
                <p className="text-xs text-muted-foreground">
                  Please keep this slip for reference.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center space-x-4 print:hidden">
            <Button variant="outline" onClick={handleNewSlip}>
              Generate New Slip
            </Button>
            <Button onClick={handlePrint}>Print Slip</Button>
          </div>
        </div>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Slip Details</CardTitle>
              <CardDescription>
                Enter the details for the new parking slip
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle_plate">Vehicle License Plate</Label>
                <Input
                  id="vehicle_plate"
                  name="vehicle_plate"
                  value={formData.vehicle_plate}
                  onChange={handleChange}
                  placeholder="ABC123"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver_name">Driver Name</Label>
                <Input
                  id="driver_name"
                  name="driver_name"
                  value={formData.driver_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver_phone">Driver Phone</Label>
                <Input
                  id="driver_phone"
                  name="driver_phone"
                  value={formData.driver_phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking_space">Parking Space</Label>
                <Select
                  value={formData.parking_space}
                  onValueChange={(value) =>
                    handleSelectChange("parking_space", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking space" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingSpaces.map((space) => (
                      <SelectItem
                        key={space.space_id}
                        value={space.space_id.toString()}
                      >
                        {space.space_type} (${(+space.hourly_rate).toFixed(2)}
                        /hr)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking_spot">Parking Spot</Label>
                <Select
                  value={formData.parking_spot}
                  onValueChange={(value) =>
                    handleSelectChange("parking_spot", value)
                  }
                  disabled={!formData.parking_space}
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        formData.parking_space
                          ? "Select parking spot"
                          : "Select a parking space first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpots.map((spot) => (
                      <SelectItem
                        key={spot.spot_id}
                        value={spot.spot_id.toString()}
                      >
                        {spot.spot_name} ({spot.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Generating..." : "Generate Slip"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
