<?php

namespace App\Http\Controllers;

use App\Models\Chatroom;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        // return Inertia::render('documents/Index', [
        //     'documents' => Document::where('user_id', Auth::id())->get()
        // ]);

        // $documents = Document::where('user_id', Auth::id())->get();
        // dd($documents);

        return response()->json([
            'documents' => Document::where('user_id', Auth::id())->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function fastapi_vectorize_test(Request $request) {

        return Inertia::render('testbed/file-vectorize');
    }

    public function vectorize_test(Request $request) {
        $embeddings = $this->fastapi_vectorize($request);

        // return response()->json([
        //     'embeddings' => $embeddings
        // ]);

        $response = Http::timeout(6000)->connectTimeout(6000)->attach(
            'file',
            $request->file('document')->getContent(),
            $request->file('document')->getClientOriginalName()
        // )->post('http://127.0.0.1:8080/api/lab/test/rag/file/chat/v2/', [
        )->post('http://72.62.69.183:8002/api/lab/test/rag/file/chat/v2/', [
            'query' => $request->input('query')
        ]);


        return Inertia::render('testbed/file-vectorize', [
            // 'embeddings' => $embeddings
            'response' => $response->json()
        ]);
    }

    public function fastapi_vectorize(Request $request)
    {

        // $response = Http::attach(
        //     'file',
        //     $request->file('document')->getContent(),
        //     $request->file('document')->getClientOriginalName()
        // // )->post('http://127.0.0.1:8080/api/lab/test/rag/file/vectorize/');
        // )->post('http://72.62.69.183:8002/api/lab/test/rag/file/vectorize/');

        $response = Http::timeout(6000)
            ->connectTimeout(6000)
             ->attach(
            'file',
            $request->file('document')->getContent(),
            $request->file('document')->getClientOriginalName()
        // )->post('http://127.0.0.1:8080/api/lab/test/rag/file/vectorize/');
        )->post('http://72.62.69.183:8002/api/lab/test/rag/file/vectorize/');

        // dd($response->json()['embeddings']);

        return $response->json()['embeddings'];
    }

    public function store(Request $request)
    {
        // dd($request->all());

        $request->validate([
            'document' => 'required|file|max:102400|mimes:pdf,txt,doc,docx,text/markdown',
            'chatroom_id' => 'nullable|exists:chatrooms,id',
        ]);

        $embeddings =  $this->fastapi_vectorize($request);

        // dd($embeddings);

        $file = $request->file('document');
        $path = $file->store('documents', 'public');

        $document = Document::create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'disk' => 'public',
            // 'user_id' => auth()->id(),
            'user_id' => Auth::id(),
            'embeddings' => $embeddings,
        ]);

        // attach to chatroom if chatroom_id is provided

        if ($request->chatroom_id) {
            Chatroom::findOrFail($request->chatroom_id)->documents()->attach($document->id);
        }

        // add optional error message if needed

        return redirect()->back()->with('message', 'Document uploaded successfully.');
    }
    public function getPDFPreview($docId)
    {
        $document = Document::find($docId);

        if (!$document) {
            return response()->json(['error' => 'Document not found'], 404);
        }

        $filePath = $document->path;

        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json(['error' => 'File not found at: ' . $filePath], 404);
        }

        $fileContent = Storage::disk('public')->get($filePath);
        $mimeType = Storage::disk('public')->mimeType($filePath);

        return response($fileContent, 200)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="' . $document->name . '"');
    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Document $document)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        if (Auth::id() == $document->user_id) {
            $document->delete();
            return back()->with('message', 'Document deleted successfully.');
        } else {

            return back()->withErrors(['message' => 'Unauthorized to delete this document.']);
        }
    }
}
