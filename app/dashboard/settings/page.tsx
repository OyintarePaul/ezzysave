import { Button } from "@/components/ui/button"

const SettingsPage = () => {
  return (
    <div>
      <h1>Other setting items are coming soon</h1>
      <Button className="w-full" asChild variant="outline"><a href="/auth/logout?federated">Log out</a></Button>
    </div>
  )
}

export default SettingsPage