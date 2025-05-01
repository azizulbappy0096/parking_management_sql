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

// Initial mock data for slips
const initialSlips = [
  {
    slip_id: 1,
    ve_numberplate: "A1",
    driver_name: "123",
    driver_phone: "1234567890",
    spot_name: "Spot A",
    space_type: "Downtown Garage",
    total_amount: "123",
  },
];

export default function SlipsPage() {
  const [slips, setSlips] = useState(initialSlips);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const response = await services.slipServices.getAllPSlips();
        setSlips(response.data.slips);
      } catch (error) {
        console.error("Error fetching slips:", error);
        toast({
          title: "Error",
          description: "Failed to fetch slips.",
          variant: "destructive",
        });
      }
    })();
  }, []);

  const filteredSlips = slips.filter(
    (slip) =>
      slip.spot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slip.space_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slip.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slip.ve_numberplate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (slipId: number) => {
    toast({
      title: "Slip deleted",
      description: "The slip has been successfully deleted.",
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
          <h2 className="text-3xl font-bold tracking-tight">Slips</h2>
          <p className="text-muted-foreground">Manage your slips</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/slips/new">
            <Plus className="mr-2 h-4 w-4" /> Add Slip
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Slips</CardTitle>
          <CardDescription>View and manage all your slips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search slips..."
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
                  <TableHead>Number Plate</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Driver Phone</TableHead>
                  <TableHead>Spot Name</TableHead>
                  <TableHead>Space Type</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSlips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No slips found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSlips.map((slip) => (
                    <TableRow key={slip.slip_id}>
                      <TableCell>{slip.slip_id}</TableCell>
                      <TableCell>{slip.ve_numberplate}</TableCell>
                      <TableCell>{slip.driver_name}</TableCell>
                      <TableCell>{slip.driver_phone}</TableCell>
                      <TableCell>{slip.spot_name}</TableCell>
                      <TableCell>{slip.space_type}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}
                        >
                          {slip.total_amount}
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
                              <Link href={`/dashboard/slips/${slip.slip_id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/slips/${slip.slip_id}/edit`}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(slip.slip_id)}
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
