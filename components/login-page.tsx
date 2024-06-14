
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"


export function LoginPage() {
  return (
    <div className="mx-auto space-y-6 max-w-sm bg-white">
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 text-gray-400">Enter your information to sign in</p>
        </div>
        
        
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="m@example.com" required type="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <Link className="ml-auto inline-block text-sm underline" href="#">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" required type="password" />
        </div>
        <Button className="w-full" type="submit">
          Sign in
        </Button>
        <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?
          <Link className="underline" href="#">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}


