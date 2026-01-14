<?php

namespace App\Http\Controllers;

use App\Models\Chatroom;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\StreamedResponseException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\ValueObjects\Messages\AssistantMessage;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class MessageController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'chatroom_id' => 'required|exists:chatrooms,id',
        ]);

        // Step 1: Create user message in database

        Message::create([
            'content' => $request->input('content'),
            'chatroom_id' => $request->input('chatroom_id'),
            'role' => 'user'
        ]);

        // # now testing the fastapi ai response
        // $response = Http::post('http://127.0.0.1:8080/api/lab/test/chat/ollama', [
        //     "data_input" => $request->input('content')
        // ]);
        // $fastapi_ai_response = $response->json()['content']
        // dd($response->json()['content']);

        return redirect()->back()->with('message', 'Conversation updated successfully.');
    }

    public function sent_ai_message_fastapi(Request $request)
    {
        // ini_set('max_execution_time', 0); // Allow up to 10 minutes
        ini_set('max_execution_time', 3600);
        set_time_limit(3600);

        $chatroom = Chatroom::find($request->chatroom_id);
        $messages = $chatroom->messages()->orderBy('created_at', 'asc')->get();

        $embeddings = $chatroom->documents()
            ->select('documents.id', 'documents.embeddings')
            ->get()
            ->pluck('embeddings', 'id');


        // Fetch documents with embeddings
        $documents = $chatroom->documents()
            ->select('documents.id', 'documents.name', 'documents.path', 'documents.embeddings', 'documents.mime_type')
            ->get();
        $documentContent = [];
        foreach ($documents as $doc) {
            $content = Storage::disk($doc->disk ?? 'public')->get($doc->path);
            $documentContent[$doc->id] = [
                'name' => $doc->name,
                'content' => base64_encode($content),  // Base64 encode binary content
                'mime_type' => $doc->mime_type
            ];
        }

        // prepare message history request
        $fastapi_messages = [];
        foreach ($messages as $message) {
            if ($message->role == 'user') {
                $fastapi_messages[] = [
                    "role" => $message->role,
                    "content" => $message->content
                ];
            } else {
                $fastapi_messages[] = [
                    "role" => $message->role,
                    "content" => $message->content
                ];
            }
        }

        // dd($documentContent);

        // get responst with message history
        // $response = Http::post('http://127.0.0.1:8080/api/lab/test/array', [
        // $response = Http::post('http://127.0.0.1:8080/api/lab/test/rag/chat/ollama', [
        $response = Http::timeout(6000)->connectTimeout(6000)->post('http://127.0.0.1:8080/api/lab/test/rag/chat/ollama', [

            "messages" => $fastapi_messages,
            "embeddings" => $embeddings,
            "documents" => $documentContent,
        ]);

        // dd($response->json());

        // if (isset($response->json()['content'])) {
        //     $fastapi_ai_response = $response->json()['content'];
        // } else {
        //     Log::error('FastAPI response error: ' . $response->body());
        //     return redirect()->back()->with('message', $response->json()['error'] ?? 'Unknown error from AI service.');
        // }

        // extract contante
        // $fastapi_ai_response = $response->json()['content'];

        // dd($response->json());

        $results = $response->json()['results'] ?? [];

        // create mesage in db
        Message::create([
            //     'content' => $fastapi_ai_response,
            // 'content' => $response,
            'content' => $response->json()['ai_response'],
            'chatroom_id' => $request->input('chatroom_id'),
            'role' => 'assistant'
        ]);

        // return redirect()->back()->with('message', 'Conversation updated successfully.');

        return redirect()->back()->with([
            'message' => 'Conversation updated successfully.',
            'results' => $results ,
        ]);
    }   

    public function send_ai_message(Request $request)
    {
        ini_set('max_execution_time', 600); // Allow up to 10 minutes

        // Step 2: Get conversation history
        $chatroom = Chatroom::find($request->chatroom_id);
        $messages = $chatroom->messages()->orderBy('created_at', 'asc')->get();

        // Step 3: Convert to Prism Message objects (not arrays)
        $prismMessages = [];
        foreach ($messages as $message) {
            if ($message->role === 'user') {
                $prismMessages[] = new UserMessage($message->content);
            } else {
                $prismMessages[] = new AssistantMessage($message->content);
            }
        }

        // Step 4: Generate AI response
        $prism = Prism::text()
            ->using(Provider::Ollama, 'llama3.2:3b')
            ->withMessages($prismMessages)
            ->withClientOptions(['timeout' => 600]);                       // Use Prism Message objects

        $response = $prism->asText();

        // Step 5: Create AI message in database
        Message::create([
            'content' => $response->text,
            'chatroom_id' => $request->input('chatroom_id'),
            'role' => 'assistant'
        ]);
        return redirect()->back()->with('message', 'Conversation updated successfully.');
    }

    public function rag_file_upload(Request $request)
    {
        // handle file upload for RAG 
        // dd($request->all());

        $response = Http::post('http://127.0.0.1:8080/api/lab/test/rag/file/vectorize/', [
            "file" => $request->file('file')
        ]);

        dd($response->all());
    }
}
