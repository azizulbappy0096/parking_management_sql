"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function GenerateSlipPage() {
  const [formData, setFormData] = useState({
    vehicle_plate: "",
    driver_name: "",
    driver_phone: "",
    parking_space: "",
    parking_spot: "",
    entry_time: new Date().toISOString().slice(0, 16),
  })
  const [isLoading, setIsLoading] = useState(false)
  const [generatedSlip, setGeneratedSlip] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Mock data for parking spaces
  const parkingSpaces = [
    { space_id: 1, space_name: "Downtown Garage", hourly_rate: 2.5 },
    { space_id: 2, space_name: "Mall Parking", hourly_rate: 3.0 },
    { space_id: 3, space_name: "Office Complex", hourly_rate: 2.75 },
  ]

  // Mock data for parking spots (filtered by selected space)
  const getParkingSpots = (spaceId: string) => {
    const spotsBySpace = {
      "1": [
        { spot_id: 1, spot_name: "A1", status: "Available" },
        { spot_id: 2, spot_name: "A2", status: "Available" },
        { spot_id: 3, spot_name: "B1", status: "Available" },
      ],
      "2": [
        { spot_id: 4, spot_name: "C1", status: "Available" },
        { spot_id: 5, spot_name: "C2", status: "Available" },
      ],
      "3": [
        { spot_id: 6, spot_name: "D1", status: "Available" },
        { spot_id: 7, spot_name: "D2", status: "Available" },
      ],
    }
    return spotsBySpace[spaceId] || []
  }

  const [availableSpots, setAvailableSpots] = useState([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "parking_space") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        parking_spot: "", // Reset spot when space changes
      }))
      setAvailableSpots(getParkingSpots(value))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, you would make an API call to generate the slip
      // For demo purposes, we'll simulate a successful generation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const selectedSpace = parkingSpaces.find((space) => space.space_id.toString() === formData.parking_space)
      const selectedSpot = availableSpots.find((spot) => spot.spot_id.toString() === formData.parking_spot)

      const slip = {
        slip_id: Math.floor(Math.random() * 10000),
        vehicle_plate: formData.vehicle_plate,
        driver_name: formData.driver_name,
        driver_phone: formData.driver_phone,
        parking_space: selectedSpace?.space_name,
        parking_spot: selectedSpot?.spot_name,
        entry_time: new Date(formData.entry_time).toLocaleString(),
        hourly_rate: selectedSpace?.hourly_rate,
        generated_at: new Date().toLocaleString(),
      }

      setGeneratedSlip(slip)

      toast({
        title: "Slip generated",
        description: "The parking slip has been successfully generated.",
      })
    } catch (error) {
      toast({
        title: "Failed to generate slip",
        description: "An error occurred while generating the parking slip.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNewSlip = () => {
    setGeneratedSlip(null)
    setFormData({
      vehicle_plate: "",
      driver_name: "",
      driver_phone: "",
      parking_space: "",
      parking_spot: "",
      entry_time: new Date().toISOString().slice(0, 16),
    })
    setAvailableSpots([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Generate Parking Slip</h2>
        <p className="text-muted-foreground">Create a new parking slip for a vehicle</p>
      </div>

      {generatedSlip ? (
        <div className="space-y-6">
          <Card className="print:shadow-none">
            <CardHeader className="border-b">
              <CardTitle className="text-center text-2xl">PARKING SLIP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-1 text-center">
                <h3 className="text-xl font-bold">ParkEase</h3>
                <p className="text-sm text-muted-foreground">Your Parking Management Solution</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Slip #</p>
                    <p>{generatedSlip.slip_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Generated</p>
                    <p>{generatedSlip.generated_at}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Vehicle Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">License Plate</p>
                      <p>{generatedSlip.vehicle_plate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Driver Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p>{generatedSlip.driver_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone</p>
                      <p>{generatedSlip.driver_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Parking Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Parking Space</p>
                      <p>{generatedSlip.parking_space}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Spot</p>
                      <p>{generatedSlip.parking_spot}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Entry Time</p>
                      <p>{generatedSlip.entry_time}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Hourly Rate</p>
                      <p>${generatedSlip.hourly_rate.toFixed(2)}/hr</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 text-center">
                <p className="text-sm">Thank you for using our parking service!</p>
                <p className="text-xs text-muted-foreground">Please keep this slip for reference.</p>
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
              <CardDescription>Enter the details for the new parking slip</CardDescription>
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
                  onValueChange={(value) => handleSelectChange("parking_space", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking space" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingSpaces.map((space) => (
                      <SelectItem key={space.space_id} value={space.space_id.toString()}>
                        {space.space_name} (${space.hourly_rate.toFixed(2)}/hr)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parking_spot">Parking Spot</Label>
                <Select
                  value={formData.parking_spot}
                  onValueChange={(value) => handleSelectChange("parking_spot", value)}
                  disabled={!formData.parking_space}
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={formData.parking_space ? "Select parking spot" : "Select a parking space first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSpots.map((spot) => (
                      <SelectItem key={spot.spot_id} value={spot.spot_id.toString()}>
                        {spot.spot_name} ({spot.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entry_time">Entry Time</Label>
                <Input
                  id="entry_time"
                  name="entry_time"
                  type="datetime-local"
                  value={formData.entry_time}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
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
  )
}
