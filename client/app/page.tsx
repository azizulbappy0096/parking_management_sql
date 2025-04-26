import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white px-6 py-4 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">ParkEase</h1>
          <nav className="space-x-4">
            <Link href="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-100 py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">Parking Management Made Simple</h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Efficiently manage your parking spaces, spots, and generate parking slips with our comprehensive solution.
            </p>
            <Button asChild size="lg">
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 px-6 py-8 text-white">
        <div className="container mx-auto">
          <p className="text-center text-sm">© 2025 ParkEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
