<?php

class ValidateCreateAjax extends AjaxBaseController
{

    /**
     * checks if a chat-room-name was entered and if that room exists already
     * echoes empty if no name was entered
     * echoes valid if name is unique
     * otherwise echoes invalid
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sRoomName = htmlspecialchars($this->getRequestParameter("roomName"));
        $oChatroom = new ChatRoom();
        $sWhere = "(room_name = '{$sRoomName}')";

        if ($sRoomName === false || $sRoomName === "") {
            echo "empty";
        } elseif ($oChatroom->loadList($sWhere,1) === false) {
            echo "valid";
        } else {
            echo "invalid";
        }
    }
}