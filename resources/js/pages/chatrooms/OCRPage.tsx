import AppLayout from "@/layouts/app-layout";
import { Head, useForm } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { ImageIcon, Upload, X, Download } from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export default function OCRPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [response, setResponse] = useState<any>(null);

    const { post, processing, data, setData, reset } = useForm({
        image: null as File | null,
    });

    const handleImageUpload = () => {
        console.log('trigger upload button');
        post(route('ocr.process_image'), {
            onSuccess: (page) => {
                console.log('OCR Result:', page.props.flash.ocr_result);
                setResponse(page.props.flash.ocr_result);
            },
            onError: (errors) => {
                console.error('Upload failed:', errors);
            }
        });
    };

    const handleClear = () => {
        setImagePreview(null);
        setResponse(null);
        reset();
    };

    const handleDownloadDocx = async () => {
        if (!response) return;

        const text = String(response);
        const lines = text.split('\n');

        const paragraphs = lines.map((line) => {
            const trimmedLine = line.trim();

            // Detect headers (lines that are short, ALL CAPS, or end with colon)
            const isHeader =
                trimmedLine.length > 0 &&
                trimmedLine.length < 60 &&
                (trimmedLine === trimmedLine.toUpperCase() || trimmedLine.endsWith(':'));

            // Empty line = spacing
            if (trimmedLine.length === 0) {
                return new Paragraph({
                    text: "",
                    spacing: {
                        after: 200,
                    },
                });
            }

            // Header formatting
            if (isHeader) {
                return new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmedLine,
                            bold: true,
                            size: 28, // 14pt
                        })
                    ],
                    spacing: {
                        before: 240,
                        after: 120,
                    },
                });
            }

            // Regular paragraph
            return new Paragraph({
                children: [
                    new TextRun({
                        text: line,
                        size: 24, // 12pt
                    })
                ],
                spacing: {
                    after: 120,
                },
            });
        });

        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs,
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `ocr-result-${new Date().getTime()}.docx`);
    };

    return (
        <AppLayout>
            <Head title="Image OCR" />

            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Image OCR</h1>
                    <p className="text-muted-foreground mt-2">
                        Extract text from images using optical character recognition
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Upload Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Upload Image
                            </CardTitle>
                            <CardDescription>
                                Select an image file to extract text from
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Image File</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        setData('image', file);

                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setImagePreview(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        } else {
                                            setImagePreview(null);
                                        }
                                    }}
                                />
                            </div>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Preview</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleClear}
                                            disabled={processing}
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    </div>
                                    <div className="rounded-lg border bg-muted/50 p-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="max-h-96 w-full rounded-md object-contain"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleImageUpload}
                                    disabled={processing || !data.image}
                                    className="w-full"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {processing ? 'Processing...' : 'Extract Text'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Card */}
                    {response && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Extracted Text</CardTitle>
                                        <CardDescription>
                                            Text recognized from the uploaded image
                                        </CardDescription>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDownloadDocx}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download DOCX
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-sm whitespace-pre-wrap">
                                        {response || 'No text extracted'}
                                    </p>
                                </div>

                                <details className="text-xs text-muted-foreground">
                                    <summary className="cursor-pointer hover:text-foreground font-medium">
                                        View full response
                                    </summary>
                                    <pre className="mt-2 rounded-lg border bg-muted/50 p-4 overflow-x-auto max-w-full whitespace-pre-wrap break-words text-xs">
                                        {JSON.stringify(response, null, 2)}
                                    </pre>
                                </details>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}