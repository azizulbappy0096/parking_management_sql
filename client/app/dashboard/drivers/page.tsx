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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialDrivers = [
  {
    driver_id: 1,
    driver_name: "Kuddus",
    phone_num: "12345",
    driver_address: "",
  },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await services.generalServices.getDrivers();
        console.log("Fetched drivers:", response.data.drivers);
        setDrivers(response.data.drivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Failed to fetch drivers.");
      }
    })();
  }, []);

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.phone_num.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driver_address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (driverId: number) => {
    setDrivers(drivers.filter((driver) => driver.driver_id !== driverId));
    toast.success("The driver has been successfully deleted.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Drivers</h2>
          <p className="text-muted-foreground">Manage your drivers</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
          <CardDescription>View and manage all drivers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search drivers..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No drivers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDrivers.map((driver) => (
                    <TableRow key={driver.driver_id}>
                      <TableCell>{driver.driver_id}</TableCell>
                      <TableCell>{driver.driver_name}</TableCell>
                      <TableCell>{driver.phone_num}</TableCell>
                      <TableCell>{driver.driver_address || "-"}</TableCell>
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
