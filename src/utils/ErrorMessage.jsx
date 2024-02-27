 import {XCircle} from "lucide-react"
const ErrorMessage = () => {
  return (
    <main className="h-lvh grid place-items-center">
      <div className="flex items-center gap-4">
      <XCircle className="text-red-500" size={120}/> <span className="text-slate-600 text-5xl">Page Not Found</span>
      </div>
    </main>
  )
}

export default ErrorMessage