"use client";

import type React from "react";
import services from "@/services";
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
import { toast } from "react-toastify";

export default function EditParkingSpacePage({
  params,
}: {
  params: { id: string };
}) {
  const [formData, setFormData] = useState({
    space_address: "",
    space_type: "",
    mngr_id: "",
    hourly_rate: "",
  });

  const [managers, setManagers] = useState<{ user_id: number; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const router = useRouter();
  const spaceId = Number(params.id);

  const spaceTypes = ["east_side", "west_side", "north_side", "south_side"];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [spaceRes, managersRes] = await Promise.all([
          services.parkingServices.getParkingSpaceById(spaceId),
          services.userServices.getAllManager(),
        ]);

        const space = spaceRes.data.space;
        setFormData({
          space_address: space.space_address || "",
          space_type: space.space_type || "",
          mngr_id: String(space.mngr_id || ""),
          hourly_rate: String(space.hourly_rate || ""),
        });

        setManagers(managersRes.data.managers);
      } catch (error) {
        toast.error("Error loading data");
        router.push("/dashboard/parking-spaces");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitialData();
  }, [spaceId, router]);

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
      await services.parkingServices.updateParkingSpace(spaceId, formData);

      toast.success("Parking space updated successfully.");
      router.push("/dashboard/parking-spaces");
    } catch (error) {
      toast.error("Could not update the parking space.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p>Loading parking space data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Edit Parking Space
        </h2>
        <p className="text-muted-foreground">
          Update the details of parking space #{spaceId}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Parking Space Details</CardTitle>
            <CardDescription>
              Edit the details for this parking space
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="space_address">Address</Label>
              <Input
                id="space_address"
                name="space_address"
                value={formData.space_address}
                onChange={handleChange}
                placeholder="123 Main St, City, State"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="space_type">Space Type</Label>
              <Select
                value={formData.space_type}
                onValueChange={(value) =>
                  handleSelectChange("space_type", value)
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select space type" />
                </SelectTrigger>
                <SelectContent>
                  {spaceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mngr_id">Manager</Label>
              <Select
                value={formData.mngr_id}
                onValueChange={(value) => handleSelectChange("mngr_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem
                      key={manager.user_id}
                      value={manager.user_id.toString()}
                    >
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                step="0.01"
                min="0"
                value={formData.hourly_rate}
                onChange={handleChange}
                placeholder="2.50"
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
              {isLoading ? "Updating..." : "Update Parking Space"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
