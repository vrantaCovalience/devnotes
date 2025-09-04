"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { useLoginForm } from "./useLoginForm"

export function LoginForm() {
  const {
    username,
    password,
    error,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLoginForm()

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={handleChange}
            placeholder="Enter your username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}