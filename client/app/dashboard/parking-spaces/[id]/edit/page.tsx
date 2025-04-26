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

// Mock data for parking spaces
const parkingSpaces = [
  {
    space_id: 1,
    space_address: "123 Main St, Downtown",
    space_type: "Covered",
    mngr_id: 1,
    hourly_rate: 2.5,
  },
  {
    space_id: 2,
    space_address: "456 Market Ave, Uptown",
    space_type: "Open",
    mngr_id: 2,
    hourly_rate: 3.0,
  },
  {
    space_id: 3,
    space_address: "789 Park Blvd, Midtown",
    space_type: "Multi-level",
    mngr_id: 1,
    hourly_rate: 2.75,
  },
]

// Mock data for managers
const managers = [
  { user_id: 1, name: "John Doe" },
  { user_id: 2, name: "Jane Smith" },
  { user_id: 3, name: "Robert Johnson" },
]

// Mock data for space types
const spaceTypes = ["Covered", "Open", "Multi-level", "Underground"]

export default function EditParkingSpacePage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    space_address: "",
    space_type: "",
    mngr_id: "",
    hourly_rate: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const spaceId = Number.parseInt(params.id)

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        // In a real application, you would make an API call to get the parking space data
        await new Promise((resolve) => setTimeout(resolve, 500))

        const space = parkingSpaces.find((s) => s.space_id === spaceId)

        if (space) {
          setFormData({
            space_address: space.space_address,
            space_type: space.space_type,
            mngr_id: space.mngr_id.toString(),
            hourly_rate: space.hourly_rate.toString(),
          })
        } else {
          toast({
            title: "Parking space not found",
            description: "The requested parking space could not be found.",
            variant: "destructive",
          })
          router.push("/dashboard/parking-spaces")
        }
      } catch (error) {
        toast({
          title: "Failed to load data",
          description: "An error occurred while loading the parking space data.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [spaceId, router, toast])

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
      // In a real application, you would make an API call to update the parking space
      // For demo purposes, we'll simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Parking space updated",
        description: "The parking space has been successfully updated.",
      })

      router.push("/dashboard/parking-spaces")
    } catch (error) {
      toast({
        title: "Failed to update parking space",
        description: "An error occurred while updating the parking space.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p>Loading parking space data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Edit Parking Space</h2>
        <p className="text-muted-foreground">Update the details of parking space #{spaceId}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Parking Space Details</CardTitle>
            <CardDescription>Edit the details for this parking space</CardDescription>
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
                onValueChange={(value) => handleSelectChange("space_type", value)}
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
              <Select value={formData.mngr_id} onValueChange={(value) => handleSelectChange("mngr_id", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  {managers.map((manager) => (
                    <SelectItem key={manager.user_id} value={manager.user_id.toString()}>
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
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Parking Space"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
