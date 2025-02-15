"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TeamSelector() {
  return (
    <Select defaultValue="lac">
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lac">LA Clippers</SelectItem>
        <SelectItem value="lal">LA Lakers</SelectItem>
        <SelectItem value="gsw">Golden State Warriors</SelectItem>
      </SelectContent>
    </Select>
  )
}

