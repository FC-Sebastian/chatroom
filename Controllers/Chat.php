<?php

class Chat extends BaseController
{
    public $aChatRoom;
    public $view = "chatView";
    public $title;

    /**
     * loads chat-room data and adds session-user to active users
     * before rendering page
     * @return void
     * @throws Exception
     */
    public function render()
    {
        $sChatroomName = $this->getRequestParameter("chat");
        $oChatroom = new ChatRoom();
        $oActive = new ChatActive();
        $oChatMsg = new ChatMessage();

        $this->aChatRoom = $oChatroom->loadByColumnValue("room_name", $sChatroomName,1)[0];
        $this->title = $this->aChatRoom["room_name"];

        if (isset($_SESSION["user"]) && $oActive->loadList("(chat_room_id = '".$this->aChatRoom["id"]."') AND (user = '".$_SESSION["user"]."')") === false) {
            $oActive->setUser($_SESSION["user"]);
            $oActive->setChat_room_id($this->aChatRoom["id"]);
            $oActive->save();
            $oChatMsg->setChat_room_id($this->aChatRoom["id"]);
            $oChatMsg->setMsg_text($_SESSION["user"]." joined the chat");
            $oChatMsg->setCreated_at(date("Y.m.d H:i:s",time()));
            $oChatMsg->save();
        }

        if (!isset($_SESSION["chat".$this->aChatRoom["id"]])) {
            $_SESSION["chat".$this->aChatRoom["id"]] = $this->getLastMessageId($this->aChatRoom["id"]);
        }

        parent::render();
    }

    public function getLastMessageId($chatroomId)
    {
        $oChatMessages = new ChatMessage();
        $sWhere = "(chat_room_id = '".$chatroomId."') AND (user <> '')";
        $aMessage = $oChatMessages->loadList($sWhere,1,"id DESC");
        return $aMessage[0]["id"] ?? 0;
    }
}