import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { can } from "@/lib/api"
export default function Forbidden() {
  const destination =
    window.APP_CONFIG.navigation.find((item) => can(window.APP_CONFIG, item.permission))?.href ||
    window.APP_CONFIG.login
  return (
    <div className="ui-forbidden">
      <span>
        <ShieldAlert size={40} />
      </span>
      <p className="ui-eyebrow">ACCESS RESTRICTED</p>
      <h2>This space needs permission</h2>
      <p>
        Your account does not have access to this page. Contact your administrator if you need
        access.
      </p>
      <Button asChild>
        <a href={destination}>Return to workspace</a>
      </Button>
    </div>
  )
}
