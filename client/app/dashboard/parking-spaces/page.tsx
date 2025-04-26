"use client";

import { useEffect, useState } from "react";
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

// Mock data for parking spaces
const initialParkingSpaces = [
  {
    space_id: 1,
    space_address: "123 Main St, Downtown",
    space_type: "Covered",
    mngr_id: 1,
    manager_name: "John Doe",
    total_spots: 45,
    available_spots: 13,
    hourly_rate: 2.5,
  },
];

export default function ParkingSpacesPage() {
  const [parkingSpaces, setParkingSpaces] = useState(initialParkingSpaces);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = await services.parkingServices.getAllParkingSpaces();
        setParkingSpaces(response.data.spaces);
      } catch (error) {
        console.error("Error fetching parking spaces:", error);
        toast({
          title: "Error",
          description: "Failed to fetch parking spaces.",
          variant: "destructive",
        });
      }
    })();
  }, []);

  const filteredSpaces = parkingSpaces.filter(
    (space) =>
      space?.space_address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space?.space_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      space?.manager_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (spaceId: number) => {
    setParkingSpaces(
      parkingSpaces.filter((space) => space.space_id !== spaceId)
    );
    toast({
      title: "Parking space deleted",
      description: "The parking space has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Parking Spaces</h2>
          <p className="text-muted-foreground">Manage your parking spaces</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/parking-spaces/new">
            <Plus className="mr-2 h-4 w-4" /> Add Parking Space
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parking Spaces</CardTitle>
          <CardDescription>
            View and manage all your parking spaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search parking spaces..."
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
                  <TableHead>Address</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Spots</TableHead>
                  <TableHead>Hourly Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpaces.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No parking spaces found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSpaces.map((space) => (
                    <TableRow key={space.space_id}>
                      <TableCell>{space.space_id}</TableCell>
                      <TableCell>{space.space_address}</TableCell>
                      <TableCell>{space.space_type}</TableCell>
                      <TableCell>{space.manager_name}</TableCell>
                      <TableCell>
                        {space.available_spots}/{space.total_spots}
                      </TableCell>
                      <TableCell>${space?.hourly_rate}/hr</TableCell>
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
                                href={`/dashboard/parking-spaces/${space.space_id}`}
                              >
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/parking-spaces/${space.space_id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(space.space_id)}
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
