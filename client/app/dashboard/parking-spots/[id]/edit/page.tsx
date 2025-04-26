"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock data for parking spots
const parkingSpots = [
  {
    spot_id: 1,
    spot_name: "A1",
    space_id: 1,
    status: "Available",
  },
  {
    spot_id: 2,
    spot_name: "A2",
    space_id: 1,
    status: "Occupied",
  },
  {
    spot_id: 3,
    spot_name: "B1",
    space_id: 1,
    status: "Available",
  },
]

// Mock data for parking spaces
const parkingSpaces = [
  { space_id: 1, space_name: "Downtown Garage" },
  { space_id: 2, space_name: "Mall Parking" },
  { space_id: 3, space_name: "Office Complex" },
]

// Status options
const statusOptions = ["Available", "Occupied", "Maintenance"]

export default function EditParkingSpotPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    spot_name: "",
    space_id: "",
    status: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const spotId = Number.parseInt(params.id)

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // In a real application, you would make an API call to get the parking spot data
        await new Promise((resolve) => setTimeout(resolve, 500))

        const spot = parkingSpots.find((s) => s.spot_id === spotId)

        if (spot) {
          setFormData({
            spot_name: spot.spot_name,
            space_id: spot.space_id.toString(),
            status: spot.status,
          })
        } else {
          toast({
            title: "Parking spot not found",
            description: "The requested parking spot could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard/parking-spots")
        }
      } catch (error) {
        toast({
          title: "Failed to load data",
          description: "An error occurred while loading the parking spot data.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [spotId, router, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real application, you would make an API call to update the parking spot
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Parking spot updated",
        description: "The parking spot has been successfully updated.",
      })

      router.push("/dashboard/parking-spots")
    } catch (error) {
      toast({
        title: "Failed to update parking spot",
        description: "An error occurred while updating the parking spot.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p>Loading parking spot data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Parking Spot</h2>
        <p className="text-muted-foreground">Update the details of parking spot #{spotId}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Parking Spot Details</CardTitle>
            <CardDescription>Edit the details for this parking spot</CardDescription>
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
                    <SelectItem key={space.space_id} value={space.space_id.toString()}>
                      {space.space_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
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
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Parking Spot"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
