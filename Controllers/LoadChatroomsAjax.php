<?php

class LoadChatroomsAjax extends AjaxBaseController
{

    /**
     * loads list of chat-rooms and echoes them as buttons
     * @return void
     */
    protected function executeSqlQuery()
    {
        $oChatroom = new ChatRoom();
        $aChatrooms = $oChatroom->loadList();

        $sReturnString = "";
        if ($aChatrooms !== false) {
            foreach ($aChatrooms as $chatroom) {
                $sReturnString .=
                    '<div class="col-lg-3 col-md-4 col-sm-5">
                        <button class="btn btn-outline-primary w-100 room-button" value="'.$chatroom["id"].'">'.$chatroom["room_name"].' | '.$this->getActive($chatroom["id"]).' active</button>
                    </div>';
            }
        }

        echo $sReturnString;
    }

    /**
     * loads list of active users for given chat_room_id
     * returns number of active users
     * @param $roomId
     * @return int
     */
    public function getActive($roomId)
    {
        $oActive = new ChatActive();
        $aRoomActive = $oActive->loadByColumnValue("chat_room_id", $roomId);
        if ($aRoomActive !== false) {
            return count($aRoomActive);
        } else {
            return 0;
        }
    }
}