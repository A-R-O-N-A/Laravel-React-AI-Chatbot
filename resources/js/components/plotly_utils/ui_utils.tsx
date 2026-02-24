import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export default function DescriptiveStatsTable({ descriptiveStats }: { stats: any }) {
    return (<>

        {/* Descriptive Statistics Table */}
        {descriptiveStats && (
            <Card>
                <CardHeader>
                    <CardTitle>Descriptive Statistics</CardTitle>
                    <CardDescription>Summary statistics for the dataset</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Overall Statistics */}
                    {descriptiveStats.overall && Object.keys(descriptiveStats.overall).length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Overall Dataset</h3>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Metric</TableHead>
                                        {Object.keys(descriptiveStats.overall).map((col) => (
                                            <TableHead key={col}>{col}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'].map((stat) => (
                                        <TableRow key={stat}>
                                            <TableCell className="font-medium">{stat}</TableCell>
                                            {Object.keys(descriptiveStats.overall).map((col) => (
                                                <TableCell key={col}>
                                                    {descriptiveStats.overall[col]?.[stat]?.toFixed(2) ?? 'N/A'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Per-Trace Statistics */}
                    {descriptiveStats.per_trace && Object.keys(descriptiveStats.per_trace).length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Per Category Statistics</h3>
                            {Object.entries(descriptiveStats.per_trace).map(([category, stats]: [string, any]) => (
                                <div key={category} className="mb-4">
                                    <h4 className="text-md font-medium mb-2 text-muted-foreground">{category}</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Metric</TableHead>
                                                {Object.keys(stats).map((col) => (
                                                    <TableHead key={col}>{col}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max'].map((stat) => (
                                                <TableRow key={stat}>
                                                    <TableCell className="font-medium">{stat}</TableCell>
                                                    {Object.keys(stats).map((col) => (
                                                        <TableCell key={col}>
                                                            {stats[col]?.[stat]?.toFixed(2) ?? 'N/A'}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
    </>)
}