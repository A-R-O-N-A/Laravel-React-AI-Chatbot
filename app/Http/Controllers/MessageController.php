<?php

namespace App\Http\Controllers;

use App\Models\Chatroom;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\StreamedResponseException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Prism;
use Prism\Prism\ValueObjects\Messages\AssistantMessage;
use Prism\Prism\ValueObjects\Messages\UserMessage;
use Symfony\Component\HttpFoundation\StreamedResponse;

use App\Http\SIELAI\Routes\General;

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
        $sielai = new General();

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
        $response = Http::timeout(6000)
            ->connectTimeout(6000)
            ->post($sielai->ragChatBm25 ,[
            "messages" => $fastapi_messages,
            "embeddings" => $embeddings,
            "documents" => $documentContent,
        ]);

        $results = $response->json()['results'] ?? [];

        // create mesage in db
        Message::create([
            //     'content' => $fastapi_ai_response,
            // 'content' => $response,
            'content' => $response->json()['ai_response'],
            'chatroom_id' => $request->input('chatroom_id'),
            'role' => 'assistant',
            'vector_results' => json_encode($results),
            // 'vector_results' => $results,
        ]);

        return redirect()->back()->with([
            'message' => 'Conversation updated successfully.',
            'results' => $results,
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
        $sielai = new General();
        // handle file upload for RAG 
        // dd($request->all());

        $response = Http::post($sielai->ragFileVectorize, [
            "file" => $request->file('file')
        ]);

        dd($response->all());
    }

    public function ocr_page() {
        return Inertia::render('chatrooms/OCRPage');
    }

    public function image_ocr(Request $request)
    {
        $sielai = new General();

        $request->validate([
            'image' => 'required|file|image|max:10240',
        ]);

        try {
            $image = $request->file('image');

            $response = Http::timeout(6000)
                ->connectTimeout(6000)
                ->attach(
                    'image',
                    file_get_contents($image->getRealPath()),
                    $image->getClientOriginalName()
                )
                ->post($sielai->ocrProcessImage);

            Log::info('OCR Response:', [
                'status' => $response->status(),
                'body' => $response->json()
            ]);

            
            if ($response->successful()) {
                $ocrData = $response->json()['text'] ?? 'No text extracted';
                $modelUsed = $response->json()['model'] ?? 'Unknown model';
                
                return back()->with([
                    'message' => $ocrData,
                    'ocr_result' => $ocrData,
                    'model_used' => $modelUsed,
                    ]);
                }

            return back()->withErrors([
                'error' => 'OCR processing failed: ' . ($response->json()['detail'] ?? $response->body())
            ]);
        } catch (\Exception $e) {
            Log::error('OCR Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to process image: ' . $e->getMessage()]);
        }
    }

    public function data_analytics_page() {
        return Inertia::render('chatrooms/DataAnalyticsPage');
    }

    public function data_analytics(Request $request){

        $request->validate([
            'dataset' => 'required|file|mimes:csv'
        ]);

        try {

            $dataset = $request->file('dataset');

            $response = Http::timeout(60000)
                ->connectTimeout(6000)
                ->attach(
                    'dataset',
                    file_get_contents($dataset->getRealPath()),
                    $dataset->getClientOriginalName()              
                )
                // ->post('http://127.0.0.1:8080/api/data-analytics/data-analytics/analyze');
                ->post('http://72.62.69.183:8002/api/data-analytics/data-analytics/analyze');
            
            // Log::info()('Data Analytics Response:', [
            //     'status' => $response->status(),
            //     'body' => $response->json()
            // ]);

            // dd($response->json());

            if ($response->successful()) {
                $analyticsResult = $response->json()['data_parsed'];

                return back()->with([
                    'message'  => 'Data analytics completed successfully',
                    'analytics_result' => $analyticsResult,
                ]);
            } else {
                return back()->withErrors([
                    'error' => 'Data analytics failed : ' . ($response->json()['detail'] ?? $response->body())
                ]);
            }


        } catch (\Exception $e) {
            Log::error('Data Analytics Error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to process file: ' . $e->getMessage()]);
        }

    }
}
