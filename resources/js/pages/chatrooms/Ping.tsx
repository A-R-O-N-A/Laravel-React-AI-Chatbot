import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, usePage } from "@inertiajs/react";
import { CheckCircle2, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";

export default function Ping() {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, reset } = useForm({ message: "" });

    const getInitialTheme = (): "light" | "dark" => {
        if (typeof window === "undefined") return "light";
        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        if (stored) return stored;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    };

    const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

    useEffect(() => {
        if (typeof document === "undefined") return;
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("ping.fastapi"), {
            onSuccess: () => reset("message"),
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center p-6 transition-colors">
            <div className="w-full max-w-2xl space-y-6">

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Integration Demo</p>
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-50">
                            Laravel · React · FastAPI
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                            Send a test message to FastAPI and view the response status.
                        </p>
                    </div>
                    <Button variant="outline" size="icon" onClick={toggleTheme}>
                        {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                </div>

                {flash?.message && typeof flash.message === "string" && (
                    <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-100">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{flash.message}</AlertDescription>
                    </Alert>
                )}

                <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg dark:text-slate-50">Send a Ping</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendMessage} className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="message">Message</Label>
                                <Input
                                    id="message"
                                    name="message"
                                    value={data.message}
                                    onChange={(e) => setData("message", e.target.value)}
                                    placeholder="Type a message"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? "Sending..." : "Send"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}