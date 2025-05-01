"use client";

import { useState, useEffect } from "react";
import services from "@/services";
import Link from "next/link";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const initialVehicles = [
  {
    ve_numberplate: "Ab-1",
    ve_type: "car",
    driver_id: 1,
  },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = await services.generalServices.getVehicles();
        setVehicles(response.data.vehicles);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast({
          title: "Error",
          description: "Failed to fetch vehicles.",
          variant: "destructive",
        });
      }
    })();
  }, []);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.ve_numberplate
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vehicle.ve_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver_id.toString().includes(searchQuery)
  );

  const handleDelete = (numberPlate: string) => {
    setVehicles(vehicles.filter((v) => v.ve_numberplate !== numberPlate));
    toast({
      title: "Vehicle deleted",
      description: "The vehicle has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
          <p className="text-muted-foreground">Manage your vehicles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
          <CardDescription>View and manage all your vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number Plate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Driver ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No vehicles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.ve_numberplate}>
                      <TableCell>{vehicle.ve_numberplate}</TableCell>
                      <TableCell>{vehicle.ve_type}</TableCell>
                      <TableCell>{vehicle.driver_id}</TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
