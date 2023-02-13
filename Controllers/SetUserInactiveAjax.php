<?php

class SetUserInactiveAjax extends AjaxBaseController
{
    /**
     * loads user id by username and chat_room_id and deletes it
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sUser = $this->getRequestParameter("user");
        $sRoomId = $this->getRequestParameter("roomId");
        $sWhere = " (chat_room_id = '".$sRoomId."') AND (user = '".$sUser."')";

        $oActive = new ChatActive();
        $oChatMsg = new ChatMessage();
        if ($oActive->loadList($sWhere,1) !== false) {
            $sActiveId = $oActive->loadList($sWhere,1)[0]["id"];
            $oActive->delete($sActiveId);
            if ($oActive->loadList("(chat_room_id = '".$sRoomId."')",1) !== false) {
                $this->sendUserLeftNotification($oChatMsg, $sRoomId, $sUser);
            } else {
                $oChatMsg->deleteJoinNotificationsByRoomId($sRoomId);
            }
        }
    }

    protected function sendUserLeftNotification ($oChatMsg, $sRoomId, $sUser)
    {
        $oChatMsg->setChat_room_id($sRoomId);
        $oChatMsg->setMsg_text($sUser." left the chat");
        $oChatMsg->setCreated_at(date("Y.m.d H:i:s",time()));
        $oChatMsg->save();
    }
}