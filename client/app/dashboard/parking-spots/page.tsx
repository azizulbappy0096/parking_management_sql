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

// Mock data for parking spots
const initialParkingSpots = [
  {
    spot_id: 1,
    spot_name: "A1",
    space_id: 1,
    space_type: "Downtown Garage",
    status: "Available",
  },
];

export default function ParkingSpotsPage() {
  const [parkingSpots, setParkingSpots] = useState(initialParkingSpots);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = await services.parkingServices.getAllParkingSpots();
        setParkingSpots(response.data.spots);
      } catch (error) {
        console.error("Error fetching parking spots:", error);
        toast({
          title: "Error",
          description: "Failed to fetch parking spots.",
          variant: "destructive",
        });
      }
    })();
  }, []);

  const filteredSpots = parkingSpots.filter(
    (spot) =>
      spot.spot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.space_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spot.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (spotId: number) => {
    setParkingSpots(parkingSpots.filter((spot) => spot.spot_id !== spotId));
    toast({
      title: "Parking spot deleted",
      description: "The parking spot has been successfully deleted.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parking Spots</h2>
          <p className="text-muted-foreground">Manage your parking spots</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/parking-spots/new">
            <Plus className="mr-2 h-4 w-4" /> Add Parking Spot
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parking Spots</CardTitle>
          <CardDescription>
            View and manage all your parking spots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search parking spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Spot Name</TableHead>
                  <TableHead>Parking Space</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No parking spots found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpots.map((spot) => (
                    <TableRow key={spot.spot_id}>
                      <TableCell>{spot.spot_id}</TableCell>
                      <TableCell>{spot.spot_name}</TableCell>
                      <TableCell>{spot.space_type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            spot.status
                          )}`}
                        >
                          {spot.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/parking-spots/${spot.spot_id}`}
                              >
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/parking-spots/${spot.spot_id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(spot.spot_id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
