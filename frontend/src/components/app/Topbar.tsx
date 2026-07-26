import { Bell, Command, Search } from "lucide-react";

import { AppNav } from "@/components/app/AppNav";
import { HealthIndicator } from "@/components/app/HealthIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search reports, sources, and claims" aria-label="Search" />
          </div>
        </div>
        <HealthIndicator />
        <Button variant="outline" size="icon" aria-label="Command palette">
          <Command className="size-4" aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="lg:hidden">
        <AppNav variant="mobile" />
      </div>
    </header>
  );
}
