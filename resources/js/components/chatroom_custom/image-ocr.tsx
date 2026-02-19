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
import { ImageIcon } from 'lucide-react';

export default function ImageOCR() {

    const [isOpen, setIsOpen] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const [imagePreview, setImagePreview] = useState(null)

    const { post, processing, data, setData } = useForm({
        image: null,
    })

    const handleImageUpload = () => {
        console.log('trigger upload button')
        post(route('ocr.process_image'), {
            onSuccess: (page) => {
                console.log('OCR Result : ', page.props.flash.ocr_result)
                setResponse(page.props.flash.ocr_result)
            },
            onError: (errors) => {
                console.error('Upload failed:', errors)
            }
        })
    }

    return (<>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    <ImageIcon />
                    Upload Image
                </Button>
            </DialogTrigger>


            <DialogContent>
                <DialogHeader>
                    <DialogTitle> Upload Image </DialogTitle>
                    <DialogDescription>
                        Select an image file to upload.
                    </DialogDescription>
                </DialogHeader>

                <Label htmlFor="image">Image</Label>
                <Input
                    id='image'
                    name='image'
                    type='file'
                    accept="image/*"

                    onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null
                        setData('image', file)

                        // create preview

                        if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                                setImagePreview(reader.result as string)
                            }

                            reader.readAsDataURL(file)
                        } else {
                            setImagePreview(null)
                        }
                    }}

                />

                {/* image preview */}

                {imagePreview &&  (
                    <div className='space-y-2'>
                        <Label>Image Preview:</Label>
                        <div className="rounded-md border bg-muted/50 p-4">
                            <img 
                                src={imagePreview}
                                alt="Preview" 
                                className="max-h-64 mx-auto rounded-md object-contain"
                            />
                        </div>
                    </div>)
                }

                
                {/* repose vieqw */}
                {response && (
                    <div className="space-y-2">
                        <Label>Extracted Text:</Label>
                        <div className="rounded-md border bg-muted/50 p-4">
                            <p className="text-sm whitespace-pre-wrap">
                                {response || 'No text extracted'}
                            </p>
                        </div>

                        <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                                View full response
                            </summary>
                            <pre className="mt-2 rounded-md border bg-muted/50 p-2 overflow-x-auto max-w-full whitespace-pre-wrap break-words">
                                {JSON.stringify(response, null, 2)}
                            </pre>
                        </details>

                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => setIsOpen(false)}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImageUpload}
                        disabled={processing || !data.image}
                    >
                        Upload Image
                    </Button>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    </>)
}