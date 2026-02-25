import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet } from "lucide-react";
import Plot from 'react-plotly.js';
import DescriptiveStatsTable from "@/components/plotly_utils/ui_utils";
import ReactMarkdown from "react-markdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function DataAnalyticsPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        dataset: null as File | null,
    });

    const [analyticsResult, setAnalyticsResult] = useState<any>(null);
    const [descriptiveStats, setDescriptiveStats] = useState<any>({})
    const [AIInterpretation, setAIInterpretation] = useState<string>('')
    
    const [plotlyTraces, setPlotlyTraces] = useState<any[]>([])
    const [plotTypes, setPlotTypes] = useState<string[]>([])
    const [defaultPlotType, setDefaultPlotType] = useState<string>('')
    const [selectedPlotType, setSelectedPlotType] = useState<string>('')

    const handleAnalyze = () => {
        post(route('data_analytics.analyze'), {
            onSuccess: (page) => {
                // const result = (page.props as any).analytics_result;
                const result = page.props.flash;
                setAnalyticsResult(result);
                console.log('Analysis result : ', result)
                // Transform the result into Plotly traces

                const traces = result?.analytics_result?.plotly_config?.traces || []
                // set the traces after we get the selected plot type from the default
                // setPlotlyTraces(traces)

                // console.log('Plotly Traces from response : ', traces)

                const descriptiveStats = result?.analytics_result?.descriptive_statistics || null
                setDescriptiveStats(descriptiveStats)

                // console.log('Descriptive Statistics from response : ', descriptiveStats)

                const ai_report = result?.analytics_result?.ai_interpretation
                setAIInterpretation(ai_report)

                // console.log('AI Interpretation from response : ', ai_report)

                const plot_types = result?.analytics_result?.plotly_config?.supported_trace_types || []
                setPlotTypes(plot_types)
                // console.log('Supported Plot Types from response : ', plot_types)

                const default_plot_type = result?.analytics_result?.plotly_config?.default_plot_type || ''
                setDefaultPlotType(default_plot_type)
                console.log('Default Plot Type from response : ', default_plot_type)

                setSelectedPlotType(default_plot_type)

                // after setting the selected plot type we can now filter out the traces
                setPlotlyTraces(
                    traces.map((trace: any) => ({
                        ...trace,
                        type: default_plot_type
                    }))
                )

            },
            onError: (errors) => {
                console.log('Analysis failed:', errors);
            }
        });
    };

    // selected plot mutator
    useEffect(() => {

        // set the traces  ...
        setPlotlyTraces((prev) => 

            // for each trace.....
            prev.map((trace) => ({

                // take the original ......
                ...trace,

                // ....but only change the trace property the selected type
                type: selectedPlotType
            }))
        )

        // ....trigger only when selectedPLotType is editted
    }, [selectedPlotType])


    console.log('Plotly Traces : ', plotlyTraces)

    return (
        <AppLayout>
            <Head title="Data Analytics" />

            <div className="container mx-auto py-8 px-4 max-w-8xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Data Analytics</h1>
                    <p className="text-muted-foreground mt-2">
                        Upload CSV datasets for analysis and visualization
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Upload Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5" />
                                Upload Dataset
                            </CardTitle>
                            <CardDescription>
                                Select a CSV file to analyze
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="dataset">CSV File</Label>
                                <Input
                                    id="dataset"
                                    name="dataset"
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setData('dataset', file);
                                    }}
                                />
                                {errors.dataset && (
                                    <p className="text-sm text-red-500">{errors.dataset}</p>
                                )}
                            </div>

                            <Button
                                onClick={handleAnalyze}
                                disabled={!data.dataset || processing}
                                className="w-full"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                {processing ? 'Processing...' : 'Analyze Dataset'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* data visualization using plotly here  */}

                    {/* control for changing plot type */}
                    {plotTypes.length > 0 && (
                        <Tabs 
                            value={selectedPlotType}
                            onValueChange={setSelectedPlotType}
                            className='max-w-4xl mx-auto w-full'
                        >
                            <TabsList className="grid w-full grid-cols-4">
                                {plotTypes.map((type => (
                                    <TabsTrigger key={type} value={type} className='capitalize'>
                                        {type}
                                    </TabsTrigger>
                                )))}
                            </TabsList>
                        </Tabs>
                    )}

                    {/* <div className="w-full aspect-square"> */}
                    <div className="max-w-4xl mx-auto aspect-square">
                        <Plot
                            data={plotlyTraces}
                            layout={{
                                title: { text: "Siel AI Data Analytics API" },
                                autosize: true,
                            }}
                            useResizeHandler={true}
                            style={{ width: "100%", height: "85%" }}
                        />
                    </div>

                    {/* descriptive statistics */}

                    <DescriptiveStatsTable
                        descriptiveStats={descriptiveStats}
                    />

                    {/* make the AI interpretation reportt in her, use markdown parser */}
                    {/* make the AI interpretation report in here, use markdown parser */}
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
                                        p: ({ children }) => <p className="mb-2 text-s last:mb-0">{children}</p>,
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
                                        ul: ({ children }) => <ul className="list-disc text-s list-inside mb-2">{children}</ul>,
                                        ol: ({ children }) => <ol className="list-decimal text-s list-inside mb-2">{children}</ol>,
                                        li: ({ children }) => <li className="mb-2 text-s">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                        em: ({ children }) => <em className="italic text-s">{children}</em>,
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
                                <CardDescription>
                                    Parsed dataset in JSON format
                                </CardDescription>
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