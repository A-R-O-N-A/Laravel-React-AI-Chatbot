<?php

namespace App\Http\Controllers;

use App\Models\ChatroomDocument;
use Illuminate\Http\Request;

class ChatroomDocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 
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
    public function store(Request $request)
    {
        //

        // dd($request->all());

        // dd($request->loaded_documents);

        $request->validate([
            'loaded_documents' => 'required|array',
            'loaded_documents.*.id' => 'required|exists:documents,id',
            'chatroom_id' => 'required|exists:chatrooms,id',
        ]);

        // Delete existing documents for this chatroom first
        ChatroomDocument::where('chatroom_id', $request->chatroom_id)->delete();

        foreach($request->loaded_documents as $doc){
            ChatroomDocument::create([
                'document_id' => $doc['id'],
                'chatroom_id' => $request->chatroom_id,
            ]);
        }

        return back()->with('message', 'Documents added to Chatroom successfull');

        // return response()->json([
        //     'message' => 'Documents added to Chatroom successfully',
        // ], 201);

        // $request->validate([
        //     'document_id' => 'required|exists:documents,id',
        //     'chatroom_id' => 'required|exists:chatrooms,id',
        // ]);

        // $chatroomDocument = ChatroomDocument::create([
        //     'document_id' => $request->input('document_id'),
        //     'chatroom_id' => $request->input('chatroom_id'),
        // ]);

        // return response()->json([
        //     'message' => 'Document added to Chatroom successfully',
        //     'chatroom_document' => $chatroomDocument,
        // ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(ChatroomDocument $chatroomDocument)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ChatroomDocument $chatroomDocument)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ChatroomDocument $chatroomDocument)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChatroomDocument $chatroomDocument)
    {
        //
        $chatroomDocument->delete();
        return response()->json([
            'message' => 'Document removed from Chatroom successfully',
        ], 200);
    }
}
