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
import { useToast } from "@/hooks/use-toast";

export default function NewParkingSpotPage() {
  const [formData, setFormData] = useState({
    spot_name: "",
    space_id: "",
    status: "Available",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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

  // Status options
  const statusOptions = ["available", "occupied", "out_of_service"];

  useEffect(() => {
    (async () => {
      try {
        const response = await services.parkingServices.getAllParkingSpaces();
        setParkingSpaces(response.data.spaces);
      } catch (error) {
        console.error("Error fetching managers:", error);
        toast({
          title: "Error",
          description: "Failed to fetch managers.",
          variant: "destructive",
        });
      }
    })();
  }, []);

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
      const res = await services.parkingServices.createParkingSpot(formData);

      toast({
        title: "Parking spot created",
        description: "The parking spot has been successfully created.",
      });

      router.push("/dashboard/parking-spots");
    } catch (error) {
      toast({
        title: "Failed to create parking spot",
        description: "An error occurred while creating the parking spot.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Add Parking Spot</h2>
        <p className="text-muted-foreground">
          Create a new parking spot in the system
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Parking Spot Details</CardTitle>
            <CardDescription>
              Enter the details for the new parking spot
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
              {isLoading ? "Creating..." : "Create Parking Spot"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
