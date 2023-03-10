<?php

class LoadActiveUsersAjax extends AjaxBaseController
{

    /**
     * loads list of active users by chat_room_id and echoes <li> string for each entry
     * @return void
     */
    protected function executeSqlQuery()
    {
        $sChatroomId = $this->getRequestParameter("id");

        $oActive = new ChatActive();
        $sWhere = "chat_room_id = '{$sChatroomId}'";
        $aActiveUsers = $oActive->loadList($sWhere);

        $sReturnString = "";
        if ($aActiveUsers !== false) {
            $sReturnString .= '<li class="list-group-item sticky-top list-group-item-dark">Active users:<a class="btn btn-sm btn-danger float-end" href="'.$this->getUrl().'">Leave chat</a></li>';
            foreach ($aActiveUsers as $user) {
                $sReturnString .= '<li class="list-group-item"><p>'.$user["user"].'</p></li>';
            }
        }
        echo $sReturnString;
    }
}