import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import Plot from "react-plotly.js";
import DescriptiveStatsTable from "@/components/plotly_utils/ui_utils";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function applyType(trace: any, selectedPlotType: string) {
    const next = { ...trace, type: selectedPlotType };

    if (selectedPlotType === "scatter") {
        // 2D scatter: x + y only
        delete next.z;
        return next;
    }

    if (selectedPlotType === "scatter3d") {
        // 3D scatter: x + y + z
        if (!Array.isArray(next.z)) {
            if (Array.isArray(next.y)) {
                next.z = next.y.map((_: any, i: number) => i);
            } else {
                next.z = [];
            }
        }
        return next;
    }

    if (selectedPlotType === "box" || selectedPlotType === "violin") {
        // y only
        delete next.x;
        delete next.z;
        return next;
    }

    if (selectedPlotType === "histogram") {
        // x only
        delete next.y;
        delete next.z;
        return next;
    }

    return next;
}

export default function DataAnalyticsPage() {
    const { data, setData, post, processing, errors } = useForm({
        dataset: null as File | null,
    });

    const [analyticsResult, setAnalyticsResult] = useState<any>(null);
    const [descriptiveStats, setDescriptiveStats] = useState<any>({});
    const [AIInterpretation, setAIInterpretation] = useState<string>("");

    const [parallelCoordsConfig, setParallelCoordsConfig] = useState<any>(null);

    const [plotlyTraces, setPlotlyTraces] = useState<any[]>([]);
    const [plotTypes, setPlotTypes] = useState<string[]>([]);
    const [selectedPlotType, setSelectedPlotType] = useState<string>("scatter");

    const shapedPlotlyTraces = useMemo(
        () => plotlyTraces.map((trace) => applyType(trace, selectedPlotType)),
        [plotlyTraces, selectedPlotType]
    );

    // dynamic axis labels from backend trace metadata
    const axisTitles = useMemo(() => {
        const first = plotlyTraces?.[0] || {};
        return {
            x: first.x_col || "X Axis",
            y: first.y_col || "Y Axis",
            z: first.z_col || "Z Axis",
        };
    }, [plotlyTraces]);

    const handleAnalyze = () => {
        post(route("data_analytics.analyze"), {
            onSuccess: (page) => {
                const result = (page.props as any).flash;
                setAnalyticsResult(result);

                const traces = result?.analytics_result?.plotly_config?.traces || [];
                const descriptiveStats = result?.analytics_result?.descriptive_statistics || null;
                const ai_report = result?.analytics_result?.ai_interpretation || "";
                const plot_types = result?.analytics_result?.plotly_config?.supported_trace_types || [];
                const default_plot_type =
                    result?.analytics_result?.plotly_config?.default_plot_type || "scatter";

                setDescriptiveStats(descriptiveStats);
                setAIInterpretation(ai_report);
                setPlotTypes(plot_types);
                setSelectedPlotType(default_plot_type || plot_types?.[0] || "scatter");

                // keep raw traces; shape them in useMemo
                setPlotlyTraces(traces);

                const parallel_coords_config =
                    result?.analytics_result?.parallel_coords_config || null;
                setParallelCoordsConfig(parallel_coords_config);
            },
            onError: (errors) => {
                console.log("Analysis failed:", errors);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Data Analytics"/>

            <div className="container mx-auto  max-w-8xl mt-8">
                {/* <div className="container mx-auto py-8 px-10 lg:px-16 max-w-8xl"> */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Data Analytics</h1>
                    <p className="text-muted-foreground mt-2">
                        Upload CSV datasets for analysis and visualization
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Upload Card */}
                    <div className="w-full max-w-8xl mx-auto rounded-lg border bg-background p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="dataset" className="text-sm font-medium mb-4">
                                    CSV File
                                </Label>
                                <Input
                                    id="dataset"
                                    name="dataset"
                                    type="file"
                                    accept=".csv"
                                    className="h-10"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setData("dataset", file);
                                    }}
                                />
                                {errors.dataset && (
                                    <p className="text-xs text-red-500">{errors.dataset}</p>
                                )}
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={!data.dataset || processing}
                                className="h-10 md:w-auto w-full px-6"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Analyze
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Plot type tabs */}
                    {plotTypes.length > 0 && (
                        <Tabs
                            value={selectedPlotType}
                            onValueChange={setSelectedPlotType}
                            className="max-w-5xl mx-auto w-full"
                        >
                            <TabsList className="grid w-full grid-cols-5">
                                {plotTypes.map((type) => (
                                    <TabsTrigger key={type} value={type} className="capitalize">
                                        {type}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    )}

                    {/* Main plot */}

                    {analyticsResult && <>

                        <div className="w-full h-[calc(100vh-220px)] min-h-[500px]">
                            <Plot
                                data={shapedPlotlyTraces}
                                layout={{
                                    title: { text: "Siel AI Data Analytics API" },
                                    autosize: true,
                                    ...(selectedPlotType === "scatter3d"
                                        ? {
                                            scene: {
                                                xaxis: { title: { text: axisTitles.x } },
                                                yaxis: { title: { text: axisTitles.y } },
                                                zaxis: { title: { text: axisTitles.z } },
                                                aspectmode: "cube",
                                                aspectratio: { x: 1, y: 1, z: 1 },
                                            },
                                            margin: { l: 0, r: 0, t: 40, b: 0 },
                                        }
                                        : {
                                            xaxis: {
                                                title: { text: axisTitles.x },
                                            },
                                            yaxis: {
                                                title: { text: selectedPlotType === "histogram" ? "frequence" : axisTitles.y },
                                            },
                                            margin: { l: 60, r: 30, t: 40, b: 60 },
                                        }),
                                    bargap: 0.01,
                                    bargroupgap: 0.01,
                                }}
                                useResizeHandler={true}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    </>}


                    {/* Parallel Coordinates plot */}
                    {parallelCoordsConfig?.enabled && parallelCoordsConfig?.trace && (
                        <div className="w-full h-[calc(100vh-220px)] min-h-[500px]">
                            Parallel Coordinates Plot
                            <Plot
                                data={[parallelCoordsConfig.trace]}
                                layout={{
                                    // title: { text: "Parallel Coordinates" },
                                    autosize: true,
                                    margin: { l: 80, r: 80, t: 50, b: 40 },
                                }}
                                useResizeHandler={true}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    )}

                    {/* descriptive statistics */}
                    <DescriptiveStatsTable descriptiveStats={descriptiveStats} />

                    {/* AI interpretation */}
                    {AIInterpretation && (
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Interpretation</CardTitle>
                                <CardDescription>
                                    Insights generated from descriptive statistics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => (
                                            <p className="mb-2 text-s last:mb-0">{children}</p>
                                        ),
                                        code: ({ children }) => (
                                            <code className="bg-muted-foreground/10 px-1 py-0.5 rounded text-xs font-mono">
                                                {children}
                                            </code>
                                        ),
                                        pre: ({ children }) => (
                                            <pre className="bg-muted-foreground/10 p-2 rounded text-s font-mono overflow-x-auto">
                                                {children}
                                            </pre>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="list-disc text-s list-inside mb-2">{children}</ul>
                                        ),
                                        ol: ({ children }) => (
                                            <ol className="list-decimal text-s list-inside mb-2">{children}</ol>
                                        ),
                                        li: ({ children }) => <li className="mb-2 text-s">{children}</li>,
                                        strong: ({ children }) => (
                                            <strong className="font-semibold">{children}</strong>
                                        ),
                                        em: ({ children }) => (
                                            <em className="italic text-s">{children}</em>
                                        ),
                                    }}
                                >
                                    {AIInterpretation}
                                </ReactMarkdown>
                            </CardContent>
                        </Card>
                    )}

                    {/* Results Card */}
                    {analyticsResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Analysis Result</CardTitle>
                                <CardDescription>Parsed dataset in JSON format</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm break-words whitespace-pre-wrap">
                                    {JSON.stringify(analyticsResult, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}