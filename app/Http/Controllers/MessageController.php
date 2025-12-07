<?php

namespace App\Http\Controllers;

use App\Models\Chatroom;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Routing\Exceptions\StreamedResponseException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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

        $chatroom = Chatroom::find($request->chatroom_id);
        $messages = $chatroom->messages()->orderBy('created_at', 'asc')->get();

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

        // get responst with message history
        $response = Http::post('http://127.0.0.1:8080/api/lab/test/array', [
            "messages" => $fastapi_messages
        ]);

        // extract contante
        $fastapi_ai_response = $response->json()['content'];

        // create mesage in db
        Message::create([
            'content' => $fastapi_ai_response,
            'chatroom_id' => $request->input('chatroom_id'),
            'role' => 'assistant'
        ]);

        return redirect()->back()->with('message', 'Conversation updated successfully.');
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
}
