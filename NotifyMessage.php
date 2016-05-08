<?php

namespace App\Events;

use App\Events\Event;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class NotifyMessage extends Event implements ShouldBroadcast
{
    use SerializesModels;

    public $message;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should be broadcast on.
     *
     * @return array
     */
    public function broadcastOn()
    {
        //$channel = "notifications_to_{$this->message->reciever->id}";

        return ['test-channel','notifications_to_3'];
    }
}

/*
	call by this-
	$notifyEvent = new NotifyMessage($message);
	event($notifyEvent);
*/
