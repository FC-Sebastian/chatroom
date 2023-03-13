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

        $sWhere = "room_name = '{$sChatroomName}'";
        $this->aChatRoom = $oChatroom->loadList($sWhere,1)[0];
        $this->title = $this->aChatRoom["room_name"];

        if (isset($_SESSION["user"]) && $oActive->loadList("(chat_room_id = '".$this->aChatRoom["id"]."') AND (user = '".$_SESSION["user"]."') AND active='1'") === false) {
            if ($oActive->loadList("(chat_room_id = '".$this->aChatRoom["id"]."') AND (user = '".$_SESSION["user"]."')") === false) {
                $oActive->setUser($_SESSION["user"]);
                $oActive->setChat_room_id($this->aChatRoom["id"]);
                $oActive->setActive(1);
                $oActive->save();
                $oChatMsg->setChat_room_id($this->aChatRoom["id"]);
                $oChatMsg->setMsg_text($_SESSION["user"]." joined the chat");
                $oChatMsg->save();
            } else {
                $aActiveUser = $oActive->loadList("(chat_room_id = '".$this->aChatRoom["id"]."') AND (user = '".$_SESSION["user"]."')")[0];
                $aActiveUser["active"] = 1;
                $oActive->assign($aActiveUser);
                $oActive->save();
            }

        }

        if (!isset($_SESSION["chat".$this->aChatRoom["id"]])) {
            $_SESSION["chat".$this->aChatRoom["id"]] = $this->getLastMessageId($this->aChatRoom["id"]);
        }

        parent::render();
    }

    /**
     * loads the id of the last message of given chatroom and returns it
     * @param $chatroomId
     * @return int|mixed
     */
    public function getLastMessageId($chatroomId)
    {
        $oChatMessages = new ChatMessage();
        $sWhere = "(chat_room_id = '".$chatroomId."') AND (user <> '')";
        $aMessage = $oChatMessages->loadList($sWhere,1,"id DESC");
        return $aMessage[0]["id"] ?? 0;
    }
}