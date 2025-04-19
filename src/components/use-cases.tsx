import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, MapPin, Users, Zap, Shield } from "lucide-react"

export function UseCases() {
  const useCases = [
    {
      icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
      title: "Emergency Awareness",
      description: "Stay informed about emergencies, evacuations, and critical situations in your area with real-time alerts and updates."
    },
    {
      icon: <Clock className="h-10 w-10 text-blue-500" />,
      title: "Daily Planning",
      description: "Plan your day with accurate weather forecasts, traffic updates, and information about local events and activities."
    },
    {
      icon: <MapPin className="h-10 w-10 text-red-500" />,
      title: "Local Discovery",
      description: "Discover new restaurants, shops, services, and attractions in your neighborhood that you might have missed."
    },
    {
      icon: <Users className="h-10 w-10 text-purple-500" />,
      title: "Community Building",
      description: "Connect with neighbors, join local groups, and participate in community discussions and initiatives."
    },
    {
      icon: <Zap className="h-10 w-10 text-yellow-500" />,
      title: "Quick Response",
      description: "Report incidents, service disruptions, or hazards to alert your community and local authorities."
    },
    {
      icon: <Shield className="h-10 w-10 text-emerald-500" />,
      title: "Safety & Security",
      description: "Enhance your personal safety with awareness of incidents, crime reports, and safety advisories in your area."
    }
  ]
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {useCases.map((useCase, index) => (
        <Card key={index} className="border bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="mb-2">{useCase.icon}</div>
            <CardTitle className="text-xl">{useCase.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">{useCase.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
