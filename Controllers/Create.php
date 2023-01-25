<?php

class Create extends BaseController
{
    protected $title = "Create Chatroom";

    /**
     * @throws Exception
     */
    public function createRoom()
    {
        $sRoomName = $this->getRequestParameter("room_name");
        if ($sRoomName === false || $sRoomName === "") {
            throw new Exception("ROOM NAME CANT BE EMPTY");
        }
        $oChatRoom = new ChatRoom();
        if ($oChatRoom->loadByColumnValue("room_name",$sRoomName,1) === false) {
            $oChatRoom->setRoom_name($sRoomName);
            $oChatRoom->save();
            $oActive = new ChatActive();
            $oActive->setUser($this->getRequestParameter("user"));
            $oActive->setChat_room_id($oChatRoom->loadByColumnValue("room_name",$sRoomName,1)[0]["id"]);
            $oActive->save();

        } else {
            throw new Exception("ROOM NAME '".$sRoomName."' ALREADY IN USE");
        }


        $this->redirect($this->getUrl("chat/".$sRoomName."/"));
    }
}