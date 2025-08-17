<?php

namespace App\Http\Controllers;

use App\Models\Chatroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatroomController extends Controller
{
    public function show(Chatroom $chatroom) { 
        return Inertia::render('chatrooms/Index', [
            'chatroom' => $chatroom,
            'messages' => $chatroom
                ->messages()
                ->orderBy('created_at', 'asc')
                ->get() 
        ]);
    }


    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $chatroom = Chatroom::create([
            'name' => $request->input('name'),
            'user_id' => Auth::id(), // Use authenticated user's ID
        ]);

        return redirect()->route('chatrooms.show', $chatroom->id);
    }

    public function archive( Chatroom $chatroom) {
        $chatroomName = $chatroom->name;

        $chatroom->update(['is_archived' => true]);

        return redirect()->route('dashboard')->with('message', "Chatroom '{$chatroomName}' archived successfully.");

        // return redirect()->back()->with('message', 'Chatroom deleted successfully');
    }

    public function unarchive( Chatroom $chatroom) {
        $chatroomName = $chatroom->name;

        $chatroom->update(['is_archived' => false]);

        return redirect()->route('chatrooms.show', $chatroom->id)->with('message', "Chatroom '{$chatroomName} unarchived successfully'");
    }

    public function archive_list() {

        $archivedChatrooms = Chatroom::where('is_archived', true)
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('chatrooms/ArchiveList', [
            'archivedChatrooms' => $archivedChatrooms,
        ]);
    }

    public function destroy(Chatroom $chatroom) {
        // Check if the authenticated user is the owner of the chatroom
        if (Auth::id() !== $chatroom->user_id) {
            return redirect()->route('dashboard')->with('error', 'You do not have permission to delete this chatroom.');
        }

        $chatroomName = $chatroom->name;

        // Delete the chatroom
        $chatroom->delete();

        return redirect()->back()->with('message', "Chatroom '{$chatroomName}' deleted successfully");
    }

    public function update(Request $request ,Chatroom $chatroom) {
        $chatroom->update([
            'name' => $request->input('name'),
        ]);

        return redirect()->back()->with('message', 'Chatroom updated successfull');
    }
}
