import { CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"

export const FlashAlert = ({ flash }: any) => {
    return (<>

        {/* Flash Messages */}
        {flash?.message && (
            <Alert className="mb-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                    {flash.message}
                </AlertDescription>
            </Alert>
        )}

        {flash?.error && (
            <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                    {flash.error}
                </AlertDescription>
            </Alert>
        )}
    </>)
}