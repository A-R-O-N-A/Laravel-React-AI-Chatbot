import { useEffect, useState } from "react";
import { useForm, router } from "@inertiajs/react";
import { Check, Edit3, FileText, ReceiptPoundSterling, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Chatroom } from "@/types/chatroom";

import { usePage } from "@inertiajs/react";


export default function DocumentListDialog({ chatroom }: { chatroom: Chatroom }) {
    // export default function DocumentListDialog({ chatroom, documents }) {
    const { chat_documents } = usePage().props
    const [isOpen, setIsOpen] = useState(false);

    // list of all available documentds
    const [documents, setDocuments] = useState<any>([])

    // the ones already loaded in the chatroom
    const [loadedDocuments, setLoadedDocuments] = useState<any>(chat_documents || [])


    const { post, delete: destroy, data, setData } = useForm({

        // document_id: 0,
        // document_name: '',

        chatroom_id: chatroom.id,
        loaded_documents: loadedDocuments,
    })

    console.log('Documents in chatroom initial load : ', chat_documents)

    // load documents list
    useEffect(() => {

        axios.get(route('documents.index'))
            .then((res) => {
                console.log('Fetched documents succesfully' + res.data)
                setDocuments(res.data.documents)
            })
            .catch((error) => {
                console.log('Could not fetch documents' + error)
            })

    }, [])

    const handleToggleDocument = (doc: any, isChecked: boolean) => {

        console.log('Loaded documents before toggle : ', loadedDocuments)
        setData('loaded_documents', loadedDocuments)

        if (isChecked) {
            // add to the loaded Documents
            setLoadedDocuments([...loadedDocuments, doc])
        } else {
            // remove loaded document
            setLoadedDocuments(loadedDocuments.filter((d: any) => d.id !== doc.id))
        }

        console.log('Loded documents after toggled : ', loadedDocuments)
    }

    useEffect(() => {
        console.log('Loaded documents updated:', loadedDocuments)
    }, [loadedDocuments])

    const isDocumentLoaded = (docId: number) => {
        return loadedDocuments.some((doc: any) => doc.id === docId)
    }

    const updateLoadedDocuments = () => {

        console.log('SENDING documents to load ', loadedDocuments)

        // post(route('chatroom-documents.store'), {
        //     onSuccess: () => {
        //         console.log('Loaded documents updated successfully')
        //     },
        //     onError: (errors: any) => {
        //         console.log('Error updating loaded documents : ', errors)
        //     }
        // })
        router.post(route('chatroom-documents.store'), {
            chatroom_id: chatroom.id,
            loaded_documents: loadedDocuments,
        }, {
            onSuccess: () => {
                console.log('Loaded documents updated successfully')
            },
            onError: (errors: any) => {
                console.log('Error updating loaded documents : ', errors)
            }
        })

    }


    // const addDocument = (documentId: number, documentName: string) => {
    const addDocument = (documentId: number, documentName: string) => {

        // console.log('ID : ', documentId)
        // console.log('Name : ', documentName)

        // setData('document_id', documentId)
        // setData('document_name', documentName)


        post(route('chatroom-documents.store'), {
            onSuccess: () => {
                console.log('Document added to chatroom successfully')
            },
            onError: (errors: any) => {
                console.log('Error adding document to chatroom : ', errors)
            }
        })

        // post(route('chatroom-documents.store'), {
        //     data: {
        //         document_id: documentId,
        //         document_name: documentName,
        //         chatroom_id: chatroom.id,
        //     },
        //     onSuccess: () => {
        //         console.log('Document added to chatroom successfully')
        //     },
        //     onError: (errors: any) => {
        //         console.log('Error adding document to chatroom : ', errors)
        //     }
        // })

    }

    const removeDocument = (documentId: number, destroy: any) => {
        destroy(route(' chatroom-documents.destroy'), {
            onSuccess: () => {
                console.log('Document removed from Chatroom successfully')
            },
            onError: (errors: any) => {
                console.log('Error removing document from Chatroom : ', errors)
            }
        })
    }

    // console.log('Documents passed on : ' + documents)

    if (!documents) { return <> Loading . . . </> }

    // if (documents.length === 0) { return <> No documents found </> }


    return (<Dialog>
        <DialogTrigger asChild>
            <Button
                variant='outline' size='sm' className='w-full justify-start text-sm'
            // onClick={loadDocumentsList}
            >
                <FileText />
                Documents
            </Button>
        </DialogTrigger>
        <DialogContent>

            <DialogHeader>
                <DialogTitle>RAG Documents</DialogTitle>
                <DialogDescription>
                    Manage your Retrieval-Augmented Generation documents here.
                </DialogDescription>
            </DialogHeader>
            {/* 
            {
                documents.map((doc: any) => {
                    return <Button> {doc.name} </Button>
                })
            } */}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Active</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.map((doc: any) => (
                        <TableRow key={doc.id}>

                            <TableCell>
                                {isDocumentLoaded(doc.id) ? (
                                    <Badge variant="default" className="gap-1">
                                        <Check className="h-3 w-3" />
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="gap-1">
                                        <X className="h-3 w-3" />
                                        Inactive
                                    </Badge>
                                )}
                            </TableCell>

                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    {doc.name}
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                                {doc.file_type || 'PDF'}
                            </TableCell>
                            <TableCell className="extt-right">

                                <Switch
                                    checked={isDocumentLoaded(doc.id)}
                                    onCheckedChange={(isChecked) => handleToggleDocument(doc, isChecked)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <DialogFooter>

                <Button
                    type="button"
                    variant="outline"
                >
                    Cancel
                </Button>

                <Button
                    onClick={updateLoadedDocuments}
                >
                    Confirm
                </Button>

            </DialogFooter>

        </DialogContent>
    </Dialog>)
}