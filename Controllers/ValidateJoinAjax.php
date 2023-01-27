<?php

class ValidateJoinAjax extends AjaxBaseController
{

    /**
     * checks if a given user exist in that chatroom
     * echoes valid if no and invalid if yes
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sRoomName = $this->getRequestParameter("roomName");
        $sUser = $this->getRequestParameter("user");

        $oChatRoom = new ChatRoom();
        $oActive = new ChatActive();

        $aRoomData = $oChatRoom->loadByColumnValue("room_name",$sRoomName,1);
        if ($aRoomData !== false) {
            $sWhere = "(chat_room_id = '".$aRoomData[0]["id"]."') AND (user = '".$sUser."')";
            if ($oActive->loadList($sWhere,1) === false) {
                echo "valid";
            } else {
                echo "invalid";
            }
        } else {
            echo "noRoom";
        }


    }
}