import Link from "next/link"
import { Car, ClipboardList, ParkingCircle, ParkingSquare, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  // Mock data for dashboard stats
  const stats = [
    { name: "Total Parking Spaces", value: 12, icon: ParkingSquare, href: "/dashboard/parking-spaces" },
    { name: "Total Parking Spots", value: 156, icon: ParkingCircle, href: "/dashboard/parking-spots" },
    { name: "Registered Vehicles", value: 87, icon: Car, href: "/dashboard/vehicles" },
    { name: "Slips Generated", value: 243, icon: ClipboardList, href: "/dashboard/slips" },
    { name: "Users", value: 8, icon: Users, href: "/dashboard/users" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your parking management system</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <Card className="hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent parking management activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="mr-4 rounded-full bg-primary/10 p-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Slip #{1000 + i} generated</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(Date.now() - i * 3600000).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parking Space Occupancy</CardTitle>
            <CardDescription>Current occupancy of your parking spaces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Downtown Garage", total: 45, occupied: 32 },
                { name: "Mall Parking", total: 60, occupied: 58 },
                { name: "Office Complex", total: 30, occupied: 15 },
                { name: "Airport Parking", total: 120, occupied: 87 },
              ].map((space) => (
                <div key={space.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{space.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {space.occupied}/{space.total} spots
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(space.occupied / space.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/parking-spaces/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-muted"
              >
                <ParkingSquare className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Add Parking Space</span>
              </Link>
              <Link
                href="/dashboard/parking-spots/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-muted"
              >
                <ParkingCircle className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Add Parking Spot</span>
              </Link>
              <Link
                href="/dashboard/vehicles/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-muted"
              >
                <Car className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Register Vehicle</span>
              </Link>
              <Link
                href="/dashboard/slips/new"
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-4 hover:bg-muted"
              >
                <ClipboardList className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Generate Slip</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
