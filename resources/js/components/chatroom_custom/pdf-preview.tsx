import { Eye, EyeOff, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";

export default function PDFPreview({ result, fullHeight = false }: any) {

    const [loading, setLoading] = useState(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)

    useEffect(() => {
        if (fullHeight && !pdfUrl) {
            handleLoadPDF();
        }
    }, [fullHeight, pdfUrl]);

    const handleLoadPDF = async () => {
        if (pdfUrl) return;

        setLoading(true);
        try {
            const url = route('documents.preview', { docId: result.doc_id });
            const response = await fetch(url);
            const blob = await response.blob();
            const pdfBlobUrl = URL.createObjectURL(blob);
            setPdfUrl(pdfBlobUrl);
        } catch (error) {
            console.error('Failed to load PDF:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col ${fullHeight ? 'h-full' : ''}`}>
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{result.filename}</span>
                </div>
            </div>

            {pdfUrl ? (
                // <div className={`overflow-hidden rounded-md border ${fullHeight ? 'flex-1' : 'h-100'}`}>
                <div className={`overflow-hidden flex-1 min-h-0`}>
                    <iframe
                        src={pdfUrl}
                        className="w-full h-500 border-0 overflow"
                        title="PDF Preview"
                    />
                </div>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLoadPDF}
                    disabled={loading}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    {loading ? 'Loading...' : 'Load Preview'}
                </Button>
            )}
        </div>
    );
}