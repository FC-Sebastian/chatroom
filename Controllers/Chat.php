<?php

class Chat extends BaseController
{
    public $aChatRoom;
    public $aActiveUsers;
    public $view = "chatView";
    public $title;

    public function render()
    {
        $sChatroomName = $this->getRequestParameter("chat");
        $oChatroom = new ChatRoom();

        $this->aChatRoom = $oChatroom->loadByColumnValue("room_name", $sChatroomName,1)[0];
        $this->title = $this->aChatRoom["room_name"];

        $oActive = new ChatActive();
        $this->aActiveUsers = $oActive->loadByColumnValue("chat_room_id",$this->aChatRoom["id"]);

        parent::render();
    }
}