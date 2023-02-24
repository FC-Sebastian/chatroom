<?php

class SendChatMsgAjax extends AjaxBaseController
{
    use Encryption;

    /**
     * saves the sent message into db and echoes it as <div> string
     * @return void
     */
    protected function executeSqlQuery()
    {
        $oChatMsg = new ChatMessage();
        $aData = [];
        $aData["chat_room_id"] = $this->getRequestParameter("roomId");
        $aData["user"] = $this->getRequestParameter("user");
        $text = htmlentities($this->getRequestParameter("text"));
        $aData["msg_text"] = $this->encrypt($text, Conf::getParam("key"));
        $aData["picture_url"] = $this->getFileUrlFromUpload();
        $oChatMsg->data = $aData;
        $oChatMsg->save();
    }

    /**
     * uploads send image and returns encrypted url
     * @return string
     */
    protected function getFileUrlFromUpload()
    {
        $sTmppath = $_FILES["upload"]["tmp_name"];
        $sOriginalName = $_FILES["upload"]["name"];
        $sExtension = substr($sOriginalName,strrpos($sOriginalName, "."));
        $sName = $this->getRequestParameter("roomId").$this->getRequestParameter("user").date("Y_m_d-H_i_s",time()).$sExtension;
        $sType = $_FILES["upload"]["type"];
        $sLocationbegin = __DIR__ . '\..\pics\\';
        $sLocation = $sLocationbegin . $sName;
        if (substr($sType, 0, 6) === "image/") {
            move_uploaded_file($sTmppath, $sLocation);
            return $this->encrypt($this->getUrl('pics/'.$sName), Conf::getParam("key"));
        }
        return "";
    }
}