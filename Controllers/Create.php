<?php

class Create extends BaseController
{
    protected $view = "createView";
    protected $title = "Create Chatroom";

    /**
     * @throws Exception
     */
    public function createRoom()
    {
        $sRoomName = $this->getRequestParameter("room_name");
        $oChatRoom = new ChatRoom();
        if ($oChatRoom->loadByColumnValue("room_name",$sRoomName,1) === false) {
            $oChatRoom->setRoom_name($sRoomName);
            $oChatRoom->save();
        } else {
            throw new Exception("ROOM NAME '".$sRoomName."' ALREADY IN USE");
        }
    }
}