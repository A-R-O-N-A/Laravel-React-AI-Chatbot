import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useState } from "react";
import { useForm } from "@inertiajs/react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FileText } from 'lucide-react';

export default function FileUpload() {

    const [isOpen, setIsOpen] = useState(false)


    const { post, processing, data, setData } = useForm({
        document : null,
    })

    const handleFileUpload = () => {
        console.log('trigger upload button')
        // post(route('rag.file_upload'))
        // post(route('documents.store'))
    }

    return (<>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    <FileText/>
                    Add RAG document
                </Button>
            </DialogTrigger>


            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Add RAG Document </DialogTitle>
                    <DialogDescription>
                        Upload RAG Document for AI to reference in chat.
                        This aids in Retrieval-Augmented Generation for AI.
                    </DialogDescription>
                </DialogHeader>

                <Label htmlFor="document">Document</Label>
                <Input 
                    id='document' 
                    name='document' 
                    type='file' 

                    // onChange={(e) => {
                    //     const file = e.target.files ? e.target.files[0] : null;
                    //     data.document = file;
                    // }}

                    onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null
                        setData('document', file)
                    }}

                />

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => setIsOpen(false)}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleFileUpload}
                        disabled={processing || !data.document}
                    >
                        Upload File
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>

    </>)
}