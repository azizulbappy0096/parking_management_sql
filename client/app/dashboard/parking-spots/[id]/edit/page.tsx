"use client";
import services from "@/services";
import { useState, useEffect } from "react";
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
import { toast } from "react-toastify"; // Import react-toastify's toast

const statusOptions = ["available", "cccupied", "maintenance"];

export default function EditParkingSpotPage({
  params,
}: {
  params: { id: string };
}) {
  const [formData, setFormData] = useState({
    spot_name: "",
    space_id: "",
    status: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();
  const spotId = Number.parseInt(params.id);

  const [parkingSpaces, setParkingSpaces] = useState<
    {
      space_id: number;
      space_address: string;
      space_type: string;
      mngr_id: number;
      manager_name: string;
      total_spots: number;
      available_spots: number;
      hourly_rate: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, spaceRes] = await Promise.all([
          services.parkingServices.getParkingSpotById(spotId),
          services.parkingServices.getAllParkingSpaces(),
        ]);

        setParkingSpaces(spaceRes.data.spaces);
        const spot = res.data.spot;

        if (spot) {
          setFormData({
            spot_name: spot.spot_name,
            space_id: spot.space_id.toString(),
            status: spot.status,
          });
        } else {
          toast.error("The requested parking spot could not be found."); // Show error toast
          router.push("/dashboard/parking-spots");
        }
      } catch (error) {
        toast.error("An error occurred while loading the parking spot data."); // Show error toast
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [spotId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let data = {
        spot_name: formData.spot_name,
        space_id: +formData.space_id,
        spot_status: formData.status,
      };
      await services.parkingServices.updateParkingSpot(spotId, data);

      toast.success("The parking spot has been successfully updated."); // Show success toast

      router.push("/dashboard/parking-spots");
    } catch (error) {
      toast.error("An error occurred while updating the parking spot."); // Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p>Loading parking spot data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Parking Spot</h2>
        <p className="text-muted-foreground">
          Update the details of parking spot #{spotId}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Parking Spot Details</CardTitle>
            <CardDescription>
              Edit the details for this parking spot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spot_name">Spot Name</Label>
              <Input
                id="spot_name"
                name="spot_name"
                value={formData.spot_name}
                onChange={handleChange}
                placeholder="A1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="space_id">Parking Space</Label>
              <Select
                value={formData.space_id}
                onValueChange={(value) => handleSelectChange("space_id", value)}
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
                      {space.space_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isLoading ? "Updating..." : "Update Parking Spot"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
